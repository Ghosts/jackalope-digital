import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AsciiMark } from "../AsciiMark";
import { EchoBackdrop } from "../EchoBackdrop";
import SiteFooter from "../SiteFooter";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jackalope Digital is run by Caden Sumner, a senior software engineer who has built products at WeMod, Dashlane and Visa.",
  alternates: {
    canonical: "/about",
  },
};

const experience = [
  { company: "WeMod", role: "Senior Software Engineer", years: "2023 to now" },
  { company: "Dashlane", role: "Senior Software Engineer", years: "2021 to 2023" },
  { company: "Visa", role: "Fullstack Engineer", years: "2020 to 2021" },
  { company: "Burgundy Labs", role: "Principal Architect & Co-Founder", years: "2018 to 2025" },
  { company: "Xeratec", role: "Software Engineer", years: "2017 to 2018" },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <EchoBackdrop />

      <main className={styles.main}>
        <Link className={styles.back} href="/">
          &#8592; Back to Home
        </Link>

        <article className={styles.card}>
          <AsciiMark className={styles.mark} />

          <div className={styles.body}>
            <header className={styles.head}>
              <Image
                src="/caden.jpg"
                alt="Caden Sumner"
                width={160}
                height={160}
                className={styles.photo}
                priority
                unoptimized
              />
              <div>
                <h1 className={styles.title}>About</h1>
                <p className={styles.byline}>Caden Sumner, founder of Jackalope Digital</p>
              </div>
            </header>

            <p className={styles.text}>
              Jackalope Digital is run by Caden Sumner, a senior software engineer with 8+ years of
              building products people use every day. Caden has led growth and onboarding work at
              WeMod and Dashlane, built B2B applications at Visa, and co-founded Burgundy Labs, a
              SaaS platform used by more than 7,000 university students.
            </p>
            <p className={styles.text}>
              Every product here gets the same care: clear onboarding, accessible interfaces, and
              releases you can trust. Caden studied Computer Science and Psychology at Michigan
              Tech.
            </p>

            <h2 className={styles.subtitle}>Experience</h2>
            <ul className={styles.timeline}>
              {experience.map((job) => (
                <li key={job.company} className={styles.job}>
                  <span className={styles.company}>{job.company}</span>
                  <span className={styles.role}>{job.role}</span>
                  <span className={styles.years}>{job.years}</span>
                </li>
              ))}
            </ul>

            <div className={styles.links}>
              <a
                href="https://x.com/cadensumner"
                target="_blank"
                rel="noopener noreferrer me"
                className={styles.link}
              >
                Follow @cadensumner on X &#8599;
              </a>
              <Link href="/" className={styles.link}>
                See the products &#8594;
              </Link>
            </div>
          </div>
        </article>

        <SiteFooter />
      </main>
    </div>
  );
}
