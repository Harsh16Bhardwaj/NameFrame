import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Mail,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const linkColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "See in Action", href: "#demo" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Create Event", href: "/create" },
      { label: "Verify Certificate", href: "#verify" },
      { label: "Templates", href: "#templates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQs", href: "#faqs" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "Support", href: "#support" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Team", href: "#contact" },
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

const socials = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
];

const Footer = () => {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-[#05060a] px-5 pb-5 pt-20 text-zinc-300 sm:px-4 lg:px-10">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-200/25 to-transparent" />

        <div className="absolute left-[10%] top-14 h-56 w-56 rounded-full bg-teal-400/[0.09] blur-[95px]" />
        <div className="absolute right-[8%] top-32 h-60 w-60 rounded-full bg-indigo-500/[0.075] blur-[105px]" />

        <div className="absolute bottom-16 left-1/2 h-80 w-[78%] -translate-x-1/2 bg-gradient-to-t from-teal-400/[0.12] via-indigo-500/[0.055] to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-8xl">
        {/* Main footer content */}
        <div className="grid gap-14 ml-24 border-t border-white/[0.09] pt-12 lg:grid-cols-[1.05fr_1.65fr] lg:gap-20">
          {/* Brand side */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="inline-flex opacity-95 transition-opacity hover:opacity-100"
            >
              <h1 className="text-2xl font-bold text-white sm:text-4xl">
                You Know The Name :)
              </h1>
 
            </Link>

            <p className="mt-5 max-w-md text-base leading-8 text-zinc-400">
              Made with care for moments worth remembering  from event creation
              to certificate delivery.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/[0.06] px-3.5 py-2">
                <Sparkles className="h-4 w-4 text-teal-300" />
                AI assisted
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] px-3.5 py-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                Event ready
              </span>
            </div>

            <div className="mt-8 ml-1 flex items-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-white/15 bg-white/[0.035] p-2 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-300/45 hover:bg-teal-300/[0.08] hover:text-teal-300"
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid ml-20 grid-cols-2 gap-x-1 gap-y-8 sm:grid-cols-4">
            {linkColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-200">
                  {column.title}
                </h4>

                <ul className="space-y-3.5">
                  {column.links.map((link) => {
                    const isExternal = link.href.startsWith("http");

                    const className =
                      "group inline-flex items-center gap-1.5 text-[15px] text-zinc-400 transition-colors duration-300 hover:text-teal-200";

                    if (isExternal) {
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                          >
                            {link.label}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-80" />
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li key={link.label}>
                        <Link href={link.href} className={className}>
                          {link.label}
                          <span className="h-px w-0 bg-teal-300/80 transition-all duration-300 group-hover:w-4" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging giant wordmark */}
        <div className="relative mt-10 h-40 w-full overflow-hidden sm:h-52 md:h-64 lg:h-72">
          <h2 className="absolute px-2 bottom-[0.04em] left-1/2 w-full -translate-x-1/2 select-none text-center text-[4.2rem] font-black leading-none tracking-[-0.08em] sm:text-[6.7rem] md:text-[8.2rem] lg:text-[12rem] ">
            <span className="bg-gradient-to-t w-full from-white/[0.045] via-teal-100/[0.14] to-cyan-200/[0.26] bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(45,212,191,0.12)]">
              NameFrame
            </span>
          </h2>

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#05060a] via-[#05060a]/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#05060a] via-[#05060a]/30 to-transparent" />
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;