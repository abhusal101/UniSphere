import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="unisphere-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
