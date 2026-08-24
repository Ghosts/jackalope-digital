import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jackalope.digital"),
  title: {
    default: "Jackalope Digital | Software, Tools & Services",
    template: "%s | Jackalope Digital",
  },
  description:
    "Jackalope Digital builds software, tools, and services.",
  applicationName: "Jackalope Digital",
  keywords: [
    "Jackalope Digital",
    "jackalope.digital",
    "Moxie Docs",
    "developer tools",
    "software",
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
      "Jackalope Digital builds software, tools, and services.",
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
      "Jackalope Digital builds software, tools, and services.",
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
