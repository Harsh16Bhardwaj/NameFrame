"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Logo from "../../public/logo.png";
import UserSync from "./userSync";

const Header: React.FC = () => {
  return (
    <header className="w-full h-auto px-3 bg-neutral-900">
      <div className="flex justify-between py-2 items-center">
        <Link href="/" passHref>
          <div className="flex items-center gap-x-1 cursor-pointer">
            <Image
              src={Logo}
              alt="Logo"
              width={48}
              height={48}
              className="animate-bounce"
            />
            <span className="text-4xl poly signika font-bold ml-1">
              NameFrame
            </span>
          </div>
        </Link>
        <SignedIn>
          <UserSync />
          <nav>
            <div className="flex gap-x-10 mt-2 raleway font-medium">
              <Link
                href="/home"
                className="text-neutral-700 hover:font-bold nav hover:text-red-700 hover:-translate-y-1 ease-in-out duration-200"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-neutral-700 hover:font-bold nav hover:text-red-700 hover:-translate-y-1 ease-in-out duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/faqs"
                className="text-neutral-700 hover:font-bold nav hover:text-red-700 hover:-translate-y-1 ease-in-out duration-200"
              >
                FAQ's
              </Link>
              <Link
                href="/contact"
                className="text-neutral-700 hover:font-bold nav hover:text-red-700 hover:-translate-y-1 ease-in-out duration-200"
              >
                Contact
              </Link>
            </div>
            <hr className="mt-3 h-0.5 bg-red-400 opacity-30" />
          </nav>
        </SignedIn>
        {/* Conditional rendering for sign-in and sign-up buttons or user button */}
        <div className="flex space-x-4">
          <SignedOut>
            <div className="flex space-x-2">
              <SignUpButton signInForceRedirectUrl="/dashboard">
                <button className="border-b-3 border-r-3 text-neutral-600 bg-gray-200 border-black cursor-pointer px-6 py-2 font-semibold rounded-2xl transition-all duration-300 ease-in-out transform hover:bg-gray-100 hover:text-black hover:scale-105 hover:shadow-lg active:scale-100">
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton signUpForceRedirectUrl="/dashboard">
                <button className="bg-red-400 border-b-3 border-r-3 border-black cursor-pointer px-6 py-2 font-semibold rounded-2xl transition-all duration-300 ease-in-out transform hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-lg active:scale-100">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="w-28 px-2 flex justify-end">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8", // Adjust avatar size if needed
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
