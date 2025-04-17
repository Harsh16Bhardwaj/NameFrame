"use client";
import { useEffect } from "react";
import { ArrowDown, Upload, FileSpreadsheet, Send, Star, ChevronRight, CheckCircle2, Sparkles, ArrowDownCircle } from 'lucide-react';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };

    const container = document.querySelector(".scroll-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#c31432] to-[#240b36] text-white flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full text-center py-16 px-8">
        <h1 className="text-4xl sm:text-6xl font-bold animate-glowText">
          Welcome to NameFrame
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-light animate-floatText">
          Create, manage, and share personalized certificates effortlessly.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <SignedOut>
            <Link href="/signup">
              <button className="bg-gradient-to-r from-[#dca200] to-[#F37335] hover:from-red-500 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                Sign Up to Get Started
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-gray-200 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                Explore Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Features Section */}
      <main className="w-full px-8 py-16 bg-gray-100 text-black rounded-t-3xl shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose NameFrame?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature1.svg"
              alt="Feature 1"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Easy Certificate Creation</h3>
            <p className="mt-2 text-sm">
              Design and customize certificates with ease using our intuitive
              tools.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature2.svg"
              alt="Feature 2"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Seamless Management</h3>
            <p className="mt-2 text-sm">
              Organize and manage your events and certificates in one place.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature3.svg"
              alt="Feature 3"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Share Instantly</h3>
            <p className="mt-2 text-sm">
              Share certificates with participants instantly via email or
              download.
            </p>
          </div>
        </div>
      </main>

      {/* Call-to-Action Section */}
      <section className="section-height">
        <div className="gradient-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-[120px]" />
        </div>
        <div className="section-content">
          <div className="w-full px-8">
            <div className="max-w-5xl mx-auto text-center reveal">
              <span className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur mb-8 text-lg font-medium">
                Get Started Today
              </span>
              <h2 className="text-7xl font-bold mb-8 gradient-text">
                Ready to Transform?
              </h2>
              <p className="text-3xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of organizations automating their certificate
                workflow. Start your journey today.
              </p>
              <button
                className="glass-card px-16 py-8 rounded-full text-3xl font-semibold 
                hover:scale-105 transition-all duration-500 group hover-glow gradient-shimmer"
              >
                Get Started Now
                <ChevronRight className="inline ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
