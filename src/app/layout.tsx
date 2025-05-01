import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Adam Beziou",
  description: "I'm Adam Beziou, a full-stack software engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
