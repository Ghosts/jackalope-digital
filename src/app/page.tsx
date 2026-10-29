"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { EchoBackdrop } from "./EchoBackdrop";
import { GitHubIcon } from "./GitHubIcon";
import styles from "./page.module.css";

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
};

const products: Product[] = [
  {
    name: "Moxie Docs",
    href: "https://moxiedocs.com",
    desc: "Living documentation for GitHub repos",
    details:
      "Keeps your docs in step with your code. Moxie reads your repos, flags the docs a change makes stale, and gives coding agents your conventions over MCP.",
    logo: "/moxie-fox.svg",
  },
  {
    name: "AllMCPs",
    href: "https://allmcps.com",
    desc: "Model Context Protocol server directory",
    details:
      "Find Model Context Protocol servers for the tools you already use, so your AI assistant can work with them directly.",
    logo: "/allmcps-icon.svg",
  },
  {
    name: "ResumeSkip",
    href: "https://resumeskip.com",
    desc: "ATS resume tailor, tracker & browser extension",
    details:
      "Tailor your resume to each job's ATS keywords and track every application in one place. Extensions for Chrome and Firefox work right from the job listing.",
    logo: "/resumeskip-icon.svg",
  },
  {
    name: "LopeBase",
    href: "https://lopebase.com",
    desc: "Ops console for every SaaS product you run",
    details:
      "SEO, analytics, uptime, and content for all your products in one place. Ask questions and make changes from your AI agent over MCP, or from the CLI.",
    logo: "/lopebase-icon.svg",
  },
];

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
    <div className={styles.page}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from constants
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EchoBackdrop />

      <main className={styles.contentWrapper}>
        <header className={styles.header}>
          <BrandMark className={styles.mark} />
          <h1 className={styles.title}>Jackalope Digital</h1>
          <p className={styles.subtitle}>software · tools · services</p>
        </header>

        <a
          href="https://jackalope.dev"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.feature}
        >
          <BrandMark className={styles.featureMark} />
          <div className={styles.featureBody}>
            <span className={styles.featureTag}>New · Desktop app &amp; CLI</span>
            <span className={styles.featureName}>Jackalope &#8599;</span>
            <span className={styles.featureDesc}>
              A calm desktop &amp; CLI workspace to run coding agents in parallel, keep project
              context, and review every change.
            </span>
            <span className={styles.featureLink}>jackalope.dev</span>
          </div>
        </a>

        <div className={styles.productsList}>
          {products.map((product) => (
            <a
              key={product.href}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.productItem}
            >
              <span className={styles.productLogo} aria-hidden="true">
                <Image src={product.logo} alt="" width={64} height={64} unoptimized />
              </span>
              <span className={styles.productBody}>
                <span className={styles.productHead}>
                  <span className={styles.productName}>{product.name} &#8599;</span>
                  <span className={styles.productDesc}>{product.desc}</span>
                </span>
                <span className={styles.productMore}>
                  <span className={styles.productDetails}>{product.details}</span>
                </span>
              </span>
            </a>
          ))}
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
