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
        <nav className={styles.nav} aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:contact@jackalope.dev">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
