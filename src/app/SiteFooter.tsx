import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.prompt}>
        <span>guest@jackalope</span>:~$ cat LICENSE
      </p>
      <div className={styles.row}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Jackalope Digital LLC. All rights reserved.
        </p>
        <nav className={styles.nav} aria-label="Footer Navigation">
          <a href="https://moxiedocs.com" target="_blank" rel="noopener noreferrer">
            Moxie Docs <span className={styles.arrow} aria-hidden="true">&#8599;</span>
          </a>
          <a href="https://github.com/Jackalope-Dev" target="_blank" rel="noopener noreferrer">
            GitHub <span className={styles.arrow} aria-hidden="true">&#8599;</span>
          </a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:contact@jackalope.digital">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
