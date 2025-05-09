import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Style_Script,
  Bangers,
  Titan_One,
  Signika,
  Raleway,
  Josefin_Sans,
} from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ClientLayout from "./ClientLayout";

// Font Configs
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const styleScript = Style_Script({
  variable: "--font-style-script",
  subsets: ["latin"],
  weight: "400",
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const titanOne = Titan_One({
  variable: "--font-titan-one",
  subsets: ["latin"],
  weight: "400",
});

const signika = Signika({
  variable: "--font-signika",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NameFrame | Professional Certificate Generation Platform",
  description: "Create, customize, and distribute professional certificates for events, courses, and achievements with our all-in-one certificate management solution.",
  keywords: "certificate generator, event certificates, digital certificates, certificate management, certificate templates",
    
  // Icon configuration
  icons: {
    // Main favicon (16x16)
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
      }
    ],
    // Apple Touch Icon (for iOS devices)
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      }
    ],
    // Other icons
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      }
    ]
  },
  
  // Manifest file for PWA
  manifest: '/site.webmanifest',
  
  // Open Graph and Twitter config remains the same
  openGraph: {
    title: "NameFrame | Professional Certificate Generation Platform",
    description: "Create, customize, and distribute professional certificates for events, courses, and achievements.",
    images: ['/og-image.png'],
    type: 'website',
    url: 'https://www.nameframe.site/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NameFrame | Professional Certificate Generation Platform",
    description: "Create, customize, and distribute professional certificates for events, courses, and achievements.",
    images: ['/og-image.png'],
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // No need for path checking here - moved to client layout

  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${styleScript.variable} ${bangers.variable} ${titanOne.variable} ${signika.variable} ${raleway.variable} ${josefinSans.variable} antialiased`}
        >
          {/* Import the client component with theme and pathname logic */}
          <ClientLayout>{children}</ClientLayout>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "NameFrame",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "description": "Professional certificate generation and management platform"
              })
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}