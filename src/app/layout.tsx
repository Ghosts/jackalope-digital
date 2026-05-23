import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jackalope.dev"),
  title: {
    default: "Jackalope Digital",
    template: "%s | Jackalope Digital",
  },
  description: "Jackalope Digital builds software, tools, and services.",
  applicationName: "Jackalope Digital",
  keywords: ["Jackalope Digital", "jackalope.dev", "software", "tools", "services"],
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jackalope Digital",
    description: "Software, tools, and services from Jackalope Digital.",
    url: "/",
    siteName: "Jackalope Digital",
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary",
    title: "Jackalope Digital",
    description: "Software, tools, and services from Jackalope Digital.",
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
