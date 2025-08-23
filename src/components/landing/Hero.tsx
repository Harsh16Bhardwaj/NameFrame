"use client";

import React from "react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { DM_Sans, Inter, Space_Grotesk, Poppins } from "next/font/google";
import { motion } from "framer-motion";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-space-grotesk" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-poppins" });

import {
  Dancing_Script,
  Cookie,
  Josefin_Sans,
  Pacifico,
  Merienda,
  Leckerli_One,
  Just_Another_Hand,
  Titan_One,
  Style_Script,
  Delius,
} from "next/font/google";

export const cookieFont = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export const josefinFont = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-josefin",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dancing-script",
});
export const poppinFont = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"], // Add this line
});
export const delius = Delius({
  weight: "400",
  subsets: ["latin"],
});

export const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const styleScript = Style_Script({
  weight: "400",
  subsets: ["latin"],
});

export const merienda = Merienda({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-merienda",
});

export const leckerliOne = Leckerli_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-leckerli-one",
});

export const justAnotherHand = Just_Another_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-just-another-hand",
});

const Hero = () => {
  return (
    <section
      className="py-16 h-screen  flex items-center justify-center bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-Mainprimary)] to-[var(--bg-secondary)]"
      style={{ fontFamily: inter.style.fontFamily }}
    >
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--font-light)] leading-tight"
            style={{ fontFamily: spaceGrotesk.style.fontFamily }}
          >
            <SparklesText>Effortlessly Create & Send Event Certificates</SparklesText>
          </h1>

          <Image
            src="/title-2.png"
            alt="Certificate Title Decoration"
            width={500}
            height={350}
            className="mx-auto lg:mx-0 z-20"
          />

          <p
            className="text-lg -mt-5 sm:text-xl text-gray-300 max-w-md mx-auto lg:mx-0"
            style={{ fontFamily: inter.style.fontFamily }}
          >
            Simple Solution for Certification and gain AI-based insights to improve your events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <button
                  className="px-8 py-3 bg-[var(--love)] text-[var(--font-light)] rounded-2xl hover:bg-[var(--tealy)] transition-colors text-base font-medium shadow-md"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button
                  className="px-8 py-3 bg-[var(--cta)] text-[var(--font-light)] rounded-2xl hover:bg-[var(--tealy)] transition-colors text-base font-medium shadow-md"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
          </div>
        </motion.div>

        {/* Certificate Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: -6 }}
          className="relative max-w-md mx-auto"
        >
          <Image
            src="/2.png"
            alt="Certificate template"
            width={420}
            height={320}
            className="w-full h-auto rounded-2xl border border-[var(--onyx)] shadow-xl"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
