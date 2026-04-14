import type { Metadata } from "next";
import { cookies } from "next/headers";
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
    <html lang="en" className={`${isDark ? "dark" : ""}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dubai:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/dewa-logo-only.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
