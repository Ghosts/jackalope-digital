import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of jackalope.dev.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <main className={styles.legal}>
        <Link className={styles.back} href="/">
          &#8592; back to jackalope.dev
        </Link>
        <p className={styles.prompt}>
          <span>guest@jackalope</span>:~$ cat TERMS
        </p>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: May 26, 2026</p>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website at
          jackalope.dev (the &ldquo;Site&rdquo;), operated by Jackalope Digital LLC
          (&ldquo;Jackalope Digital,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By
          accessing the Site, you agree to these Terms. If you do not agree, please do
          not use the Site.
        </p>

        <h2>The Site</h2>
        <p>
          The Site is a static, informational page about Jackalope Digital and the
          products and services we build. It is provided for general information only
          and does not create any business, advisory, or contractual relationship.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The Site&rsquo;s content, design, and marks are owned by Jackalope Digital or
          its licensors and are protected by applicable laws. You may view and share
          the Site, but you may not copy, modify, or redistribute its content for
          commercial purposes without our written permission. Third-party names and
          logos shown on the Site are the property of their respective owners.
        </p>

        <h2>External links and products</h2>
        <p>
          The Site links to external products and services, including{" "}
          <a href="https://moxiedocs.com" target="_blank" rel="noopener noreferrer">
            Moxie Docs
          </a>
          . Each of those has its own separate terms and privacy policy that govern your
          use of it. We are not responsible for the content or practices of any
          third-party site you reach through an outbound link.
        </p>

        <h2>No warranties</h2>
        <p>
          The Site is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
          without warranties of any kind, whether express or implied. We do not warrant
          that the Site will be uninterrupted, error-free, or free of harmful
          components.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Jackalope Digital will not be liable
          for any indirect, incidental, or consequential damages arising out of your
          use of, or inability to use, the Site.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. When we do, we will revise the
          date above. Continued use of the Site after a change means you accept the
          updated Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:contact@jackalope.dev">contact@jackalope.dev</a>.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
