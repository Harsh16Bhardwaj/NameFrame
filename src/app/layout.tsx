"use client"
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
import { usePathname } from "next/navigation";


import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

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

// Export or use them in your layout/app as needed

// export const metadata: Metadata = {
//   title: "NameFrame : One stop solution for Event Certtification",
//   description: "One stop solution for Event Certification. Manage your event from start to end with ease.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isEvents = pathname.startsWith("/events");
  const isParticipants = pathname.startsWith("/participants");
  const isTemplate = pathname.startsWith("/templates");

  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {(!isDashboard && !isEvents  && !isTemplate && !isParticipants) && <Header />}
          {children}
          {(!isDashboard && !isEvents && !isTemplate && !isParticipants) && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}