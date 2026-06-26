"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import SiteFooter from "./SiteFooter";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
    });

    const white = new THREE.Color(0xf8f7f1);
    const lavender = new THREE.Color(0xb99cff);
    const specimenMaterial = new THREE.MeshStandardMaterial({
      color: 0x191817,
      metalness: 0,
      roughness: 0.96,
    });
    const antlerMaterial = new THREE.MeshStandardMaterial({
      color: lavender,
      emissive: new THREE.Color(0x221634),
      emissiveIntensity: 0.2,
      metalness: 0,
      opacity: 0.62,
      roughness: 0.88,
      transparent: true,
    });
    const starMaterial = new THREE.MeshBasicMaterial({
      color: white,
      opacity: 0.34,
      transparent: true,
    });
    const scanWireMaterial = new THREE.MeshBasicMaterial({
      color: lavender,
      depthWrite: false,
      opacity: 0.055,
      transparent: true,
      wireframe: true,
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    camera.position.set(0, 0.22, 8.4);
    scene.add(new THREE.HemisphereLight(0x18161f, 0x000000, 1.28));

    const keyLight = new THREE.DirectionalLight(0xe8dfd2, 2.1);
    keyLight.position.set(2.4, 4.2, 4.8);
    scene.add(keyLight);

    const frontLift = new THREE.DirectionalLight(0xd8d1c6, 0.72);
    frontLift.position.set(-2.4, 1.3, 5.2);
    scene.add(frontLift);

    const lavenderRim = new THREE.DirectionalLight(lavender, 0.95);
    lavenderRim.position.set(-4.2, 2.2, 3.2);
    scene.add(lavenderRim);

    const lowFill = new THREE.DirectionalLight(0xd2f3f2, 0.2);
    lowFill.position.set(3.6, -0.6, -2.4);
    scene.add(lowFill);

    const specimen = new THREE.Group();
    const stars = new THREE.Group();
    scene.add(specimen, stars);

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
      const geometry = createAntlerGeometry(points, radius);
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

      if (!mergedGeometry) {
        return;
      }

      const mesh = new THREE.Mesh(mergedGeometry, [specimenMaterial, ...antlerGeometries.map(() => antlerMaterial)]);
      specimen.add(mesh);

      const wireMesh = new THREE.Mesh(mergedGeometry.clone(), scanWireMaterial);
      wireMesh.scale.setScalar(1.0015);
      specimen.add(wireMesh);
    });

    for (let index = 0; index < 56; index += 1) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.004, 0.004), starMaterial);
      mesh.position.set((Math.random() - 0.5) * 11, (Math.random() - 0.5) * 7, -3 - Math.random() * 4);
      stars.add(mesh);
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const compact = width < 560;
      const portrait = height > width;
      const tablet = width >= 560 && width < 1100;
      const short = height < 640;
      const wide = width >= 1440;
      let specimenPosition: [number, number, number] = wide ? [-1.74, 0.08, 0] : [-1.58, 0.08, 0];
      let specimenScale = wide ? 1 : 0.94;

      if (tablet) {
        specimenPosition = width < 820 ? [-0.38, portrait ? 1.02 : 0.46, 0] : [-1.22, 0.06, 0];
        specimenScale = width < 820 ? 0.68 : 0.78;
      }

      if (compact) {
        specimenPosition = [portrait ? -0.16 : -0.86, portrait ? 0.94 : 0.34, 0];
        specimenScale = portrait ? 0.94 : 0.56;
      }

      if (short) {
        specimenPosition[1] += compact ? 0.26 : -0.1;
        specimenScale *= compact ? 0.82 : 0.92;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      specimen.position.set(...specimenPosition);
      specimen.scale.setScalar(specimenScale);
    }

    let animationFrame = 0;

    function render(time = 0) {
      const seconds = time * 0.001;
      specimen.rotation.y = -0.52 + Math.sin(seconds * 0.28) * 0.08;
      specimen.rotation.x = -0.02 + Math.sin(seconds * 0.18) * 0.018;
      specimen.rotation.z = Math.sin(seconds * 0.16) * 0.01;
      stars.rotation.z = seconds * 0.006;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    }

    function disposeObject(object: THREE.Object3D) {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const material = object.material;

        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material.dispose();
        }
      }
    }

    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      scene.traverse(disposeObject);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <main>
        <section className={styles.terminal} aria-labelledby="title">
          <canvas ref={canvasRef} className={styles.scene} aria-label="Local combined jackalope mesh scan" />

          <div className={styles.column}>
            <section className={styles.readout}>
              <p className={styles.prompt}>
                <span>guest@jackalope</span>:~$ wake
              </p>
              <h1 id="title">Jackalope Digital</h1>
              <dl>
                <div>
                  <dt>domain</dt>
                  <dd>jackalope.dev</dd>
                </div>
                <div>
                  <dt>work</dt>
                  <dd>software / tools / services</dd>
                </div>
                <div>
                  <dt>mail</dt>
                  <dd>contact@jackalope.dev</dd>
                </div>
              </dl>
              <p className={styles.cursor} aria-hidden="true">
                _
              </p>
            </section>

            <section className={styles.products} aria-labelledby="products-title">
              <p className={styles.prompt}>
                <span>guest@jackalope</span>:~$ ls ./products
              </p>
              <h2 id="products-title" className={styles.productsTitle}>
                What we ship
              </h2>

              <ul className={styles.productGrid}>
                <li>
                  <a
                    className={styles.productCard}
                    href="https://moxiedocs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.productLogo} aria-hidden="true">
                      <Image src="/moxie-fox.svg" alt="" width={40} height={40} />
                    </span>
                    <span className={styles.productBody}>
                      <span className={styles.productName}>Moxie Docs</span>
                      <span className={styles.productDesc}>
                        Living documentation for private GitHub repos. Generates searchable
                        docs, checks PRs for alignment, and surfaces gaps before merge.
                      </span>
                      <span className={styles.productLink}>moxiedocs.com &#8599;</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className={styles.productCard}
                    href="https://github.com/Jackalope-Dev/lichess-streamer-mode"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.productLogo} aria-hidden="true">
                      <Image
                        src="/streamer-mode.svg"
                        alt=""
                        width={40}
                        height={40}
                      />
                    </span>
                    <span className={styles.productBody}>
                      <span className={styles.productName}>Streamer Mode for Lichess</span>
                      <span className={styles.productDesc}>
                        Browser extension that hides every username on Lichess so streamers
                        can play without getting stream-sniped. One-click toggle, fully
                        private, free.
                      </span>
                      <span className={styles.productLink}>github.com &#8599;</span>
                    </span>
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
