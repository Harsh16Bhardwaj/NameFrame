"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaPhoneAlt, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import { MdDashboard, MdVerified } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa6";
import { IoMdCreate, IoIosCreate } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@/components/auth/clerk-client";
import { Manrope, Style_Script, Poppins } from "next/font/google";
import Logo from "../../public/nameframelogo.png";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
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
    icon: <MdDashboard className="h-3.5 w-3.5 text-gray-400" />,
  },
  {
    name: "Create",
    link: "/create",
    icon: <IoIosCreate className="h-3.5 w-3.5 text-gray-400" />,
  },
  {
    name: "Verify",
    link: "/verify",
    icon: <MdVerified className="h-3.5 w-3.5 text-gray-400" />,
  },
  {
    name: "Collab",
    link: "/contact",
    icon: <FaPhoneAlt className="h-3 w-3 text-gray-400" />,
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
      animate={{ y: visible ? 20 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        ` ${poppins.variable} bg-black font-sans fixed top-0 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] max-w-6xl z-[5000]  rounded-xl md:rounded-2xl transition-all duration-500 backdrop-blur-2xl shadow-lg border border-teal-300/40`
      )}
    >
      <div className="flex justify-between items-center py-2 px-4 sm:px-6 md:px-5 relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center justify-center  gap-x-2 sm:gap-x-4 cursor-pointer group">
            <div className="relative ">
              <Image
                src={Logo}
                alt="Logo"
                width={24}
                height={24}
                className="sm:w-9 sm:h-9 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 ease-in-out"
              />
            </div>
            <span
              className={`text-xl sm:text-2xl md:text-3xl font-bold text-teal-100 tracking-tight group-hover:text-teal-300 transition-colors duration-300 ${styleScript.className}`}
            >
              <Image src="/title.png" alt="Logo" width={180} height={28} />
            </span>
          </div>
        </Link>

        <SignedIn>
          <nav className="hidden md:flex items-center gap-x-8">
            <div className="flex gap-x-4 lg:gap-x-6 text-gray-300 font-medium">
              {navItems.map((item, idx) => (
                <Link
                  key={`link-${idx}`}
                  href={item.link}
                  className="relative group text-xs font-poppins hover:translate-y-[-1px] text-gray-400 hover:text-white cursor-pointer transition-all duration-400 flex items-center space-x-0.5"
                >
                  <span className="block">{item.icon}</span>
                  <span className="block">{item.name}</span>
                  <span className="absolute left-0  bottom-0 w-0 h-0.5 mt-0.5 bg-teal-400 transition-all duration-500 group-hover:w-full group-hover:shadow-glow"></span>
                </Link>
              ))}
            </div>
          </nav>
        </SignedIn>

        <div className="flex items-center ">
          <SignedOut>
            <div className="flex space-x-2 sm:space-x-3 ">
              <SignUpButton signInForceRedirectUrl="/dashboard">
                <button
                  style={{ border: "1px solid var(--cta)" }}
                  className="px-2 sm:px-4 py-1 text-white rounded-lg font-poppins font-normal text-xs sm:text-sm border border-red-300/30 cursor-pointer transition-all duration-400 hover:from-[#ED213A] hover:to-[#b93627] hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-100 relative"
                >
                  <span>Sign Up</span>
                </button>
              </SignUpButton>
              <SignInButton signUpForceRedirectUrl="/dashboard">
                <button
                  style={{
                    border: "1px solid var(--love-text)",
                    backgroundColor: "var(--love)",
                  }}
                  className="px-2 sm:px-4 py-1  text-gray-300 rounded-lg font-poppins font-medium text-xs sm:text-sm cursor-pointer transition-all duration-400 hover:from-purple-800 hover:to-purple-800 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-100 relative"
                >
                  <span>Sign In</span>
                </button>
              </SignInButton>
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

            <div className="relative  w-44 flex justify-end item-end">
              <div className="shadow-sm">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-teal-300/40 shadow-sm cursor-pointer",
                    },
                  }}
                />
              </div>
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
    </motion.header>
  );
};

export default Header;
