import React from "react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Inter, Space_Grotesk, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const carouselImages = [
  "/img1.webp",
  "/img2.webp",
  "/img3.webp",
  "/img4.webp",
  "/img5.webp",
];

const Hero = () => {
  return (
    <section
      className={`${inter.variable} landing-hero relative min-h-screen overflow-hidden py-20 flex items-center justify-center`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Lightweight ambient glows */}
      <div className="pointer-events-none absolute left-[-12%] top-[28%] h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[16%] h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="container relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-14 xl:gap-20 items-center">
        {/* Hero Content */}
        <div className="space-y-5 text-center ml-10  lg:text-left lg:translate-y-14 xl:translate-y-10">
          <div className="space-y-4 ">
            <p
              className="text-lg sm:text-sm ml-2 font-medium tracking-[0.16em] uppercase text-teal-400/90"
              style={{ fontFamily: poppins.style.fontFamily }}
            >
              Certificates, without the chaos.
            </p>

            {/* Do not mess with the logo */}
            <Image
              src="/title-2.png"
              alt="NameFrame"
              width={420}
              height={320}
              priority
              className="mx-auto lg:mx-0 z-20"
            />

            <h1
              className="text-2xl sm:text-3xl md:text-2xl font-bold text-[var(--landing-text)] leading-tight max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: spaceGrotesk.style.fontFamily }}
            >
              Create and send certificates in minutes.
            </h1>
          </div>

          <p
            className="text-base sm:text-base text-zinc-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            style={{ fontFamily: inter.style.fontFamily }}
          >
            Upload participants, generate personalized certificates, and deliver
            them by email from one clean event workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-1">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <button
                  className="px-7 py-3 bg-[var(--landing-accent)] text-[var(--landing-text)] rounded-xl hover:bg-[var(--landing-accent-hover)] transition-colors text-sm sm:text-base font-medium shadow-md"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button
                  className="px-7 py-3 bg-[var(--landing-accent)] text-[var(--landing-text)] rounded-xl hover:bg-[var(--landing-accent-hover)] transition-colors text-sm sm:text-base font-semibold shadow-md"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>

            <Link href="#workflow">
              <button
                className="px-7 py-3 rounded-xl border border-white/30 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-teal-500/30 hover:bg-zinc-900/70 transition-colors text-sm sm:text-base font-medium"
                style={{ fontFamily: poppins.style.fontFamily }}
              >
                See Workflow
              </button>
            </Link>
          </div>

        </div>

        {/* Window-style CSS-only Carousel */}
        <div className="relative mt-10 w-full max-w-4xl">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-teal-400/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-zinc-950/80 shadow-[0_0_70px_rgba(45,212,191,0.08)] backdrop-blur-xl">
            {/* Mac-style top bar */}
            <div className="flex h-11 items-center justify-between border-b border-white/5 bg-zinc-900/70 px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/90" />
                <span className="h-3 w-3 rounded-full bg-amber-400/90" />
                <span className="h-3 w-3 rounded-full bg-teal-400/90" />
              </div>

              <div className="hidden sm:block text-xs text-zinc-500 tracking-wide">
                NameFrame Preview
              </div>

              <div className="h-3 w-16" />
            </div>

            <div className="relative bg-black/40 p-3 sm:p-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/5 bg-black">
                {carouselImages.map((src, index) => (
                  <div
                    key={src}
                    className="nf-slide absolute inset-0"
                    style={{
                      animationDelay: `${index * 8}s`,
                    }}
                  >
                    <Image
                      src={src}
                      alt={`NameFrame product preview ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 860px"
                      priority={index === 0}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">
                {carouselImages.map((_, index) => (
                  <span
                    key={index}
                    className="nf-dot h-2 w-2 rounded-full bg-zinc-500"
                    style={{
                      animationDelay: `${index * 8}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .nf-slide {
            opacity: 0;
            transform: scale(1.01);
            animation: nfCarousel 40s infinite ease-in-out;
          }

          .nf-dot {
            opacity: 0.45;
            animation: nfDot 40s infinite ease-in-out;
          }

          @keyframes nfCarousel {
            0% {
              opacity: 0;
              transform: scale(1.01);
            }

            4% {
              opacity: 1;
              transform: scale(1);
            }

            18% {
              opacity: 1;
              transform: scale(1.005);
            }

            22% {
              opacity: 0;
              transform: scale(1.01);
            }

            100% {
              opacity: 0;
              transform: scale(1.01);
            }
          }

          @keyframes nfDot {
            0% {
              opacity: 0.45;
              width: 0.5rem;
              background: rgb(113 113 122);
            }

            4% {
              opacity: 1;
              width: 1.5rem;
              background: rgb(45 212 191);
            }

            18% {
              opacity: 1;
              width: 1.5rem;
              background: rgb(45 212 191);
            }

            22% {
              opacity: 0.45;
              width: 0.5rem;
              background: rgb(113 113 122);
            }

            100% {
              opacity: 0.45;
              width: 0.5rem;
              background: rgb(113 113 122);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .nf-slide,
            .nf-dot {
              animation: none;
            }

            .nf-slide:first-child {
              opacity: 1;
              transform: scale(1);
            }

            .nf-dot:first-child {
              opacity: 1;
              width: 1.5rem;
              background: rgb(45 212 191);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;