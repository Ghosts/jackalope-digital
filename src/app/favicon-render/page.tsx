"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FaviconRender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const hideDevIndicators = () => {
      document.querySelectorAll("nextjs-portal").forEach((element) => {
        (element as HTMLElement).style.display = "none";
      });
    };
    const hideDevIndicatorTimer = window.setInterval(hideDevIndicators, 50);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(2);
    renderer.setSize(512, 512, false);
    renderer.setClearColor(0x030304, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 20);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0x221834, 0x030304, 1.1));

    const key = new THREE.DirectionalLight(0xf1e8ff, 2.4);
    key.position.set(1.8, 3.2, 4.6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xb99cff, 1.4);
    rim.position.set(-3.8, 2.4, 3.6);
    scene.add(rim);

    const low = new THREE.DirectionalLight(0xa8e7e6, 0.28);
    low.position.set(2.4, -1.5, 3.2);
    scene.add(low);

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
        createAntlerGeometry(
          [
            [-0.72, 0.54, side * 0.18],
            [-0.72, 0.82, side * 0.22],
            [-0.66, 1.1, side * 0.31],
            [-0.58, 1.36, side * 0.42],
            [-0.5, 1.58, side * 0.54],
          ],
          0.028,
        ),
        createAntlerGeometry(
          [
            [-0.72, 0.86, side * 0.23],
            [-0.9, 1.0, side * 0.36],
            [-1.06, 1.14, side * 0.52],
          ],
          0.018,
        ),
        createAntlerGeometry(
          [
            [-0.64, 1.14, side * 0.33],
            [-0.64, 1.36, side * 0.5],
            [-0.62, 1.56, side * 0.68],
          ],
          0.015,
        ),
        createAntlerGeometry(
          [
            [-0.72, 0.72, side * 0.2],
            [-0.94, 0.8, side * 0.32],
            [-1.1, 0.92, side * 0.46],
          ],
          0.015,
        ),
      ]);
    }

    const antlerMaterial = new THREE.MeshStandardMaterial({
      color: 0xb99cff,
      emissive: new THREE.Color(0x241238),
      emissiveIntensity: 0.3,
      metalness: 0,
      roughness: 0.82,
    });
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0e8ff,
      depthWrite: false,
      opacity: 0.24,
      transparent: true,
      wireframe: true,
    });

    const antlers = new THREE.Group();
    buildAntlerGeometries().forEach((geometry) => {
      geometry.computeVertexNormals();
      antlers.add(new THREE.Mesh(geometry, antlerMaterial));

      const wire = new THREE.Mesh(geometry.clone(), wireMaterial);
      wire.scale.setScalar(1.006);
      antlers.add(wire);
    });

    const box = new THREE.Box3().setFromObject(antlers);
    const center = box.getCenter(new THREE.Vector3());
    antlers.position.sub(center);

    const pivot = new THREE.Group();
    pivot.add(antlers);
    pivot.rotation.set(-0.05, -0.62, 0.04);
    scene.add(pivot);

    const rotatedBox = new THREE.Box3().setFromObject(pivot);
    const size = rotatedBox.getSize(new THREE.Vector3());
    pivot.scale.setScalar(3.55 / Math.max(size.x, size.y, size.z));
    pivot.position.y = -0.05;

    renderer.render(scene, camera);
    hideDevIndicators();
    window.setTimeout(() => {
      hideDevIndicators();
      document.documentElement.dataset.ready = "true";
    }, 600);

    return () => {
      window.clearInterval(hideDevIndicatorTimer);
      renderer.dispose();
    };
  }, []);

  return (
    <main
      style={{
        alignItems: "center",
        background: "#030304",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", height: 512, width: 512 }} />
    </main>
  );
}
