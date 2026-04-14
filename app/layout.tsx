import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEWA Academy",
  description: "DEWA Academy School Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("lms_theme")?.value;
  const isDark = theme !== "light"; // default to dark
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${isDark ? "dark" : ""}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/dewa-logo-only.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
