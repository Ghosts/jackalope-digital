"use client";

import { useEffect, useRef } from "react";
import styles from "./FluidBackdrop.module.css";

type Rgb = [number, number, number];
type Palette = [Rgb, Rgb, Rgb];

/** One triangle that covers the screen. */
const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/**
 * Domain-warped noise: sample fractal noise, use the result to offset the next sample, and
 * repeat. The fine lines come from taking bands of the final value.
 */
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 5; octave++) {
    sum += amplitude * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / resolution.y;

  // Bend the field around the pointer.
  vec2 toPointer = uv - pointer;
  uv += toPointer * 0.35 * exp(-dot(toPointer, toPointer) * 5.0);

  vec2 q = vec2(fbm(uv * 1.3 + time * 0.06), fbm(uv * 1.3 + vec2(5.2, 1.3) - time * 0.05));
  vec2 w = vec2(fbm(uv * 1.1 + 3.0 * q + time * 0.04), fbm(uv * 1.1 + 3.0 * q + vec2(8.3, 2.8)));
  float field = fbm(uv + 3.4 * w);

  float band = abs(fract(field * 11.0 + time * 0.08) - 0.5) * 2.0;
  vec3 color = mix(colorA, colorB, smoothstep(0.25, 0.75, field));
  color = mix(color, colorC, smoothstep(0.45, 1.05, length(w)) * 0.7);
  color *= 0.7 + 0.3 * smoothstep(0.0, 0.2, band);
  color += smoothstep(0.9, 1.0, band) * 0.16;

  gl_FragColor = vec4(color, 1.0);
}`;

/**
 * Canvas pixels per CSS pixel. The field is soft, so it starts well below native resolution
 * and only sharpens on devices that have frame time to spare.
 */
const START_SCALE = 0.5;
const MIN_SCALE = 0.3;
const MAX_SCALE = 1.25;
/** Average frame times (ms) that raise or lower quality, or give up on animating. */
const FAST_FRAME_MS = 19;
const SLOW_FRAME_MS = 26;
const TOO_SLOW_FRAME_MS = 45;
const FRAMES_PER_MEASUREMENT = 20;
/** Seconds of flow already "elapsed" at load, chosen because the field looks good there. */
const TIME_OFFSET = 12;
/** How far the colors move toward their target each frame. */
const COLOR_RATE = 0.05;

function hexToRgb(hex: string): Rgb | null {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [match[1], match[2], match[3]].map((channel) => Number.parseInt(channel, 16) / 255) as Rgb;
}

function parsePalette(value: string | undefined): Palette | null {
  const colors = (value ?? "").split(",").map(hexToRgb);
  return colors.length === 3 && colors.every(Boolean) ? (colors as Palette) : null;
}

function linkProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX_SHADER],
    [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** True when WebGL is emulated on the CPU, where a full-screen shader would stall the page. */
function isSoftwareRenderer(gl: WebGLRenderingContext): boolean {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
}

/**
 * One fixed WebGL canvas behind the page. Its three colors come from the `--field` custom
 * property (set per theme in CSS) and ease toward the `data-palette` of whichever element the
 * pointer or keyboard focus is on. A CSS gradient paints first and stays if WebGL is missing.
 * Reduced motion, or a device that cannot keep up, gets a still frame that only redraws when
 * the colors change.
 */
export function FluidBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");

    let gl: WebGLRenderingContext | null = null;
    let uniform: Record<string, WebGLUniformLocation | null> = {};
    let canAnimate = true;
    let renderScale = START_SCALE;
    let maxScale = MAX_SCALE;
    let measuredFrames = 0;
    let measuredMs = 0;
    let lastDraw = 0;
    let frame = 0;
    let idle = 0;
    let basePalette: Palette | null = null;
    let target: Palette | null = null;
    let colors: Palette | null = null;
    let pointer: [number, number] = [0, 0];
    let pointerTarget: [number, number] = [0, 0];

    const readBase = () => {
      basePalette = parsePalette(getComputedStyle(canvas).getPropertyValue("--field"));
    };

    const resize = () => {
      if (!gl) return;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * renderScale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * renderScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const setScale = (scale: number) => {
      renderScale = Math.min(maxScale, Math.max(MIN_SCALE, scale));
      resize();
    };

    /** Every few frames, trade resolution for frame rate in whichever direction is needed. */
    const adaptQuality = (now: number) => {
      // A long gap means the tab was hidden or the loop paused, not that a frame was slow.
      if (lastDraw > 0 && now - lastDraw < 500) {
        measuredMs += now - lastDraw;
        measuredFrames += 1;
      }
      lastDraw = now;
      if (measuredFrames < FRAMES_PER_MEASUREMENT) return;
      const average = measuredMs / measuredFrames;
      measuredFrames = 0;
      measuredMs = 0;
      if (average > TOO_SLOW_FRAME_MS && renderScale <= MIN_SCALE) canAnimate = false;
      else if (average > SLOW_FRAME_MS) setScale(renderScale * 0.7);
      else if (average < FAST_FRAME_MS && renderScale < maxScale) setScale(renderScale * 1.25);
    };

    const draw = (now: number) => {
      if (!gl || gl.isContextLost() || !colors) return;
      const flowing = canAnimate && !reduce.matches;
      gl.uniform2f(uniform.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniform.pointer, flowing ? pointer[0] : 0, flowing ? pointer[1] : 0);
      gl.uniform1f(uniform.time, flowing ? now / 1000 + TIME_OFFSET : TIME_OFFSET);
      gl.uniform3fv(uniform.colorA, colors[0]);
      gl.uniform3fv(uniform.colorB, colors[1]);
      gl.uniform3fv(uniform.colorC, colors[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      frame = 0;
      const goal = target ?? basePalette;
      if (!goal || !colors) return;
      if (!canAnimate || reduce.matches) {
        // A still frame jumps straight to its colors.
        colors = goal;
        draw(now);
        return;
      }
      adaptQuality(now);
      colors = colors.map((color, i) =>
        color.map((value, channel) => value + (goal[i][channel] - value) * COLOR_RATE),
      ) as Palette;
      pointer = [
        pointer[0] + (pointerTarget[0] - pointer[0]) * 0.06,
        pointer[1] + (pointerTarget[1] - pointer[1]) * 0.06,
      ];
      draw(now);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!frame && gl) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
      const program = gl ? linkProgram(gl) : null;
      if (!gl || !program) {
        gl = null;
        return;
      }
      // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      for (const name of ["resolution", "pointer", "time", "colorA", "colorB", "colorC"]) {
        uniform[name] = gl.getUniformLocation(program, name);
      }
      maxScale = Math.min(window.devicePixelRatio || 1, MAX_SCALE);
      canAnimate = !isSoftwareRenderer(gl);
      renderScale = canAnimate ? Math.min(START_SCALE, maxScale) : MIN_SCALE;
      readBase();
      colors = target ?? basePalette;
      if (!colors) return;
      resize();
      draw(performance.now());
      canvas.dataset.ready = "true";
      wake();
    };

    // Hovering or focusing anything with a data-palette pulls the field toward its colors.
    const paletteAt = (node: EventTarget | null) =>
      node instanceof Element
        ? parsePalette(node.closest<HTMLElement>("[data-palette]")?.dataset.palette)
        : null;
    const over = (event: Event) => {
      target = paletteAt(event.target);
      wake();
    };
    const out = (event: FocusEvent) => {
      target = paletteAt(event.relatedTarget);
      wake();
    };
    const move = (event: PointerEvent) => {
      pointerTarget = [
        (event.clientX - window.innerWidth / 2) / window.innerHeight,
        -(event.clientY - window.innerHeight / 2) / window.innerHeight,
      ];
    };
    const onResize = () => {
      resize();
      wake();
    };
    const recolor = () => {
      readBase();
      wake();
    };
    // The theme toggle flips data-theme on the root; the OS scheme can change underneath it.
    const theme = new MutationObserver(recolor);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    scheme.addEventListener("change", recolor);
    reduce.addEventListener("change", wake);
    document.addEventListener("pointerover", over);
    document.addEventListener("focusin", over);
    document.addEventListener("focusout", out);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", onResize);

    // The CSS gradient is already on screen. Swap in the shader once the page is settled.
    const schedule = () => {
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(start, { timeout: 2000 });
      else idle = setTimeout(start, 200) as unknown as number;
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      clearTimeout(idle);
      theme.disconnect();
      scheme.removeEventListener("change", recolor);
      reduce.removeEventListener("change", wake);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("focusin", over);
      document.removeEventListener("focusout", out);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", schedule);
      uniform = {};
      gl = null;
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
