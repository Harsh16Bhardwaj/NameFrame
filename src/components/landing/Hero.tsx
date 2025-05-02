"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

// Certificate template images
import template1 from "@/../public/ex1.jpg";
import template2 from "@/../public/ex2.jpg";
import template3 from "@/../public/ex3.jpg";
import template4 from "@/../public/ex4.jpg";

interface HeroProps {
  previewName: string;
  templates: any[]; // Add templates to props
  currentTemplate: number; // Add current template index
}

export const Hero: React.FC<HeroProps> = ({
  previewName,
  templates,
  currentTemplate,
}) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden ">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br  from-[#2d1a54] via-[#1f1d36] to-[#1a1a2e] animate-gradient-slow">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-[80px] animate-float-delay"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container max-w-7xl mx-auto px-4 z-10 flex flex-col lg:flex-row gap-12 items-center">
        {/* Hero content */}
        <div className=" space-y-6 text-center lg:text-left mx-4 w-4xl">
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Automate Your Certificates in Seconds
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload, customize, and send — no design skills needed. Save hours
            with bulk certificate generation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SignedOut>
              <Link href="/create">
                <SignInButton forceRedirectUrl="/dashboard">
                  <button className="px-8 py-3 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300">
                    Get Started — It's Free
                  </button>
                </SignInButton>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="px-8 py-3 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300">
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
            <a href="#action">
              <button className="px-8 py-3 cursor-pointer border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-gradient-to-br ease-in-out hover:ease-in-out hover:scale-103 hover:duration-200 hover:from-teal-800 hover:via-teal-700 hover:to-gray-800 transition duration-200">
                See How It Works
              </button>
            </a>
          </motion.div>
        </div>

        {/* 3D Certificate Mockup */}
        <motion.div
          className="lg:w-1/2 parallax"
          data-speed="0.1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative perspective-1000">
            {/* Main certificate */}
            <div className="w-full max-w-md mx-auto transform rotate-y-10 rotate-x-5 shadow-2xl rounded-lg overflow-hidden">
              <div className="relative">
                <Image
                  src={templates[currentTemplate]}
                  alt="Certificate template"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-script text-black font-bold"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls for template navigation */}
            <div className="mt-6 flex justify-center gap-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTemplate === index
                      ? "bg-violet-500 w-6"
                      : "bg-gray-600"
                  }`}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="rotate-90 text-gray-400" />
      </div>
    </section>
  );
};
