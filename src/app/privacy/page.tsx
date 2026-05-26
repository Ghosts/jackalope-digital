import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Jackalope Digital LLC handles information on jackalope.dev.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <main className={styles.legal}>
        <Link className={styles.back} href="/">
          &#8592; back to jackalope.dev
        </Link>
        <p className={styles.prompt}>
          <span>guest@jackalope</span>:~$ cat PRIVACY
        </p>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: May 26, 2026</p>

        <p>
          This Privacy Policy explains how Jackalope Digital LLC (&ldquo;Jackalope
          Digital,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) handles information in
          connection with this website at jackalope.dev (the &ldquo;Site&rdquo;). The
          Site is a static, informational page. We have built it to do as little with
          your data as possible.
        </p>

        <h2>Information we collect</h2>
        <p>
          We do not collect personal information through this Site. There are no
          accounts, no sign-up forms, no analytics, no advertising, and no tracking
          cookies. We do not build profiles of visitors or sell data to anyone.
        </p>

        <h2>Server logs</h2>
        <p>
          Like most websites, the hosting provider that serves this Site may
          automatically record standard technical request data (such as IP address,
          browser type, and the time of a request) for security and reliability. We do
          not use this information to identify you, and we do not combine it with other
          data.
        </p>

        <h2>Links to other services</h2>
        <p>
          The Site links to products and services, including{" "}
          <a href="https://moxiedocs.com" target="_blank" rel="noopener noreferrer">
            Moxie Docs
          </a>
          . Those services are governed by their own privacy policies and terms, which
          we encourage you to review. This policy does not apply to any site or product
          you reach through an outbound link.
        </p>

        <h2>Children</h2>
        <p>
          The Site is not directed to children, and we do not knowingly collect
          information from anyone, including children under 13.
        </p>

        <h2>Changes</h2>
        <p>
          If we update this policy, we will revise the date above. Continued use of the
          Site after a change means you accept the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach us at{" "}
          <a href="mailto:contact@jackalope.dev">contact@jackalope.dev</a>.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
