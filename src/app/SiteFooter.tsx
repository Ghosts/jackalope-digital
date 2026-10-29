import Link from "next/link";
import { GitHubIcon } from "./GitHubIcon";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} Jackalope Digital LLC</p>

        <nav className={styles.nav} aria-label="Footer Navigation">
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
          <a href="mailto:contact@jackalope.digital" className={styles.footerLink}>
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
