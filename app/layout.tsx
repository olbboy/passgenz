import React from 'react'
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-cal-sans',
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "PassGenz - Advanced Password Generator",
  description: "Next-Generation Secure Password Generation Solution with AI-powered features, multiple algorithms, and customizable options.",
  keywords: ["password generator", "secure password", "password tool", "security", "encryption"],
  authors: [{ name: "PassGenz Team" }],
  creator: "PassGenz",
  publisher: "PassGenz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
    other: [
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://passgen.vercel.app",
    title: "PassGenz - Advanced Password Generator",
    description: "Next-Generation Secure Password Generation Solution with AI-powered features.",
    siteName: "PassGenz",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "PassGenz - Advanced Password Generator"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PassGenz - Advanced Password Generator",
    description: "Next-Generation Secure Password Generation Solution with AI-powered features.",
    images: ["/twitter-image.png"],
    creator: "@passgenz",
    site: "@passgenz",
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
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-E6RGNPR8L3" />
        <GoogleTagManager gtmId="GTM-NJVMX8WH" />
      </body>
    </html>
  );
}
