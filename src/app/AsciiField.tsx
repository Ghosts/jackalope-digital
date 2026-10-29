"use client";

import { useEffect, useRef } from "react";
import styles from "./AsciiField.module.css";

const GLYPHS = "01<>/\\{}[]#$%&*+=?:;.~^";
const FRAME_MS = 1000 / 15;

/**
 * Garbled text noise along the bottom of the page. Each cell keeps its own threshold, so
 * the field holds its shape while slow drifting swells thicken and thin it and a few glyphs
 * scramble every frame. Reduced motion draws one still frame and a hidden tab stops drawing.
 */
export function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    let width = 0;
    let height = 0;
    let cellWidth = 0;
    let cellHeight = 0;
    let cols = 0;
    let rows = 0;
    let grid: string[] = [];
    let seeds = new Float32Array(0);
    let ink = "";
    let frame = 0;
    let last = 0;

    const measure = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const size = width < 640 ? 11 : 12;
      cellWidth = size * 0.75;
      cellHeight = size * 1.2;
      cols = Math.ceil(width / cellWidth);
      rows = Math.ceil(height / cellHeight);
      context.font = `500 ${size}px ui-monospace, "SFMono-Regular", Consolas, monospace`;
      context.textBaseline = "top";
      grid = Array.from({ length: cols * rows }, pick);
      seeds = new Float32Array(cols * rows);
      for (let index = 0; index < seeds.length; index++) seeds[index] = Math.random();
      ink = getComputedStyle(canvas).color;
    };

    const draw = (now: number) => {
      const time = reduce.matches ? 0 : now / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = ink;
      const scramble = Math.ceil(grid.length * 0.012);
      for (let index = 0; index < scramble; index++) {
        grid[Math.floor(Math.random() * grid.length)] = pick();
      }
      for (let row = 0; row < rows; row++) {
        // Thickest at the bottom edge, thinning out toward the top of the band.
        const base = ((row + 1) / rows) ** 2.4 * 0.55;
        for (let col = 0; col < cols; col++) {
          const swell =
            Math.sin(col * 0.06 + time * 0.18) * Math.sin(row * 0.17 - time * 0.12 + col * 0.02);
          const density = base * (0.65 + swell * 0.45);
          const index = row * cols + col;
          const seed = seeds[index];
          if (seed > density) continue;
          context.globalAlpha = 0.25 + (1 - seed / density) * 0.6;
          context.fillText(grid[index], col * cellWidth, row * cellHeight);
        }
      }
      context.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduce.matches || document.hidden) {
        draw(0);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const resize = new ResizeObserver(() => {
      measure();
      draw(performance.now());
    });
    resize.observe(canvas);
    // The theme toggle flips data-theme on the root; the OS scheme can change underneath it.
    const recolor = () => {
      ink = getComputedStyle(canvas).color;
      draw(performance.now());
    };
    const theme = new MutationObserver(recolor);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    scheme.addEventListener("change", recolor);
    reduce.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", recolor);
      reduce.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);
  return <canvas ref={ref} className={styles.field} />;
}
