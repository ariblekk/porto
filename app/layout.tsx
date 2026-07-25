import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Cursor from "./components/cursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blekcreativet.com"),
  title: {
    default: "Blek Creative Tech — Fullstack Developer",
    template: "%s | Blek Creative Tech",
  },
  description:
    "Portfolio of Blek Creative Tech, a fullstack developer building immersive web experiences with React, Three.js, and GSAP.",
  keywords: [
    "Fullstack Developer",
    "React",
    "Three.js",
    "GSAP",
    "Creative Technologist",
    "Web Development",
    "Blek Creative Tech",
  ],
  authors: [{ name: "Blek Creative Tech" }],
  creator: "Blek Creative Tech",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blekcreativet.com",
    title: "Blek Creative Tech — Fullstack Developer",
    description:
      "Portfolio of Blek Creative Tech, a fullstack developer building immersive web experiences with React, Three.js, and GSAP.",
    siteName: "Blek Creative Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blek Creative Tech — Fullstack Developer",
    description:
      "Portfolio of Blek Creative Tech, a fullstack developer building immersive web experiences with React, Three.js, and GSAP.",
    creator: "@blekcreative",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
