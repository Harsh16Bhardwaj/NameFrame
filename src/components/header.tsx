"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaPhoneAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { FaDollarSign } from "react-icons/fa6";
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

const Header: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.4;
        this.speedX = Math.random() * 0.25 - 0.125;
        this.speedY = Math.random() * 0.25 - 0.125;
        this.opacity = Math.random() * 0.3 + 0.15;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(45, 212, 191, ${this.opacity})`; // Teal for sleek effect
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
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
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolledDown(currentScrollY > lastScrollY && currentScrollY > 50);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${manrope.variable} ${poppins.variable} font-sans  fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-gradient-to-r from-gray-900/95 via-teal-900/95 to-gray-900/95 rounded-4xl transition-all duration-500 ${
        isScrolledDown
          ? "bg-opacity-90 backdrop-blur-xl shadow-xl"
          : "bg-opacity-90 backdrop-blur-2xl shadow-lg"
      } border border-teal-300/20`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-16 rounded-xl pointer-events-none opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-xl" />
      <div className="flex justify-between items-center py-3 px-8 relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center gap-x-2 cursor-pointer group">
            <div className="relative">
              <Image
                src={Logo}
                alt="Logo"
                width={36}
                height={36}
                className="group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 rounded-full border border-teal-300/40 opacity-0 group-hover:opacity-100 group-hover:scale-120 transition-all duration-500 ease-out"></div>
            </div>
            <span
              className={`text-3xl font-bold  text-teal-100 tracking-tight group-hover:text-teal-300 transition-colors duration-300 ${styleScript.className}`}
            >
              NameFrame
            </span>
          </div>
        </Link>

        <SignedIn>
          <UserSync />
          <nav className="flex items-center gap-x-8">
            <div className="flex gap-x-8 text-gray-300 font-medium">
              {[
                {
                  href: "/dashboard",
                  label: (
                    <div className="flex justify-center items-center gap-x-1">
                      <FaHome size={16} /> Dashboard
                    </div>
                  ),
                },
                {
                  href: "/create",
                  label: (
                    <div className="flex justify-center items-center gap-x-1">
                      <IoMdCreate size={16} /> Create
                    </div>
                  ),
                },
                {
                  href: "/pricing",
                  label: (
                    <div className="flex justify-center items-center gap-x-1">
                      <FaDollarSign size={16} /> Pricing
                    </div>
                  ),
                },
                {
                  href: "/contact",
                  label: (
                    <div className="flex justify-center items-center gap-x-1">
                      <FaPhoneAlt size={16} /> Contact
                    </div>
                  ),
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-sm font-poppins text-gray-300 hover:text-white cursor-pointer transition-all duration-400"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-teal-400 transition-all duration-500 group-hover:w-full group-hover:shadow-glow"></span>
                </Link>
              ))}
            </div>
          </nav>
        </SignedIn>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <div className="flex space-x-3">
              <SignInButton signUpForceRedirectUrl="/dashboard">
                <button className="px-4 py-1.5 bg-gradient-to-br from-purple-950 via-purple-800 to-purple-950 text-white rounded-lg font-poppins font-semibold text-sm cursor-pointer transition-all duration-400 hover:from-purple-800 hover:to-purple-800 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-100">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton signInForceRedirectUrl="/dashboard">
                <button className="px-4 py-1.5 bg-gradient-to-r from-[#ED213A] via-[#93291E] to-[#93291E] text-white rounded-lg font-poppins font-semibold text-sm border border-red-300/30 cursor-pointer transition-all duration-400 hover:from-[#ED213A] hover:to-[#b93627] hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-100">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="relative">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 rounded-full border border-teal-300/40 shadow-sm cursor-pointer",
                  },
                }}
              />
              <div className="absolute inset-0 rounded-full bg-teal-400/20 scale-125 animate-pulse-slow pointer-events-none"></div>
            </div>
          </SignedIn>
        </div>
      </div>
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
    </header>
  );
};

export default Header;