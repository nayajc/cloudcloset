import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://cloudcloset.fit";

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export const metadata: Metadata = {
  title: {
    default: "CloudCloset - AI Outfit Recommendations",
    template: "%s | CloudCloset",
  },
  description:
    "CloudCloset is an AI-powered outfit recommendation app. Upload your wardrobe, get weather-based personalized outfit suggestions every day. 내 옷장 사진 기반 날씨 연동 AI 코디 추천 앱",
  keywords: [
    "AI outfit recommendation",
    "wardrobe app",
    "fashion AI",
    "weather outfit",
    "코디 추천",
    "AI 코디",
    "날씨 코디",
    "옷장 관리",
    "CloudCloset",
    "패션 앱",
  ],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CloudCloset",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "CloudCloset",
    title: "CloudCloset - AI Outfit Recommendations",
    description:
      "Upload your wardrobe photos and get personalized, weather-based outfit suggestions powered by AI.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CloudCloset - AI Outfit Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudCloset - AI Outfit Recommendations",
    description:
      "Upload your wardrobe photos and get personalized, weather-based outfit suggestions powered by AI.",
    images: [`${BASE_URL}/og-image.png`],
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
  verification: {
    google: "YYE8-2beFD5iuV7vdYL52JJgjyWFhlWqoKHhiFDlgDo",
  },
};

import { LanguageProvider } from '@/lib/i18n';

// JSON-LD structured data for rich search snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CloudCloset",
  url: BASE_URL,
  description:
    "AI-powered weather-based outfit recommendation app. Upload your wardrobe and get personalized outfit suggestions.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "C.Threads",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
