import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

// --- SEO ENHANCEMENTS ---
// The metadata object is now much more detailed to provide search engines
// with comprehensive information about your site.

const siteConfig = {
  name: "DITools by DishIs Technologies",
  description: "A collection of free, fast, and reliable online developer tools, including a Redis connection tester, JSON formatter, and more. Built to Do-It-Together.",
  url: "https://tools.dishis.tech", // Replace with your actual domain
  ogImage: "https://tools.dishis.tech/og-image.png", // An attractive image for social sharing (e.g., 1200x630px)
  author: "DishIs Technologies",
  twitterHandle: "@dishistech", // Replace with your Twitter handle
};

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const baseUrl = "https://tools.dishis.tech" // <-- replace with your real domain

  // Construct canonical from path params (works in app router)
  const canonical = `${baseUrl}${params?.slug ? `/${params.slug}` : ""}`
  return {
    // Title template allows child pages to append their own titles.
    // Example: "Redis Tester | DITools by DishIs Technologies"
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name, // Fallback title for the homepage
    },
    description: siteConfig.description,
    alternates: {
      canonical,
    },

    // Keywords help search engines understand your content.
    keywords: ["developer tools", "online tools", "redis", "json", "formatter", "tester", "cron", "utilities", "DishIs Technologies"],

    authors: [{ name: siteConfig.author, url: "https://dishis.tech" }],

    // Sets the canonical URL to avoid duplicate content issues.
    metadataBase: new URL(siteConfig.url),

    // --- Open Graph (for Facebook, LinkedIn, etc.) ---
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Online Developer Tools`,
        },
      ],
    },

    // --- Twitter Card (for Twitter sharing) ---
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
    },

    // --- Additional Meta Tags ---
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `/site.webmanifest`,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head />
      <body>{children}</body>
    </html>
  )
}