"use client";
import React from "react";
import { ChevronRight } from 'lucide-react';
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const CTA: React.FC = () => {
  return (
    <section className="py-24 relative bg-gradient-to-br from-[#2d1a54] to-[#1a1a2e]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-300">
          Ready to Transform Your Certificate Process?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of teams saving hours every month with automated certificate generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <Link href="/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300">
                Get Started For Free
                <ChevronRight className="inline-block ml-1" size={18} />
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300">
                Go to Dashboard
                <ChevronRight className="inline-block ml-1" size={18} />
              </button>
            </Link>
          </SignedIn>
          <Link href="/demo">
            <button className="px-8 py-4 border border-violet-500/50 rounded-lg font-medium text-gray-200 hover:bg-violet-500/10 transition-colors">
              Request Demo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};