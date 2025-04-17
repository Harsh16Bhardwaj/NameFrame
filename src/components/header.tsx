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
import { Manrope, Style_Script } from "next/font/google";
import Logo from "../../public/nameframelogo.png";
import UserSync from "./userSync";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});
const styleScript = Style_Script({
  variable: "--font-style-script",
  subsets: ["latin"],
  weight: "400",
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
    canvas.height = canvas.height; // Fixed height from CSS

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
    const particleCount = 30;

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
        this.size = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`; // Amber for subtle shimmer
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
      canvas.height = canvas.height; // Maintain fixed height
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
      className={`${
        manrope.variable
      } font-sans w-full h-16 z-50 sticky top-0 bg-transparent transition-all duration-300 ${
        isScrolledDown
          ? "bg-opacity-80 backdrop-blur-md"
          : "bg-opacity-90 backdrop-blur-lg"
      } border-b border-gray-800/50`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-16 pointer-events-none opacity-30"
      />
      <div className="absolute inset-0 " />
      <div className="flex justify-between items-center  py-4  px-8 relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center gap-x-2 cursor-pointer group">
            <div className="relative">
              <Image
                src={Logo}
                alt="Logo"
                width={36}
                height={36}
                className="group-hover:rotate-12 transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 rounded-full border border-amber-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className={`text-3xl font-bold text-teal-200 tracking-tight group-hover:text-amber-200 transition-colors duration-300 ${styleScript.className}`}>
              NameFrame
            </span>
          </div>
        </Link>

        <SignedIn>
          <UserSync />
          <nav className="flex items-center gap-x-8">
            <div className="flex gap-x-8 text-gray-400 font-semibold">
              {[
                { href: "/dashboard", label: <div className="flex justify-center items-center gap-x-1"><FaHome></FaHome> Dashboard</div>  },
                { href: "/create", label: <div className="flex justify-center items-center gap-x-1"><IoMdCreate></IoMdCreate> Create</div>  },
                { href: "/pricing", label: <div className="flex justify-center items-center gap-x-1"><FaDollarSign></FaDollarSign> Pricing</div> },
                { href: "/contact", label: <div className="flex justify-center items-center gap-x-1"><FaPhoneAlt></FaPhoneAlt> Contact</div>  },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-sm hover:text-white transition-all duration-300"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-amber-300 transition-all duration-500 group-hover:w-full group-hover:animate-ripple"></span>
                </Link>
              ))}
            </div>
          </nav>
        </SignedIn>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <div className="flex space-x-3">
              <SignUpButton signInForceRedirectUrl="/dashboard">
                <button className="px-4 py-1.5 bg-gray-800 text-amber-200 rounded-md font-semibold text-sm border border-amber-300/50 transition-all duration-300 hover:bg-amber-300 hover:text-gray-900 hover:scale-105 hover:shadow-sm active:scale-100">
                  Sign Up
                </button>
              </SignUpButton>
              <SignInButton signUpForceRedirectUrl="/dashboard">
                <button className="px-4 py-1.5 bg-amber-300 text-gray-900 rounded-md font-semibold text-sm transition-all duration-300 hover:bg-amber-400 hover:scale-105 hover:shadow-sm active:scale-100">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="relative">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 rounded-full border border-amber-300/30",
                  },
                }}
              />
              <div className="absolute inset-0 rounded-full bg-amber-300/20 scale-125 animate-pulse-slow pointer-events-none"></div>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
