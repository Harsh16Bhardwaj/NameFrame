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
import "../../globals.css"; // Adjust the path if your globals.css is elsewhere
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

export const metadata: Metadata = {
  title: "Download Page",
  description: "Dynamic download page",
};

export default function DownloadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${styleScript.variable} ${bangers.variable} ${titanOne.variable} ${signika.variable} ${raleway.variable} ${josefinSans.variable} antialiased`}
        >
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
