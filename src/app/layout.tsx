import type { Metadata } from "next";
import Script from "next/script";
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
  title: {
    default: "Vibey Coder — Build real things with AI",
    template: "%s | Vibey Coder",
  },
  description: "One mission a day. Ship every week. A 28-day builder lab where you create real apps with AI coding tools.",
  metadataBase: new URL("https://vibeycoder.ai"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vibey Coder — Build real things with AI",
    description: "One mission a day. Ship every week. A 28-day builder lab where you create real apps with AI coding tools.",
    url: "https://vibeycoder.ai",
    siteName: "Vibey Coder",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vibey Coder — Build real things with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibey Coder — Build real things with AI",
    description: "One mission a day. Ship every week. A 28-day builder lab where you create real apps with AI coding tools.",
    images: ["/og-image.png"],
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E08YTBEPF2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E08YTBEPF2');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
