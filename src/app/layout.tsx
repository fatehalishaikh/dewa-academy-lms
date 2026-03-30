import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEWA Academy",
  description: "DEWA Academy School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/dewa-logo-only.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
