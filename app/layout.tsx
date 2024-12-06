import React from 'react'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { Metadata } from 'next'

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

const APP_NAME = "PassGenZ"
const APP_DEFAULT_TITLE = "PassGenZ - Free Online Password Generator"
const APP_TITLE_TEMPLATE = "%s - PassGenZ"
const APP_DESCRIPTION = "Free online password generator. Create strong, secure, and memorable passwords, PINs, secrets, and IDs instantly. Advanced customization with AI-powered features for maximum security."

// Environment variables
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-E6RGNPR8L3'
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NJVMX8WH'

// Determine the base URL based on environment
const BASE_URL = process.env.CF_PAGES_URL 
  ? `https://${process.env.CF_PAGES_URL}`
  : process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://passgen.pages.dev' // Default Cloudflare Pages URL

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  generator: 'Next.js',
  keywords: [
    'free password generator',
    'online password generator',
    'secure password generator',
    'strong password generator',
    'random password generator',
    'PIN generator',
    'secret key generator',
    'ID generator',
    'memorable password',
    'password security',
    'password strength',
    'password tool',
    'cybersecurity',
    'online security',
    'password manager'
  ],
  authors: [{ name: "PassGenZ Team", url: 'https://github.com/olbboy' }],
  creator: "PassGenZ",
  publisher: "PassGenZ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/icons/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/images/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/images/icons/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/icons/safari-pinned-tab.svg",
        color: "#09090b",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/images/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "PassGenZ - Free Online Password Generator",
      },
      {
        url: "/images/og/og-image-square.png",
        width: 600,
        height: 600,
        alt: "PassGenZ - Free Online Password Generator",
      }
    ],
    locale: 'en_US',
  },
  twitter: {
    card: "summary_large_image",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: {
      url: "/images/og/twitter-image.png",
      alt: "PassGenZ - Free Online Password Generator"
    },
    creator: "@olbboyz",
    site: "@olbboyz",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'security',
  verification: {
    google: GA_ID,
  },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  other: {
    'msapplication-TileColor': '#09090b',
    'msapplication-config': '/browserconfig.xml',
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
        <GoogleAnalytics gaId={GA_ID} />
        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  );
}
