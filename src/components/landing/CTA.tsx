"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@/components/auth/clerk-client";
import {
  ArrowRight,
  Award,
  Mail,
  Upload,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
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

const CTA = () => {
  return (
    <section
      className={`${inter.variable} relative overflow-hidden bg-black py-20 sm:py-24`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-[-10rem] top-16 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-10 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-teal-500/20 bg-zinc-900/45 p-6 shadow-[0_0_80px_rgba(45,212,191,0.06)] sm:p-8 lg:p-10">
          {/* Inner shine */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

          {/* Spinning orbit */}
          <div className="pointer-events-none absolute right-8 top-8 hidden h-40 w-40 items-center justify-center lg:flex">
            <div className="nf-cta-spin absolute inset-0 rounded-full border border-teal-400/20" />
            <div className="nf-cta-spin-reverse absolute inset-5 rounded-full border border-rose-500/15" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-500/25 bg-black/40 text-teal-400 shadow-[0_0_35px_rgba(45,212,191,0.16)]">
              <Award className="h-7 w-7" />
            </div>
          </div>

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            {/* Left content */}
            <div>
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-teal-300"
                style={{ fontFamily: poppins.style.fontFamily }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ready when your event ends
              </div>

              <h2
                className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: spaceGrotesk.style.fontFamily }}
              >
                Turn every event into a{" "}
                <span className="nf-cta-heading">certificate drop.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Upload your participant list, generate personalized certificates,
                and send them by email without the post-event chaos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SignedOut>
                  <SignInButton forceRedirectUrl="/dashboard">
                    <button
                      className="group inline-flex items-center justify-center rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-teal-300 hover:shadow-[0_0_35px_rgba(45,212,191,0.24)] sm:text-base"
                      style={{ fontFamily: poppins.style.fontFamily }}
                    >
                      Start Creating Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link href="/dashboard">
                    <button
                      className="group inline-flex items-center justify-center rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-teal-300 hover:shadow-[0_0_35px_rgba(45,212,191,0.24)] sm:text-base"
                      style={{ fontFamily: poppins.style.fontFamily }}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </SignedIn>

                <Link href="#workflow">
                  <button
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-teal-500/30 hover:bg-zinc-900 hover:text-white sm:text-base"
                    style={{ fontFamily: poppins.style.fontFamily }}
                  >
                    See Workflow
                  </button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-500">
                <TrustPoint text="No manual editing" />
                <TrustPoint text="Bulk generation" />
                <TrustPoint text="Email delivery tracking" />
              </div>
            </div>

            {/* Right visual card */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-teal-400/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/45 p-4">
                {/* Mac bar */}
                <div className="mb-4 flex h-10 items-center justify-between rounded-2xl border border-white/5 bg-zinc-900/70 px-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                  </div>

                  <span className="hidden text-xs text-zinc-500 sm:block">
                    NameFrame Run
                  </span>

                  <div className="h-2.5 w-12" />
                </div>

                <div className="grid gap-3">
                  <PipelineCard
                    icon={Upload}
                    label="Participants uploaded"
                    value="248 rows"
                    status="CSV validated"
                    accent="teal"
                  />

                  <PipelineCard
                    icon={Award}
                    label="Certificates generated"
                    value="248 / 248"
                    status="100% complete"
                    accent="rose"
                  />

                  <PipelineCard
                    icon={Mail}
                    label="Emails delivered"
                    value="241 sent"
                    status="7 need review"
                    accent="zinc"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-teal-500/20 bg-teal-400/10 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-teal-300">
                      Certificate pipeline
                    </span>
                    <span className="text-xs text-zinc-500">Live preview</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-black/40">
                    <div className="nf-progress h-full rounded-full bg-teal-400" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>Upload</span>
                    <span>Generate</span>
                    <span>Send</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 mt-8 grid gap-3 border-t border-white/5 pt-6 sm:grid-cols-3">
            <MiniStat value="3 steps" label="From list to delivery" />
            <MiniStat value="Bulk ready" label="Made for real events" />
            <MiniStat value="Insightful" label="Track what happened" />
          </div>
        </div>
      </div>

      <style>
        {`
          .nf-cta-heading {
            background: linear-gradient(
              90deg,
              rgb(45 212 191),
              rgb(255 255 255),
              rgb(244 63 94),
              rgb(45 212 191)
            );
            background-size: 220% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: nfCtaShine 7s ease-in-out infinite;
          }

          .nf-cta-spin {
            animation: nfCtaSpin 22s linear infinite;
          }

          .nf-cta-spin::before {
            content: "";
            position: absolute;
            top: -4px;
            left: 50%;
            height: 8px;
            width: 8px;
            border-radius: 9999px;
            background: rgb(45 212 191);
            box-shadow: 0 0 20px rgba(45,212,191,0.75);
          }

          .nf-cta-spin-reverse {
            animation: nfCtaSpinReverse 34s linear infinite;
          }

          .nf-cta-spin-reverse::before {
            content: "";
            position: absolute;
            bottom: -3px;
            left: 35%;
            height: 6px;
            width: 6px;
            border-radius: 9999px;
            background: rgb(244 63 94);
            box-shadow: 0 0 18px rgba(244,63,94,0.55);
          }

          .nf-progress {
            width: 100%;
            transform-origin: left;
            animation: nfProgress 4.8s ease-in-out infinite;
            box-shadow: 0 0 20px rgba(45,212,191,0.45);
          }

          @keyframes nfCtaShine {
            0% {
              background-position: 220% center;
            }
            45% {
              background-position: 0% center;
            }
            100% {
              background-position: 0% center;
            }
          }

          @keyframes nfCtaSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes nfCtaSpinReverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          @keyframes nfProgress {
            0% {
              transform: scaleX(0.18);
              opacity: 0.55;
            }
            45% {
              transform: scaleX(1);
              opacity: 1;
            }
            75% {
              transform: scaleX(1);
              opacity: 1;
            }
            100% {
              transform: scaleX(0.18);
              opacity: 0.55;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .nf-cta-heading,
            .nf-cta-spin,
            .nf-cta-spin-reverse,
            .nf-progress {
              animation: none;
            }

            .nf-cta-heading {
              color: rgb(45 212 191);
              background: none;
              -webkit-background-clip: initial;
              background-clip: initial;
            }

            .nf-progress {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </section>
  );
};

interface TrustPointProps {
  text: string;
}

const TrustPoint: React.FC<TrustPointProps> = ({ text }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-black/25 px-3 py-2">
      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
      <span>{text}</span>
    </div>
  );
};

interface PipelineCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  status: string;
  accent: "teal" | "rose" | "zinc";
}

const PipelineCard: React.FC<PipelineCardProps> = ({
  icon: Icon,
  label,
  value,
  status,
  accent,
}) => {
  const accentClass =
    accent === "teal"
      ? "border-teal-500/20 bg-teal-400/10 text-teal-400"
      : accent === "rose"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
        : "border-white/10 bg-zinc-900/70 text-zinc-300";

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-teal-500/20 hover:bg-zinc-900/80">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-0.5 text-lg font-semibold text-white">{value}</p>
      </div>

      <span className="hidden rounded-full border border-white/5 bg-black/25 px-3 py-1 text-xs text-zinc-500 sm:inline-flex">
        {status}
      </span>
    </div>
  );
};

interface MiniStatProps {
  value: string;
  label: string;
}

const MiniStat: React.FC<MiniStatProps> = ({ value, label }) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/25 px-4 py-3">
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
};

export default CTA;
