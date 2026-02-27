import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeyCoder — AI Coding Bootcamp for Teens",
  description: "Help your teen learn to code in 4 weeks with AI. 30 minutes a day, zero to building AI-powered apps. Free, self-paced, and designed for beginners.",
  metadataBase: new URL("https://vibeycoder.ai"),
  openGraph: {
    title: "VibeyCoder — AI Coding Bootcamp for Teens",
    description: "4-week AI coding journey. 30 min/day. Zero to AI-powered apps.",
    url: "https://vibeycoder.ai",
    siteName: "VibeyCoder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeyCoder — AI Coding Bootcamp for Teens",
    description: "Help your teen learn to code in 4 weeks with AI.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
