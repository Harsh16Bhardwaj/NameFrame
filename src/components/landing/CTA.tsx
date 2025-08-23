"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Award } from "lucide-react";

// In this environment, we will simulate the behavior of Next.js Link and Clerk's auth components.
// This is for demonstration purposes to show the CTA's functionality.
const Link = ({ href, children }) => (
  <a href={href} className="block w-full sm:w-auto">
    {children}
  </a>
);

const SignedOut = ({ children }) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  return !isUserSignedIn ? children : null;
};

const SignedIn = ({ children }) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);
  return isUserSignedIn ? children : null;
};

// Main CTA component
export const CTA = () => {
  return (
    <motion.section
      className="py-16 flex justify-center items-center sm:py-24 min-h-screen relative bg-[#1F1F1F] overflow-hidden" // Changed to a solid background to provide more contrast
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background glow effect for a modern touch */}
      <motion.div
        className="absolute inset-0 z-0 opacity-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[#4C72B0] blur-[100px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-[#4eb3a3] blur-[100px]"></div>
      </motion.div>

      <motion.div
        className="relative z-10 container mx-auto px-4 text-center max-w-4xl" // Set a max-width for better control
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AnimatePresence>
          <motion.h2
            key="cta-title"
            className="text-4xl sm:text-5xl md:text-5xl font-bold mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#4eb3a3] to-[#4C72B0] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Level Up Your Events with AI-Powered Certificates.
          </motion.h2>
        </AnimatePresence>

        <motion.p
          className="text-lg sm:text-xl text-[#A9A9A9] mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Streamline your certificate process and gain valuable insights effortlessly.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Example of conditional rendering based on a state variable */}
          <SignedOut>
            <Link href="/signup">
              <motion.button
                className="px-8 py-4 bg-[#4eb3a3] rounded-2xl font-semibold cursor-pointer text-[#141414] shadow-lg transform hover:scale-103 transition duration-300 text-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started For Free
                <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </motion.button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <motion.button
                className="px-8 py-4 bg-[#4C72B0] rounded-2xl cursor-pointer font-semibold text-white shadow-lg transform hover:scale-103 transition duration-300 text-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard
                <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </motion.button>
            </Link>
          </SignedIn>
        </motion.div>
        
        {/* The smaller text has been moved to be more subtle below the main content */}
        <motion.p
          className="mt-5 text-xs text-[#A9A9A9] flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Award size={16} className="text-[#4eb3a3]" />
          Used by teams worldwide.
        </motion.p>

      </motion.div>
    </motion.section>
  );
};

// This is a wrapper component to render the CTA
export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-[#FFFFFF] font-sans">
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Your Main Content</h1>
        <p className="text-center">Scroll down to see the new CTA section.</p>
      </main>
      <CTA />
    </div>
  );
}
