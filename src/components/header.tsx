"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaPhoneAlt, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Manrope, Style_Script, Poppins } from "next/font/google";
import Logo from "../../public/nameframelogo.png";
import UserSync from "./userSync";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});
const styleScript = Style_Script({
  variable: "--font-style-script",
  subsets: ["latin"],
  weight: "400",
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const navItems = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <FaHome className="h-4 w-4 text-gray-300" />,
  },
  {
    name: "Create",
    link: "/create",
    icon: <IoMdCreate className="h-4 w-4 text-gray-300" />,
  },
  {
    name: "Verify",
    link: "/verify",
    icon: <FaShieldAlt className="h-4 w-4 text-gray-300" />,
  },
  {
    name: "Pricing",
    link: "/pricing",
    icon: <FaDollarSign className="h-4 w-4 text-gray-300" />,
  },
  {
    name: "Collab",
    link: "/contact",
    icon: <FaPhoneAlt className="h-4 w-4 text-gray-300" />,
  },
];

const Header: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious();
      let direction = current - (previous || 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = canvas.height;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      draw: () => void;
      update: () => void;
    }[] = [];
    const particleCount = 40;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 1.2 + 0.4;
        this.speedX = Math.random() * 0.25 - 0.125;
        this.speedY = Math.random() * 0.25 - 0.125;
        this.opacity = Math.random() * 0.3 + 0.15;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(45, 212, 191, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > (canvas?.width ?? 0)) this.speedX *= -1;
        if (this.y < 0 || this.y > (canvas?.height ?? 0)) this.speedY *= -1;
        this.draw();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => particle.update());
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ y: visible ? 16 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        `${manrope.variable} ${poppins.variable} font-sans fixed top-0 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] max-w-5xl z-[5000] bg-gradient-to-r from-gray-900/95 via-teal-900/95 to-gray-900/95 rounded-xl md:rounded-4xl transition-all duration-500 backdrop-blur-2xl shadow-lg border border-teal-300/20`
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-16 rounded-xl pointer-events-none opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-xl" />
      <div className="flex justify-between items-center py-3 px-4 sm:px-6 md:px-8 relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center gap-x-1 sm:gap-x-2 cursor-pointer group">
            <div className="relative">
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="sm:w-9 sm:h-9 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 rounded-full border border-teal-300/40 opacity-0 group-hover:opacity-100 group-hover:scale-120 transition-all duration-500 ease-out"></div>
            </div>
            <span
              className={`text-xl sm:text-2xl md:text-3xl font-bold text-teal-100 tracking-tight group-hover:text-teal-300 transition-colors duration-300 ${styleScript.className}`}
            >
              NameFrame
            </span>
          </div>
        </Link>

        <SignedIn>
          <UserSync />
          <nav className="hidden md:flex items-center gap-x-8">
            <div className="flex gap-x-4 lg:gap-x-8 text-gray-300 font-medium">
              {navItems.map((item, idx) => (
                <Link
                  key={`link-${idx}`}
                  href={item.link}
                  className="relative group text-sm font-poppins text-gray-300 hover:text-white cursor-pointer transition-all duration-400 flex items-center space-x-1"
                >
                  <span className="block">{item.icon}</span>
                  <span className="block">{item.name}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-teal-400 transition-all duration-500 group-hover:w-full group-hover:shadow-glow"></span>
                </Link>
              ))}
            </div>
          </nav>
        </SignedIn>

        <div className="flex items-center">
          <SignedOut>
            <div className="flex space-x-2 sm:space-x-3">
              <SignInButton signUpForceRedirectUrl="/dashboard">
                <button className="px-2 sm:px-4 py-1.5 bg-gradient-to-br from-purple-950 via-purple-800 to-purple-950 text-white rounded-lg font-poppins font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-400 hover:from-purple-800 hover:to-purple-800 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-100 relative">
                  <span>Sign In</span>
                  <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                </button>
              </SignInButton>
              <SignUpButton signInForceRedirectUrl="/dashboard">
                <button className="px-2 sm:px-4 py-1.5 bg-gradient-to-r from-[#ED213A] via-[#93291E] to-[#93291E] text-white rounded-lg font-poppins font-semibold text-xs sm:text-sm border border-red-300/30 cursor-pointer transition-all duration-400 hover:from-[#ED213A] hover:to-[#b93627] hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-100 relative">
                  <span>Sign Up</span>
                  <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden ml-2 p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>

            <div className="relative ml-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-teal-300/40 shadow-sm cursor-pointer",
                  },
                }}
              />
              <div className="absolute inset-0 rounded-full bg-teal-400/20 scale-125 animate-pulse-slow pointer-events-none"></div>
            </div>
          </SignedIn>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <SignedIn>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden relative z-10"
            >
              <div className="py-3 px-4 border-t border-teal-800/30">
                {navItems.map((item, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className=" py-2 text-gray-300 hover:text-teal-300 font-poppins text-sm transition-colors flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </SignedIn>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse-slow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        @keyframes glow {
          0% {
            box-shadow: 0 0 4px rgba(45, 212, 191, 0.4);
          }
          50% {
            box-shadow: 0 0 12px rgba(45, 212, 191, 0.7);
          }
          100% {
            box-shadow: 0 0 4px rgba(45, 212, 191, 0.4);
          }
        }
        .shadow-glow {
          animation: glow 1.5s infinite;
        }
      `}</style>
    </motion.header>
  );
};

export default Header;