import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jackalope.digital"),
  title: {
    default: "Jackalope Digital | Software, Tools & Services",
    template: "%s | Jackalope Digital",
  },
  description:
    "Jackalope Digital is an independent software studio building developer tools, documentation systems, and digital services.",
  applicationName: "Jackalope Digital",
  keywords: [
    "Jackalope Digital",
    "jackalope.digital",
    "Moxie Docs",
    "software studio",
    "developer tools",
    "documentation automation",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jackalope Digital | Software, Tools & Services",
    description:
      "Independent software studio building developer tools, documentation systems, and digital services.",
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
      "Independent software studio building developer tools, documentation systems, and digital services.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
