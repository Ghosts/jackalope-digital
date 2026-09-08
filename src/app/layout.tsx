import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jackalope.digital"),
  title: {
    default: "Jackalope Digital | Software, Tools & Services",
    template: "%s | Jackalope Digital",
  },
  description:
    "Jackalope Digital builds software, tools, and services — including Jackalope, a desktop workspace for coding agents.",
  applicationName: "Jackalope Digital",
  keywords: [
    "Jackalope Digital",
    "jackalope.digital",
    "Jackalope",
    "jackalope.dev",
    "coding agents",
    "Moxie Docs",
    "developer tools",
    "software",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jackalope Digital | Software, Tools & Services",
    description:
      "Jackalope Digital builds software, tools, and services — including Jackalope, a desktop workspace for coding agents.",
    url: "/",
    siteName: "Jackalope Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jackalope Digital",
      },
    ],
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jackalope Digital | Software, Tools & Services",
    description:
      "Jackalope Digital builds software, tools, and services — including Jackalope, a desktop workspace for coding agents.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
