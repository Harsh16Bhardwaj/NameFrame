"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const CTA: React.FC = () => {
  return (
    <motion.section
      className="py-16 sm:py-24 relative bg-gradient-to-br darkOnyx to-[#1a1a2e]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
      </div>

      <motion.div
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AnimatePresence>
          <motion.h2
            key="cta-title"
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Transform Your Certificate Process?
          </motion.h2>
        </AnimatePresence>

        <motion.p
          className="text-sm sm:text-md md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Join thousands of teams saving hours every month with automated certificate generation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SignedOut>
            <Link href="/signup">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started For Free
                <ChevronRight className="inline-block ml-1" size={18} />
              </motion.button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg font-medium text-white shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 transition duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Dashboard
                <ChevronRight className="inline-block ml-1" size={18} />
              </motion.button>
            </Link>
          </SignedIn>
                  </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CTA;