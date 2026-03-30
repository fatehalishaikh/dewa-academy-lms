import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${geist.variable}${isDark ? " dark" : ""}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/dewa-logo-only.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
