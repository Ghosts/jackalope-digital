import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jackalope Digital",
  description: "Jackalope Digital. Software, tools, experiments. contact@jackalope.dev",
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
