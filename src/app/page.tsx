"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import SiteFooter from "./SiteFooter";
import styles from "./page.module.css";

interface TerminalLog {
  id: string;
  command: string;
  timestamp: string;
  output: React.ReactNode;
}

const AVAILABLE_COMMANDS = [
  "help",
  "apps",
  "moxie",
  "allmcps",
  "resumeskip",
  "about",
  "contact",
  "status",
  "stack",
  "specimen",
  "github",
  "time",
  "quote",
  "clear",
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalLogRef = useRef<HTMLDivElement>(null);
  const spinVelocityRef = useRef<number>(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://jackalope.digital/#organization",
        "name": "Jackalope Digital LLC",
        "url": "https://jackalope.digital",
        "logo": "https://jackalope.digital/icon.png",
        "email": "contact@jackalope.digital",
        "description": "Jackalope Digital builds software, tools, and services.",
        "sameAs": ["https://github.com/Jackalope-Dev"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://moxiedocs.com/#software",
        "name": "Moxie Docs",
        "url": "https://moxiedocs.com",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "description":
          "Living documentation for private GitHub repos. Generates searchable docs, checks PRs for alignment, and surfaces gaps before merge.",
        "publisher": {
          "@id": "https://jackalope.digital/#organization",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://allmcps.com/#software",
        "name": "AllMCPs",
        "url": "https://allmcps.com",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "description":
          "The definitive directory for discovering and installing Model Context Protocol servers.",
        "publisher": {
          "@id": "https://jackalope.digital/#organization",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://resumeskip.com/#software",
        "name": "ResumeSkip",
        "url": "https://resumeskip.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description":
          "Tailors the resume you already have to any job posting: ATS-readable output, an application tracker, without inventing experience.",
        "publisher": {
          "@id": "https://jackalope.digital/#organization",
        },
      },
    ],
  };

  const handleCopyEmail = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText("contact@jackalope.digital");
    setToastMessage("contact@jackalope.digital copied to clipboard");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const trigger3dSpin = useCallback(() => {
    spinVelocityRef.current = 0.28;
  }, []);

  const executeCommand = useCallback((rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").trim();
    const logId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timeString = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

    let output: React.ReactNode = null;

    if (cmd === "clear" || cmd === "cls" || cmd === "reset") {
      setTerminalLogs([]);
      setCommandInput("");
      return;
    }

    switch (cmd) {
      case "help":
      case "?":
      case "commands":
      case "man":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>JACKALOPE DIGITAL CLI // COMMAND REFERENCE</p>
            <div className={styles.cmdHelpGrid}>
              <div className={styles.cmdCategory}>
                <span className={styles.cmdCategoryTitle}>NAVIGATION &amp; APPS</span>
                <div><span className={styles.codeTag}>apps</span> or <span className={styles.codeTag}>ls</span> - List all studio software products</div>
                <div><span className={styles.codeTag}>moxie</span> - Moxie Docs details &amp; jump</div>
                <div><span className={styles.codeTag}>allmcps</span> - AllMCPs directory details &amp; jump</div>
                <div><span className={styles.codeTag}>resumeskip</span> - ResumeSkip ATS tool details &amp; jump</div>
                <div><span className={styles.codeTag}>about</span> or <span className={styles.codeTag}>whoami</span> - Studio overview &amp; mission</div>
              </div>
              <div className={styles.cmdCategory}>
                <span className={styles.cmdCategoryTitle}>STUDIO &amp; UTILITIES</span>
                <div><span className={styles.codeTag}>contact</span> or <span className={styles.codeTag}>email</span> - Copy studio email to clipboard</div>
                <div><span className={styles.codeTag}>github</span> or <span className={styles.codeTag}>git</span> - Open Jackalope GitHub organization</div>
                <div><span className={styles.codeTag}>status</span> or <span className={styles.codeTag}>ping</span> - Live service health &amp; diagnostics</div>
                <div><span className={styles.codeTag}>stack</span> or <span className={styles.codeTag}>tech</span> - View technologies &amp; architecture</div>
                <div><span className={styles.codeTag}>specimen</span> or <span className={styles.codeTag}>spin</span> - 3D Jackalope telemetry &amp; acceleration</div>
                <div><span className={styles.codeTag}>time</span> - Display UTC &amp; local timestamps</div>
                <div><span className={styles.codeTag}>quote</span> - Studio philosophy motto</div>
                <div><span className={styles.codeTag}>cat &lt;file&gt;</span> - Read files (e.g. ABOUT.md, README.md)</div>
                <div><span className={styles.codeTag}>clear</span> - Wipe terminal output history</div>
              </div>
            </div>
            <p className={styles.cmdTip}>Tip: Use [Up/Down] arrows for history, [Tab] to autocomplete, or click any chip above.</p>
          </div>
        );
        break;

      case "ls":
      case "apps":
      case "products":
      case "dir":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>DIRECTORY LISTING: /products (3 items)</p>
            <div className={styles.cmdAppList}>
              <div className={styles.cmdAppItem}>
                <div className={styles.cmdAppHead}>
                  <span className={styles.cmdAppName}>1. Moxie Docs</span>
                  <span className={styles.statusLive}>[LIVE]</span>
                </div>
                <p className={styles.cmdAppDesc}>
                  Living documentation for private GitHub repos. Generates searchable docs, checks PRs for alignment, and surfaces gaps before merge.
                </p>
                <div className={styles.cmdAppActions}>
                  <a href="https://moxiedocs.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                    Launch moxiedocs.com &#8599;
                  </a>
                  <button type="button" onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} className={styles.cmdActionBtnSec}>
                    View Section &#8595;
                  </button>
                </div>
              </div>

              <div className={styles.cmdAppItem}>
                <div className={styles.cmdAppHead}>
                  <span className={styles.cmdAppName}>2. AllMCPs</span>
                  <span className={styles.statusLive}>[LIVE]</span>
                </div>
                <p className={styles.cmdAppDesc}>
                  The definitive directory for discovering and installing Model Context Protocol servers so AI agents can find tools fast.
                </p>
                <div className={styles.cmdAppActions}>
                  <a href="https://allmcps.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                    Launch allmcps.com &#8599;
                  </a>
                  <button type="button" onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} className={styles.cmdActionBtnSec}>
                    View Section &#8595;
                  </button>
                </div>
              </div>

              <div className={styles.cmdAppItem}>
                <div className={styles.cmdAppHead}>
                  <span className={styles.cmdAppName}>3. ResumeSkip</span>
                  <span className={styles.statusLive}>[LIVE]</span>
                </div>
                <p className={styles.cmdAppDesc}>
                  Tailors the resume you already have to any job posting with ATS-readable output and application tracking without fabricating experience.
                </p>
                <div className={styles.cmdAppActions}>
                  <a href="https://resumeskip.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                    Launch resumeskip.com &#8599;
                  </a>
                  <button type="button" onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} className={styles.cmdActionBtnSec}>
                    View Section &#8595;
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case "moxie":
      case "moxiedocs":
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>PRODUCT INSPECTION: MOXIE DOCS</p>
            <p><strong>Living documentation for private GitHub repositories.</strong></p>
            <p className={styles.mutedText}>
              Moxie generates searchable docs from your codebase, checks pull requests for architectural alignment, and surfaces documentation gaps before merging.
            </p>
            <div className={styles.cmdAppActions}>
              <a href="https://moxiedocs.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                Open moxiedocs.com &#8599;
              </a>
            </div>
          </div>
        );
        break;

      case "allmcps":
      case "mcp":
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>PRODUCT INSPECTION: ALLMCPS</p>
            <p><strong>The definitive Model Context Protocol server directory.</strong></p>
            <p className={styles.mutedText}>
              Discover, compare, and install verified MCP servers. Equip AI coding assistants and autonomous agents with seamless tool integrations.
            </p>
            <div className={styles.cmdAppActions}>
              <a href="https://allmcps.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                Open allmcps.com &#8599;
              </a>
            </div>
          </div>
        );
        break;

      case "resumeskip":
      case "resume":
        if (productsRef.current) {
          productsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>PRODUCT INSPECTION: RESUMESKIP</p>
            <p><strong>ATS-tailored resumes built strictly from your authentic experience.</strong></p>
            <p className={styles.mutedText}>
              Aligns your actual qualifications with job description keywords, generates matched cover letters, and organizes applications without inventing false credentials.
            </p>
            <div className={styles.cmdAppActions}>
              <a href="https://resumeskip.com" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                Open resumeskip.com &#8599;
              </a>
            </div>
          </div>
        );
        break;

      case "about":
      case "whoami":
      case "bio":
      case "studio":
        if (aboutRef.current) {
          aboutRef.current.scrollIntoView({ behavior: "smooth" });
        }
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>STUDIO IDENTITY: JACKALOPE DIGITAL LLC</p>
            <p>
              Independent software studio crafting targeted developer tools, documentation systems, and digital utilities.
            </p>
            <p className={styles.mutedText}>
              Engineered with a focus on speed, clarity, reliability, and privacy. Built for developers, builders, and professionals who value precision over noise.
            </p>
            <div className={styles.metaRow}>
              <span>Status: Active &amp; Independent</span>
              <span>Focus: Dev Tools &amp; Web Systems</span>
            </div>
          </div>
        );
        break;

      case "contact":
      case "email":
      case "mail":
        handleCopyEmail();
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>STUDIO CONTACT CHANNEL</p>
            <p>
              Email: <span className={styles.cyanHighlight}>contact@jackalope.digital</span>
            </p>
            <p className={styles.mutedText}>
              [System]: Copied address to your clipboard automatically. Typical response turnaround is within 24 hours.
            </p>
            <div className={styles.cmdAppActions}>
              <a href="mailto:contact@jackalope.digital" className={styles.cmdActionBtn}>
                Compose Mail Client &#8599;
              </a>
            </div>
          </div>
        );
        break;

      case "github":
      case "git":
      case "repo":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>JACKALOPE GITHUB REPOSITORIES</p>
            <p>Public packages, open-source repositories, and MCP implementations.</p>
            <div className={styles.cmdAppActions}>
              <a href="https://github.com/Jackalope-Dev" target="_blank" rel="noopener noreferrer" className={styles.cmdActionBtn}>
                Visit github.com/Jackalope-Dev &#8599;
              </a>
            </div>
          </div>
        );
        break;

      case "status":
      case "ping":
      case "health":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>STUDIO DIAGNOSTIC &amp; SYSTEM HEALTH</p>
            <div className={styles.statusTable}>
              <div className={styles.statusRow}>
                <span>jackalope.digital</span>
                <span className={styles.statusBadgeOk}>200 OK (Edge)</span>
              </div>
              <div className={styles.statusRow}>
                <span>moxiedocs.com</span>
                <span className={styles.statusBadgeOk}>200 OK (Online)</span>
              </div>
              <div className={styles.statusRow}>
                <span>allmcps.com</span>
                <span className={styles.statusBadgeOk}>200 OK (Online)</span>
              </div>
              <div className={styles.statusRow}>
                <span>resumeskip.com</span>
                <span className={styles.statusBadgeOk}>200 OK (Online)</span>
              </div>
              <div className={styles.statusRow}>
                <span>WebGL 3D Engine</span>
                <span className={styles.statusBadgeOk}>60 FPS (Stanford Bunny Active)</span>
              </div>
            </div>
            <p className={styles.mutedText}>All systems operational. Zero degraded services detected.</p>
          </div>
        );
        break;

      case "stack":
      case "tech":
      case "architecture":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>TECHNOLOGY &amp; RUNTIME STACK</p>
            <div className={styles.stackGrid}>
              <div><span className={styles.lavenderTag}>Frontend:</span> Next.js 16, React 19, TypeScript</div>
              <div><span className={styles.lavenderTag}>Graphics:</span> Three.js, WebGL2, Custom Frenet-Frame Catmull-Rom Shaders</div>
              <div><span className={styles.lavenderTag}>Edge:</span> Cloudflare Workers, OpenNext Edge SSR</div>
              <div><span className={styles.lavenderTag}>Ecosystem:</span> Model Context Protocol (MCP), GitHub REST &amp; GraphQL APIs</div>
            </div>
          </div>
        );
        break;

      case "specimen":
      case "bunny":
      case "spin":
      case "3d":
        trigger3dSpin();
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>3D SPECIMEN TELEMETRY &amp; PHYSICS BOOST</p>
            <p><strong>Stanford Bunny Mesh + Procedural Antler Topology</strong></p>
            <div className={styles.stackGrid}>
              <div>Vertices: 69,451</div>
              <div>Antler Tines: 8 (4 pairs)</div>
              <div>Material: ACES Filmic Specular + Wireframe Scan Overlay</div>
              <div>Rotation Engine: Three.js Animated Catmull-Rom Curve Matrix</div>
            </div>
            <p className={styles.cyanHighlight}>[Physics Impulse Applied: Boosted 3D Jackalope specimen spin speed.]</p>
            <div className={styles.cmdAppActions}>
              <button type="button" onClick={trigger3dSpin} className={styles.cmdActionBtn}>
                Trigger Spin Pulse Again &#8635;
              </button>
            </div>
          </div>
        );
        break;

      case "time":
      case "date":
      case "clock": {
        const now = new Date();
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>TIMESTAMP TELEMETRY</p>
            <p>UTC Time: <span className={styles.cyanHighlight}>{now.toUTCString()}</span></p>
            <p>Local Time: <span className={styles.lavenderTag}>{now.toLocaleString()}</span></p>
            <p className={styles.mutedText}>ISO 8601: {now.toISOString()}</p>
          </div>
        );
        break;
      }

      case "quote":
      case "motto":
      case "fortune": {
        const quotes = [
          "Fast, focused tools engineered for clarity, reliability, and privacy.",
          "Good software gets out of the way and lets you ship.",
          "Built with purpose. Stripped of bloat.",
          "Living documentation transforms tribal knowledge into institutional speed.",
          "The best tools feel like extensions of your thought process.",
        ];
        const chosen = quotes[Math.floor(Math.random() * quotes.length)];
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdHeader}>STUDIO PHILOSOPHY</p>
            <p className={styles.quoteBlock}>&ldquo;{chosen}&rdquo;</p>
            <p className={styles.mutedText}>&mdash; Jackalope Digital Principles</p>
          </div>
        );
        break;
      }

      case "cat":
        if (arg.toLowerCase() === "about.md" || arg.toLowerCase() === "about") {
          output = (
            <div className={styles.cmdOutputBlock}>
              <p className={styles.cmdHeader}>FILE CONTENTS: ABOUT.md</p>
              <p>
                Jackalope Digital LLC is an independent software studio crafting targeted developer tools,
                documentation systems, and digital utilities. We build fast, focused tools engineered for clarity,
                reliability, and privacy.
              </p>
            </div>
          );
        } else if (arg.toLowerCase() === "products.md" || arg.toLowerCase() === "products" || arg.toLowerCase() === "readme.md") {
          output = (
            <div className={styles.cmdOutputBlock}>
              <p className={styles.cmdHeader}>FILE CONTENTS: {arg.toUpperCase() || "README.md"}</p>
              <p># Jackalope Digital Products</p>
              <p>- Moxie Docs (https://moxiedocs.com): Living documentation for GitHub repos</p>
              <p>- AllMCPs (https://allmcps.com): The Model Context Protocol server directory</p>
              <p>- ResumeSkip (https://resumeskip.com): ATS resume tailor &amp; application tracker</p>
            </div>
          );
        } else if (arg.toLowerCase() === "license" || arg.toLowerCase() === "license.md") {
          output = (
            <div className={styles.cmdOutputBlock}>
              <p className={styles.cmdHeader}>FILE CONTENTS: LICENSE</p>
              <p>&copy; {new Date().getFullYear()} Jackalope Digital LLC. All rights reserved.</p>
            </div>
          );
        } else {
          output = (
            <div className={styles.cmdOutputBlock}>
              <p className={styles.cmdError}>cat: {arg || "(no file specified)"}: No such file or directory.</p>
              <p className={styles.mutedText}>Available virtual files: ABOUT.md, PRODUCTS.md, README.md, LICENSE</p>
            </div>
          );
        }
        break;

      case "echo":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p>{arg || ""}</p>
          </div>
        );
        break;

      case "sudo":
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdError}>guest is not in the sudoers file. This incident will be reported to the jackalope.</p>
          </div>
        );
        break;

      default:
        output = (
          <div className={styles.cmdOutputBlock}>
            <p className={styles.cmdError}>Command not found: &apos;{trimmed}&apos;</p>
            <p className={styles.mutedText}>
              Type <span className={styles.codeTag}>help</span> or click any command chip above to see available options.
            </p>
          </div>
        );
        break;
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: logId,
        command: trimmed,
        timestamp: timeString,
        output,
      },
    ]);

    setCommandInput("");

    // Auto-scroll terminal log to bottom smoothly
    setTimeout(() => {
      if (terminalLogRef.current) {
        terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
      }
    }, 50);
  }, [handleCopyEmail, trigger3dSpin]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(commandInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setCommandInput(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCommandInput(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = commandInput.trim().toLowerCase();
      if (!current) return;
      const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(current));
      if (match) {
        setCommandInput(match);
      }
    }
  };

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

      // Handle baseline gentle rotation + optional physics spin boost impulse
      if (spinVelocityRef.current > 0.0001) {
        specimen.rotation.y += spinVelocityRef.current;
        spinVelocityRef.current *= 0.94;
      } else {
        specimen.rotation.y = -0.52 + Math.sin(seconds * 0.28) * 0.08;
      }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <section className={styles.terminal} aria-labelledby="title">
          <canvas
            ref={canvasRef}
            className={styles.scene}
            aria-label="Local combined jackalope mesh scan"
          />

          <div className={styles.column}>
            <section className={styles.readout}>
              <div className={styles.promptHeader}>
                <div className={styles.prompt}>
                  <span>guest@jackalope</span>:~$ <span className={styles.promptActive}>interactive</span>
                </div>
                <div className={styles.commandChips} role="toolbar" aria-label="Terminal quick commands">
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("help")}
                    title="View all commands"
                  >
                    help
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("apps")}
                    title="List studio apps"
                  >
                    apps
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("moxie")}
                    title="Moxie Docs details"
                  >
                    moxie
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("allmcps")}
                    title="AllMCPs directory details"
                  >
                    allmcps
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("resumeskip")}
                    title="ResumeSkip details"
                  >
                    resumeskip
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("status")}
                    title="System status diagnostic"
                  >
                    status
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("stack")}
                    title="Technology stack"
                  >
                    stack
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("specimen")}
                    title="3D Jackalope telemetry & spin pulse"
                  >
                    spin 3D
                  </button>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={() => executeCommand("contact")}
                    title="Copy email & contact channels"
                  >
                    contact
                  </button>
                </div>
              </div>

              {/* Interactive CLI Input Form */}
              <form
                className={styles.cliForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCommand(commandInput);
                }}
              >
                <div className={styles.cliPromptPrefix}>
                  <span>guest@jackalope</span>:~$
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.cliInput}
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type 'help', 'apps', 'status', 'spin'..."
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Interactive terminal command input"
                />
                <button type="submit" className={styles.cliSubmitBtn} title="Execute command">
                  run &#8629;
                </button>
              </form>

              {/* Terminal Logs Output Feed */}
              {terminalLogs.length > 0 && (
                <div className={styles.terminalConsole} ref={terminalLogRef}>
                  <div className={styles.terminalConsoleHead}>
                    <span className={styles.terminalTitleBar}>
                      <span className={styles.statusDot}></span> TERMINAL OUTPUT ({terminalLogs.length})
                    </span>
                    <button
                      type="button"
                      className={styles.clearBtn}
                      onClick={() => setTerminalLogs([])}
                      title="Clear terminal output"
                    >
                      clear
                    </button>
                  </div>
                  <div className={styles.terminalLogList}>
                    {terminalLogs.map((log) => (
                      <div key={log.id} className={styles.terminalLogEntry}>
                        <div className={styles.logPromptLine}>
                          <span className={styles.logTimestamp}>[{log.timestamp}]</span>
                          <span className={styles.logUser}>guest@jackalope:~$</span>
                          <span className={styles.logCmd}>{log.command}</span>
                        </div>
                        <div className={styles.logOutputBody}>{log.output}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h1 id="title">Jackalope Digital</h1>

              <dl>
                <div>
                  <dt>domain</dt>
                  <dd>jackalope.digital</dd>
                </div>
                <div>
                  <dt>work</dt>
                  <dd>software / tools / services</dd>
                </div>
                <div>
                  <dt>mail</dt>
                  <dd>
                    <button
                      type="button"
                      className={styles.copyEmailBtn}
                      onClick={handleCopyEmail}
                      title="Click to copy email address"
                    >
                      contact@jackalope.digital
                      <span className={styles.copyIcon}>&#x2309;</span>
                    </button>
                  </dd>
                </div>
              </dl>

              {toastMessage && (
                <div className={styles.toastNotification} role="status">
                  <span className={styles.toastPrompt}>[sys]:</span> {toastMessage}
                </div>
              )}

              <p className={styles.cursor} aria-hidden="true">
                _
              </p>
            </section>

            <section
              ref={aboutRef}
              className={styles.about}
              aria-labelledby="about-title"
            >
              <p className={styles.prompt}>
                <span>guest@jackalope</span>:~$ cat ABOUT.md
              </p>
              <h2 id="about-title" className={styles.sectionTitle}>
                Studio Overview
              </h2>
              <p className={styles.aboutText}>
                Jackalope Digital LLC is an independent software studio crafting targeted
                developer tools, documentation systems, and digital utilities. We build fast,
                focused tools engineered for clarity, reliability, and privacy.
              </p>
            </section>

            <section
              ref={productsRef}
              className={styles.products}
              aria-labelledby="products-title"
            >
              <p className={styles.prompt}>
                <span>guest@jackalope</span>:~$ ls ./products
              </p>
              <h2 id="products-title" className={styles.sectionTitle}>
                Featured Products
              </h2>

              <div className={styles.productRows}>
                <a
                  className={styles.productRow}
                  href="https://moxiedocs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.productLogo} aria-hidden="true">
                    <Image src="/moxie-fox.svg" alt="" width={36} height={36} />
                  </span>

                  <div className={styles.productRowBody}>
                    <div className={styles.productRowHead}>
                      <span className={styles.productName}>Moxie Docs</span>
                    </div>
                    <span className={styles.productDesc}>
                      Living documentation for private GitHub repos. Generates searchable
                      docs, checks PRs for alignment, and surfaces gaps before merge.
                    </span>
                    <div className={styles.tagGrid}>
                      <span className={styles.tag}>Living Docs</span>
                      <span className={styles.tag}>PR Alignment</span>
                      <span className={styles.tag}>Private GitHub Repos</span>
                      <span className={styles.tag}>Automated Insights</span>
                    </div>
                  </div>

                  <span className={styles.productLink}>
                    moxiedocs.com <span className={styles.arrow} aria-hidden="true">&#8599;</span>
                  </span>
                </a>

                <a
                  className={styles.productRow}
                  href="https://allmcps.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.productLogo} aria-hidden="true">
                    <Image src="/allmcps-icon.svg" alt="" width={36} height={36} />
                  </span>

                  <div className={styles.productRowBody}>
                    <div className={styles.productRowHead}>
                      <span className={styles.productName}>AllMCPs</span>
                    </div>
                    <span className={styles.productDesc}>
                      The definitive directory for discovering and installing Model Context
                      Protocol servers, so AI agents can find the right tools fast.
                    </span>
                    <div className={styles.tagGrid}>
                      <span className={styles.tag}>MCP Directory</span>
                      <span className={styles.tag}>Server Discovery</span>
                      <span className={styles.tag}>One-Click Install</span>
                      <span className={styles.tag}>Agent Tooling</span>
                    </div>
                  </div>

                  <span className={styles.productLink}>
                    allmcps.com <span className={styles.arrow} aria-hidden="true">&#8599;</span>
                  </span>
                </a>

                <a
                  className={styles.productRow}
                  href="https://resumeskip.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.productLogo} aria-hidden="true">
                    <Image src="/resumeskip-icon.svg" alt="" width={36} height={36} />
                  </span>

                  <div className={styles.productRowBody}>
                    <div className={styles.productRowHead}>
                      <span className={styles.productName}>ResumeSkip</span>
                    </div>
                    <span className={styles.productDesc}>
                      Tailors the resume you already have to any job posting. Rephrases and
                      reorders real experience into ATS-readable output, without inventing
                      what you didn&apos;t do.
                    </span>
                    <div className={styles.tagGrid}>
                      <span className={styles.tag}>ATS Tailoring</span>
                      <span className={styles.tag}>Cover Letters</span>
                      <span className={styles.tag}>Application Tracker</span>
                      <span className={styles.tag}>Job Listings</span>
                    </div>
                  </div>

                  <span className={styles.productLink}>
                    resumeskip.com <span className={styles.arrow} aria-hidden="true">&#8599;</span>
                  </span>
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
