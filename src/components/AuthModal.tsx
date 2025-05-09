"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { X, Scale, Gavel, BookOpen, Scroll } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  const floatingIcons = [
    { icon: Scale, delay: Math.random() * 2 },
    { icon: Scale, delay: Math.random() * 2 },
    { icon: Scale, delay: Math.random() * 2 },
    { icon: Gavel, delay: Math.random() * 2 },
    { icon: Gavel, delay: Math.random() * 2 },
    { icon: Gavel, delay: Math.random() * 2 },
    { icon: BookOpen, delay: Math.random() * 2 },
    { icon: BookOpen, delay: Math.random() * 2 },
    { icon: BookOpen, delay: Math.random() * 2 },
    { icon: Scroll, delay: Math.random() * 2 },
    { icon: Scroll, delay: Math.random() * 2 },
    { icon: Scroll, delay: Math.random() * 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Floating Background Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-400/30"
          initial={{
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight - 100) + 50,
            scale: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [
              Math.random() * (window.innerWidth - 100) + 50,
              Math.random() * (window.innerWidth - 100) + 50,
              Math.random() * (window.innerWidth - 100) + 50,
            ],
            y: [
              Math.random() * (window.innerHeight - 100) + 50,
              Math.random() * (window.innerHeight - 100) + 50,
              Math.random() * (window.innerHeight - 100) + 50,
            ],
            scale: [0.8, 1.2, 0.8],
            rotate: [Math.random() * 360, Math.random() * 720, Math.random() * 1080],
          }}
          transition={{
            delay: item.delay,
            duration: 15 + Math.random() * 10,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ position: "absolute", zIndex: 0 }}
        >
          <item.icon size={Math.random() * 24 + 24} />
        </motion.div>
      ))}

      {/* Particle Effect */}
      {[...Array(50)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 bg-purple-200/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, Math.random() * 1.5 + 0.5, 0],
            opacity: [0, Math.random(), 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-neutral-800 p-8 rounded-xl max-w-md w-full mx-4 relative z-10 border border-purple-200/20 shadow-lg"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </motion.button>

        <div className="text-center mb-6">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="text-2xl font-bold  mb-2 text-[var(--tealy-heading)]"
          >
            Welcome to NameFrame
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="text-gray-400 font-[var(--font-poppins)]"
          >
            Please sign in or create an account to move further
          </motion.p>
        </div>
        <Image className="mx-auto w-96" width={200} height={200} alt="welcome content" src="/welcome.png"></Image>

        <div className="flex space-x-4 justify-center space-y-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <SignInButton mode="modal">
              <button className="w-full cursor-pointer  bg-gradient-to-r duration-100 ease-in-out from-purple-900 via-purple-700 to-indigo-900 hover:from-purple-900 hover:via-purple-700 hover:to-indigo-900 text-white font-medium py-3 px-10 rounded-lg transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <SignUpButton mode="modal">
              <button className="w-full cursor-pointer border border-purple-600 text-purple-400 hover:bg-purple-600/20 font-medium py-3 px-4 rounded-lg transition-all duration-300">
                Create Account
              </button>
            </SignUpButton>
          </motion.div>

          
        </div>
      </motion.div>
    </motion.div>
  );
}