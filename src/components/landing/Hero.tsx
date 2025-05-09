"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { SparklesText } from "@/components/magicui/sparkles-text";

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

// Certificate template images
import template1 from "@/../public/ex1.jpg";
import template2 from "@/../public/ex2.jpg";
import template3 from "@/../public/ex3.jpg";
import template4 from "@/../public/ex4.jpg";

interface HeroProps {
  previewName: string;
  templates: string[];
  currentTemplate: number;
  setCurrentTemplate: (index: number) => void;
}

const Hero: React.FC<HeroProps> = ({
  previewName,
  templates,
  currentTemplate,
  setCurrentTemplate,
}) => {
  return (
    <section className="relative pt-12 md:pt-8 h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B262C] to-[#1B262C] animate-gradient-slow">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full filter blur-[60px] sm:blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/20 rounded-full filter blur-[50px] sm:blur-[80px] animate-float-delay"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container max-w-6xl mx-auto px-4 z-10 flex flex-col lg:flex-row gap-6 items-center">
        {/* Hero content */}
        <motion.div
          className="space-y-6 text-center lg:text-left mx-2 w-full lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SparklesText
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${titanOne.className} font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-300`}
            >
              Automate Your Event Certificates in Seconds
            </SparklesText>
          </motion.h1>

          <motion.p
            className={`text-base sm:text-lg md:text-xl ${josefinFont.className} text-gray-200 max-w-lg mx-auto lg:mx-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload, customize, and send — no hardwork needed. Save hours with
            bulk certificate generation.
          </motion.p>

          <motion.div
            className="flex flex-col md:gap-y-0 sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SignedOut>
              <Link href="/create">
                <SignInButton forceRedirectUrl="/dashboard">
                  <button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-gray-200 shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300 text-sm sm:text-base">
                    Get Started — It&apos;s Free
                  </button>
                </SignInButton>
              </Link>
            </SignedOut>
            <SignedIn>
              <div>
                <Link href="/dashboard">
                  <button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-bold text-gray-200 hover:text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300 text-sm sm:text-base">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </SignedIn>
            <a href="#action">
              <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 bg-black/20 backdrop-blur-md border-[#c83E4d] rounded-lg font-bold text-gray-200 hover:text-white hover:bg-gradient-to-br hover:from-[#8c1f2c] hover:via-[#C83E4D] hover:to-[#ab2f3d] transition duration-200 text-sm sm:text-base">
                See How It Works
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Certificate Mockup */}
        <motion.div
          className="w-full  md:mt-0 lg:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTemplate}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto transform rotate-y-10 rotate-x-5 shadow-2xl rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative backdrop-blur-md">
                  <Image
                    src={templates[currentTemplate]}
                    alt="Certificate template"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-xl sm:text-2xl md:text-3xl ${cookieFont.className} text-black font-bold`}
                      >
                        {previewName}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 sm:mt-6 flex justify-center gap-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTemplate === index
                      ? "bg-violet-500 w-6"
                      : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentTemplate(index)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute invisible md:visible bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full animate-bounce">
        <ArrowRight className="rotate-90 text-gray-400 w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;
