import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniSphere",
  description: "Where Student Life Meets Productivity",
  icons : {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/laptop-lightmode.svg",
        href: "/laptop-lightmode.svg"
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/laptop-darkmode.svg",
        href: "/laptop-darkmode.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
