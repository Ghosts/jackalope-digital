"use client";

import { Anybody } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useCallback, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { FluidBackdrop } from "./FluidBackdrop";
import { GitHubIcon } from "./GitHubIcon";
import styles from "./page.module.css";

// Display type with a width axis, so titles can start condensed and widen as they arrive.
const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-anybody",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://jackalope.digital/#organization",
      name: "Jackalope Digital LLC",
      url: "https://jackalope.digital",
      email: "contact@jackalope.digital",
      description: "Jackalope Digital builds software, tools, and services.",
      sameAs: ["https://github.com/Jackalope-Dev", "https://jackalope.dev"],
      founder: { "@id": "https://jackalope.digital/#founder" },
    },
    {
      "@type": "Person",
      "@id": "https://jackalope.digital/#founder",
      name: "Caden Sumner",
      jobTitle: "Founder",
      image: "https://jackalope.digital/caden.jpg",
      sameAs: ["https://x.com/cadensumner", "https://github.com/ghosts"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://jackalope.dev/#software",
      name: "Jackalope",
      url: "https://jackalope.dev",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows",
      description:
        "A desktop app and CLI to run coding agents in parallel, manage project context, and review their changes.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://moxiedocs.com/#software",
      name: "Moxie Docs",
      url: "https://moxiedocs.com",
      description: "Living documentation for GitHub repositories.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://allmcps.com/#software",
      name: "AllMCPs",
      url: "https://allmcps.com",
      description: "Directory for Model Context Protocol servers.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://resumeskip.com/#software",
      name: "ResumeSkip",
      url: "https://resumeskip.com",
      description:
        "ATS-tailored resumes and application tracker, with extensions for Chrome and Firefox.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://lopebase.com/#software",
      name: "LopeBase",
      url: "https://lopebase.com",
      description:
        "One ops console for every SaaS product you run, covering SEO, analytics, and uptime from an MCP server or the CLI.",
    },
  ],
};

type Product = {
  name: string;
  href: string;
  desc: string;
  details: string;
  logo: string;
  /** The logo is already a full rounded tile, so it fills the icon frame. */
  tile?: boolean;
  /** Solid card color and the text color on it. Text must keep 4.5:1 against the card. */
  card: string;
  ink: string;
  /** Three colors the background field eases toward while the card is hovered or focused. */
  palette: string;
};

const INK = "#0d0b13";

const feature = {
  card: "#c4b2f7",
  ink: INK,
  palette: "#e3d9ff,#8f6bff,#3a1cc4",
};

const products: Product[] = [
  {
    name: "Moxie Docs",
    href: "https://moxiedocs.com",
    desc: "Living documentation for GitHub repos",
    details:
      "Keeps your docs in step with your code. Moxie reads your repos, flags the docs a change makes stale, and gives coding agents your conventions over MCP.",
    logo: "/moxie-fox.svg",
    card: "#f0553f",
    ink: INK,
    palette: "#ffb199,#ed4530,#7a1206",
  },
  {
    name: "AllMCPs",
    href: "https://allmcps.com",
    desc: "Model Context Protocol server directory",
    details:
      "Find Model Context Protocol servers for the tools you already use, so your AI assistant can work with them directly.",
    logo: "/allmcps-icon.svg",
    card: "#3fd0ff",
    ink: INK,
    palette: "#00e5ff,#007bff,#0a1a6b",
  },
  {
    name: "ResumeSkip",
    href: "https://resumeskip.com",
    desc: "ATS resume tailor, tracker and browser extension",
    details:
      "Tailor your resume to each job's ATS keywords and track every application in one place. Extensions for Chrome and Firefox work right from the job listing.",
    logo: "/resumeskip-icon.svg",
    tile: true,
    card: "#ffb347",
    ink: INK,
    palette: "#ffd9a8,#ff6b35,#8a2a00",
  },
  {
    name: "LopeBase",
    href: "https://lopebase.com",
    desc: "Ops console for every SaaS product you run",
    details:
      "SEO, analytics, uptime, and content for all your products in one place. Ask questions and make changes from your AI agent over MCP, or from the CLI.",
    logo: "/lopebase-icon.svg",
    tile: true,
    card: "#7b52c9",
    ink: "#ffffff",
    palette: "#cdb4ff,#7b52c9,#27105e",
  },
];

const statement = "Building software, better";

/** Card colors and arrival order, passed to CSS as custom properties. */
function cardStyle(card: string, ink: string, index: number) {
  return { "--card": card, "--card-ink": ink, "--i": index } as CSSProperties;
}

export default function Home() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyEmail = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("contact@jackalope.digital");
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast("contact@jackalope.digital copied");
      toastTimeoutRef.current = setTimeout(() => setToast(null), 2500);
    }
  }, []);

  return (
    <div className={`${styles.page} ${anybody.variable}`}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from constants
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FluidBackdrop />

      {/* Blended with the canvas: the name and mark are windows onto the field. */}
      <header className={styles.veil}>
        <div className={styles.lockup}>
          <h1 className={styles.name}>
            Jackalope
            <br />
            Digital
          </h1>
          <BrandMark className={styles.heroMark} />
        </div>
      </header>
      <div className={styles.grain} aria-hidden="true" />

      <main className={styles.contentWrapper}>
        {/* Each word lights up in turn. Screen readers get the plain sentence. */}
        <p className={styles.lede}>
          <span className={styles.visuallyHidden}>{statement}</span>
          <span aria-hidden="true">
            {statement.split(" ").map((word, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed sentence, never reordered
                key={index}
                className={styles.word}
                style={{ "--i": index } as CSSProperties}
              >
                {word}{" "}
              </span>
            ))}
          </span>
        </p>

        <div className={styles.cards}>
          <a
            href="https://jackalope.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.feature}
            data-palette={feature.palette}
            style={cardStyle(feature.card, feature.ink, 0)}
          >
            <span className={styles.featureHead}>
              <BrandMark className={styles.featureMark} />
              <span className={`${styles.cardName} ${styles.featureName}`}>Jackalope</span>
            </span>
            <span className={styles.featureBody}>
              <span className={styles.featureDesc}>
                Run coding agents in parallel, keep project context, and review every change. A calm
                desktop app and CLI.
              </span>
              <span className={styles.cardLink}>
                jackalope.dev <span className={styles.arrow}>&#8599;</span>
              </span>
            </span>
          </a>

          <div className={styles.apps}>
            {products.map((product, index) => (
              <a
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.app}
                data-palette={product.palette}
                style={cardStyle(product.card, product.ink, index + 1)}
              >
                <span
                  className={`${styles.appIcon} ${product.tile ? styles.appIconTile : ""}`}
                  aria-hidden="true"
                >
                  <Image src={product.logo} alt="" width={128} height={128} unoptimized />
                </span>
                <span className={`${styles.cardName} ${styles.appName}`}>{product.name}</span>
                <span className={styles.appDesc}>{product.desc}</span>
                <span className={styles.appDetails}>{product.details}</span>
                <span className={styles.cardLink}>
                  {new URL(product.href).hostname} <span className={styles.arrow}>&#8599;</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <button type="button" onClick={handleCopyEmail} className={styles.emailBtn}>
          contact@jackalope.digital
        </button>
        <a
          href="https://github.com/Jackalope-Dev"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.footerLink} ${styles.iconLink}`}
        >
          <GitHubIcon />
          GitHub
        </a>
        <Link href="/about" className={styles.footerLink}>
          About
        </Link>
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
