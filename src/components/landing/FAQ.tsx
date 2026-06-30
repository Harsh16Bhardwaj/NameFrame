"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, CheckCircle2 } from "lucide-react";
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

const faqs = [
  {
    question: "What makes NameFrame different from other certificate platforms?",
    answer:
      "NameFrame is built for the full event certificate workflow. You can manage events, upload participants, generate certificates in bulk, send them by email, and track useful delivery insights from one workspace.",
  },
  {
    question: "Can I use my own certificate designs?",
    answer:
      "Yes. You can upload your own certificate templates and place participant names, event details, dates, and custom text exactly where you want them.",
  },
  {
    question: "What kind of events is NameFrame best for?",
    answer:
      "NameFrame works well for hackathons, college society events, workshops, bootcamps, competitions, training sessions, and any event where certificates need to be personalized and delivered quickly.",
  },
  {
    question: "Can I send certificates by email?",
    answer:
      "Yes. NameFrame can send generated certificates directly to participant emails and help you track sent, pending, or failed deliveries.",
  },
  {
    question: "Do you offer a free tier?",
    answer:
      "Yes. The free tier lets you explore the core certificate creation and delivery flow before moving to a larger plan.",
  },
  {
    question: "Is participant data secure?",
    answer:
      "NameFrame is designed to keep participant and event data organized and protected. You should still avoid uploading unnecessary sensitive data and only collect the fields required for certificate delivery.",
  },
];

export const FAQ = () => {
  // Closed by default
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq((current) => (current === index ? null : index));
  };

  return (
    <section
      className={`${inter.variable} relative overflow-hidden bg-black py-16 sm:py-20`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-[-10rem] top-20 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-9rem] bottom-10 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        {/* Header */}
        <div className="relative mx-auto mb-10 max-w-3xl text-center">
          {/* Subtle spin element */}
          <div className="pointer-events-none absolute left-1/2 top-[-5.4rem] hidden h-28 w-28 -translate-x-1/2 items-center justify-center sm:flex">
            <div className="nf-spin-ring absolute inset-0 rounded-full border border-teal-400/20" />
            <div className="nf-spin-ring-reverse absolute inset-4 rounded-full border border-rose-500/10" />
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-500/20 bg-teal-400/10 text-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.1)]">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>

          <p
            className="mb-6 mt-5  text-xs font-medium uppercase tracking-[0.24em] text-teal-400/90 sm:text-sm"
            style={{ fontFamily: poppins.style.fontFamily }}
          >
            Quick answers
          </p>

          <h2
            className="nf-heading-reveal text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: spaceGrotesk.style.fontFamily }}
          >
            Questions before you frame it?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Everything you need to know about creating, customizing, and sending
            certificates with NameFrame.
          </p>
        </div>

        {/* Centered FAQ Layout */}
        <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Compact Side Banner */}
          <aside className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-zinc-900/45 p-5 lg:self-start">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-36 w-36 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-teal-500/20 bg-black/30 text-teal-400">
                  <HelpCircle className="h-5 w-5" />
                </div>

                <div>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: spaceGrotesk.style.fontFamily }}
                  >
                    Still figuring things out?
                  </h3>
                  <p className="text-xs text-zinc-500">Here is the quick version.</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-zinc-400">
                NameFrame removes repetitive work from event certificates, from
                participant uploads to final email delivery.
              </p>

              <div className="mt-4 grid gap-2">
                <MiniPoint text="Bulk certificate generation" />
                <MiniPoint text="Custom templates" />
                <MiniPoint text="Email delivery tracking" />
              </div>

              <Link href="/contact">
                <button
                  className="mt-5 w-full rounded-xl border border-teal-500/30 bg-teal-400/10 px-4 py-2.5 text-sm font-medium text-teal-300 transition-all hover:border-teal-400 hover:bg-teal-400 hover:text-zinc-950 hover:shadow-[0_0_24px_rgba(45,212,191,0.18)]"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  Contact Support
                </button>
              </Link>
            </div>
          </aside>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;

              return (
                <div
                  key={faq.question}
                  className={[
                    "overflow-hidden rounded-2xl border transition-all duration-300",
                    isOpen
                      ? "border-teal-500/30 bg-zinc-900/70 shadow-[0_0_35px_rgba(45,212,191,0.06)]"
                      : "border-white/5 bg-zinc-900/45 hover:border-teal-500/20 hover:bg-zinc-900/65",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={[
                        "text-sm font-semibold transition-colors sm:text-[15px]",
                        isOpen ? "text-teal-300" : "text-zinc-100",
                      ].join(" ")}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "rotate-180 border-teal-500/30 bg-teal-400/10 text-teal-400"
                          : "border-white/5 bg-black/20 text-zinc-500",
                      ].join(" ")}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {/* Smooth dropdown */}
                  <div
                    className={[
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={[
                          "border-t border-white/5 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-400",
                          "transition-all duration-300",
                          isOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-2 opacity-0",
                        ].join(" ")}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>
        {`
          .nf-heading-reveal {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.58),
              rgba(255,255,255,1),
              rgba(45,212,191,0.95),
              rgba(255,255,255,1),
              rgba(255,255,255,0.58)
            );
            background-size: 220% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: nfHeadingShine 7s ease-in-out infinite;
          }

          .nf-spin-ring {
            animation: nfSpin 18s linear infinite;
          }

          .nf-spin-ring::before {
            content: "";
            position: absolute;
            top: -4px;
            left: 50%;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: rgb(45 212 191);
            box-shadow: 0 0 18px rgba(45,212,191,0.8);
          }

          .nf-spin-ring-reverse {
            animation: nfSpinReverse 28s linear infinite;
          }

          .nf-spin-ring-reverse::before {
            content: "";
            position: absolute;
            bottom: -3px;
            left: 35%;
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: rgb(244 63 94);
            box-shadow: 0 0 16px rgba(244,63,94,0.55);
          }

          @keyframes nfHeadingShine {
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

          @keyframes nfSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes nfSpinReverse {
            from {
              transform: rotate(360deg);
            }

            to {
              transform: rotate(0deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .nf-heading-reveal,
            .nf-spin-ring,
            .nf-spin-ring-reverse {
              animation: none;
            }

            .nf-heading-reveal {
              color: white;
              background: none;
              -webkit-background-clip: initial;
              background-clip: initial;
            }
          }
        `}
      </style>
    </section>
  );
};

interface MiniPointProps {
  text: string;
}

const MiniPoint: React.FC<MiniPointProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/25 px-3 py-2">
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-400" />
      <span className="text-xs text-zinc-400">{text}</span>
    </div>
  );
};

export default FAQ;