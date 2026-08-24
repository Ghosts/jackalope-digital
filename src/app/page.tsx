"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://jackalope.digital/#organization",
        "name": "Jackalope Digital LLC",
        "url": "https://jackalope.digital",
        "email": "contact@jackalope.digital",
        "description": "Jackalope Digital builds software, tools, and services.",
        "sameAs": ["https://github.com/Jackalope-Dev"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://moxiedocs.com/#software",
        "name": "Moxie Docs",
        "url": "https://moxiedocs.com",
        "description": "Living documentation for private GitHub repositories.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://allmcps.com/#software",
        "name": "AllMCPs",
        "url": "https://allmcps.com",
        "description": "Directory for Model Context Protocol servers.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://resumeskip.com/#software",
        "name": "ResumeSkip",
        "url": "https://resumeskip.com",
        "description": "ATS-tailored resumes and application tracker.",
      },
    ],
  };

  const handleCopyEmail = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("contact@jackalope.digital");
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast("contact@jackalope.digital copied");
      toastTimeoutRef.current = setTimeout(() => setToast(null), 2500);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    camera.position.set(0, 0.2, 8.4);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x08080a, 1.3));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3.5, 4.5, 4.5);
    scene.add(keyLight);

    const frontFill = new THREE.DirectionalLight(0xd4d4d8, 0.9);
    frontFill.position.set(-2.5, 1.5, 4.5);
    scene.add(frontFill);

    const rimLightLeft = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLightLeft.position.set(-4.5, 2.5, -2.5);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xa1a1aa, 1.0);
    rimLightRight.position.set(4.0, -1.0, -3.0);
    scene.add(rimLightRight);

    // Monochromatic Sculptural Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1e22,
      metalness: 0.1,
      roughness: 0.8,
    });

    const antlerMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e4,
      metalness: 0.35,
      roughness: 0.45,
    });

    const specimenGroup = new THREE.Group();
    scene.add(specimenGroup);

    function createAntlerGeometry(points: Array<[number, number, number]>, radius: number) {
      const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
      const ringCount = 24;
      const sideCount = 7;
      const frames = curve.computeFrenetFrames(ringCount, false);
      const positions: number[] = [];
      const indices: number[] = [];

      for (let ring = 0; ring <= ringCount; ring += 1) {
        const t = ring / ringCount;
        const center = curve.getPoint(t);
        const width = Math.max(radius * 0.18, radius * (1 - t * 0.78));
        const normal = frames.normals[ring];
        const binormal = frames.binormals[ring];

        for (let side = 0; side < sideCount; side += 1) {
          const angle = (side / sideCount) * Math.PI * 2 + (ring % 2) * 0.08;
          const irregular = 1 + Math.sin((ring + 1) * (side + 3) * 1.73) * 0.09;
          const oval = 0.78 + Math.cos(t * Math.PI) * 0.08;
          const vertex = center
            .clone()
            .addScaledVector(normal, Math.cos(angle) * width * irregular)
            .addScaledVector(binormal, Math.sin(angle) * width * oval * irregular);

          positions.push(vertex.x, vertex.y, vertex.z);
        }
      }

      for (let ring = 0; ring < ringCount; ring += 1) {
        for (let side = 0; side < sideCount; side += 1) {
          const current = ring * sideCount + side;
          const next = ring * sideCount + ((side + 1) % sideCount);
          const above = (ring + 1) * sideCount + side;
          const aboveNext = (ring + 1) * sideCount + ((side + 1) % sideCount);

          indices.push(current, above, next, next, above, aboveNext);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    }

    function createAntler(points: Array<[number, number, number]>, radius: number) {
      return createAntlerGeometry(points, radius);
    }

    function createAntlerRoot(side: number) {
      const rootGeometry = new THREE.IcosahedronGeometry(1, 2);
      const matrix = new THREE.Matrix4().compose(
        new THREE.Vector3(-0.72, 0.54, side * 0.18),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, side * 0.12, side * 0.08)),
        new THREE.Vector3(0.052, 0.032, 0.06),
      );
      rootGeometry.applyMatrix4(matrix);
      return rootGeometry;
    }

    function buildAntlerGeometries() {
      return [-1, 1].flatMap((side) => [
        createAntlerRoot(side),
        createAntler(
          [
            [-0.72, 0.54, side * 0.18],
            [-0.72, 0.82, side * 0.22],
            [-0.66, 1.1, side * 0.31],
            [-0.58, 1.36, side * 0.42],
            [-0.5, 1.58, side * 0.54],
          ],
          0.028,
        ),
        createAntler(
          [
            [-0.72, 0.86, side * 0.23],
            [-0.9, 1.0, side * 0.36],
            [-1.06, 1.14, side * 0.52],
          ],
          0.018,
        ),
        createAntler(
          [
            [-0.64, 1.14, side * 0.33],
            [-0.64, 1.36, side * 0.5],
            [-0.62, 1.56, side * 0.68],
          ],
          0.015,
        ),
        createAntler(
          [
            [-0.72, 0.72, side * 0.2],
            [-0.94, 0.8, side * 0.32],
            [-1.1, 0.92, side * 0.46],
          ],
          0.015,
        ),
      ]);
    }

    const loader = new STLLoader();

    function normalizeGeometry(geometry: THREE.BufferGeometry) {
      const normalized = geometry.index ? geometry.toNonIndexed() : geometry.clone();
      Object.keys(normalized.attributes).forEach((attributeName) => {
        if (attributeName !== "position" && attributeName !== "normal") {
          normalized.deleteAttribute(attributeName);
        }
      });
      normalized.computeVertexNormals();
      return normalized;
    }

    loader.load("/models/stanford-bunny.stl", (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      geometry.rotateX(-Math.PI / 2);
      geometry.rotateZ(-0.05);
      geometry.scale(0.027, 0.027, 0.027);
      geometry.translate(-0.04, -0.06, 0);

      const scanGeometry = normalizeGeometry(geometry);
      const antlerGeometries = buildAntlerGeometries().map(normalizeGeometry);
      const mergedGeometry = mergeGeometries([scanGeometry, ...antlerGeometries], true);

      if (!mergedGeometry) return;

      const mesh = new THREE.Mesh(mergedGeometry, [
        bodyMaterial,
        ...antlerGeometries.map(() => antlerMaterial),
      ]);
      specimenGroup.add(mesh);
    });

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      specimenGroup.position.set(0, width < 768 ? 0.2 : 0, 0);
      specimenGroup.scale.setScalar(width < 768 ? 1.05 : 1.35);
    }

    let animationFrame = 0;

    function render(time = 0) {
      const seconds = time * 0.001;

      // Gentle continuous ambient drift (non-interactive)
      specimenGroup.rotation.y = -0.4 + seconds * 0.12;
      specimenGroup.rotation.x = Math.sin(seconds * 0.6) * 0.015;
      specimenGroup.position.y = (window.innerWidth < 768 ? 0.2 : 0) + Math.sin(seconds * 0.9) * 0.035;

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    }

    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fullscreen Background 3D Jackalope (Non-interactive & smoothly blended) */}
      <canvas
        ref={canvasRef}
        className={styles.sceneCanvas}
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <main className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Jackalope Digital</h1>
          <p className={styles.subtitle}>software / tools / services</p>
        </div>

        <div className={styles.productsList}>
          <a
            href="https://moxiedocs.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.productItem}
          >
            <span className={styles.productName}>Moxie Docs &#8599;</span>
            <span className={styles.productDesc}>Living documentation for private GitHub repos</span>
          </a>

          <a
            href="https://allmcps.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.productItem}
          >
            <span className={styles.productName}>AllMCPs &#8599;</span>
            <span className={styles.productDesc}>Model Context Protocol server directory</span>
          </a>

          <a
            href="https://resumeskip.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.productItem}
          >
            <span className={styles.productName}>ResumeSkip &#8599;</span>
            <span className={styles.productDesc}>ATS resume tailor &amp; tracker</span>
          </a>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className={styles.footer}>
        <button type="button" onClick={handleCopyEmail} className={styles.emailBtn}>
          contact@jackalope.digital
        </button>
        <a
          href="https://github.com/Jackalope-Dev"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          GitHub
        </a>
        <Link href="/privacy" className={styles.footerLink}>
          Privacy
        </Link>
        <Link href="/terms" className={styles.footerLink}>
          Terms
        </Link>
      </footer>

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
