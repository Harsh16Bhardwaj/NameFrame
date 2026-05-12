import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
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

const testimonials = [
  {
    quote:
      "We used this for our community event certificates and the process was flawless. It saved hours of manual work.",
    name: "Rohit Goel",
    role: "GDG Lead",
    size: "featured",
    accent: "teal",
  },
  {
    quote:
      "I needed certificates for a hackathon. The whole flow took minutes, not days.",
    name: "Aryan Chauhan",
    role: "Technical Lead at TechXtract",
    size: "normal",
    accent: "teal",
  },
  {
    quote:
      "Our society needed a way to recognize members with certificates. NameFrame made it simple.",
    name: "Anya Singh",
    role: "Society at MAIT",
    size: "tall",
    accent: "rose",
  },
  {
    quote:
      "Managing event logistics is already a lot. Automating certificates was a massive relief.",
    name: "Vikas Gupta",
    role: "Event Management at SPMCIL",
    size: "normal",
    accent: "zinc",
  },
  {
    quote:
      "I created custom designs and used NameFrame to handle the repetitive certificate work.",
    name: "Sarthak Aggarwal",
    role: "Freelance Graphic Designer",
    size: "normal",
    accent: "purple",
  },
];

const Testimonials = () => {
  return (
    <section
      className={`${inter.variable} relative overflow-hidden bg-black py-20 sm:py-24`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-[-10rem] top-24 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p
            className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-teal-400/90"
            style={{ fontFamily: poppins.style.fontFamily }}
          >
            Loved by event teams
          </p>

          <h2
            className="nf-heading-reveal text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: spaceGrotesk.style.fontFamily }}
          >
            Certificates that people actually remember.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
            From hackathons to college societies, NameFrame helps teams send
            polished certificates without getting buried in manual work.
          </p>
        </div>

        {/* Compact testimonial grid */}
        <div className="grid auto-rows-[150px] gap-4 md:grid-cols-6">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={[
                "group relative overflow-hidden rounded-2xl border bg-zinc-900/45 p-5 transition-all duration-300",
                "hover:-translate-y-1 hover:bg-zinc-900/70",
                getCardSize(item.size),
                getAccent(item.accent),
              ].join(" ")}
              style={{
                animationDelay: `${index * 90}ms`,
              }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-teal-400/0 blur-2xl transition-all duration-300 group-hover:bg-teal-400/10" />

              <Quote className="mb-3 h-4 w-4 text-teal-400/80" />

              <p
                className={[
                  "relative z-10 leading-relaxed text-zinc-300",
                  item.size === "featured"
                    ? "text-sm sm:text-base"
                    : "text-sm",
                ].join(" ")}
              >
                “{item.quote}”
              </p>

              <div className="relative z-10 mt-5">
                <h3 className="text-sm font-semibold text-white">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">{item.role}</p>
              </div>
            </article>
          ))}

          {/* Brand tile */}
          <div className="group relative hidden overflow-hidden rounded-2xl border border-teal-500/20 bg-teal-400/5 p-5 md:col-span-2 md:row-span-1 md:flex md:items-center md:justify-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.12),transparent_65%)]" />

            <Image
              src="/title-2.png"
              alt="NameFrame"
              width={260}
              height={120}
              className="relative z-10 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>

      <style>
        {`
          .nf-heading-reveal {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.55),
              rgba(255,255,255,1),
              rgba(45,212,191,0.9),
              rgba(255,255,255,1),
              rgba(255,255,255,0.55)
            );
            background-size: 220% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: nfHeadingShine 7s ease-in-out infinite;
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

          @media (prefers-reduced-motion: reduce) {
            .nf-heading-reveal {
              animation: none;
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

const getCardSize = (size: string) => {
  switch (size) {
    case "featured":
      return "md:col-span-4 md:row-span-1";
    case "tall":
      return "md:col-span-2 md:row-span-2";
    default:
      return "md:col-span-2 md:row-span-1";
  }
};

const getAccent = (accent: string) => {
  switch (accent) {
    case "teal":
      return "border-teal-500/20 hover:border-teal-500/35 shadow-[0_0_35px_rgba(45,212,191,0.04)]";
    case "rose":
      return "border-rose-500/20 hover:border-rose-500/35 shadow-[0_0_35px_rgba(244,63,94,0.05)]";
    case "purple":
      return "border-fuchsia-500/15 hover:border-fuchsia-500/30 shadow-[0_0_35px_rgba(217,70,239,0.04)]";
    default:
      return "border-white/5 hover:border-white/10";
  }
};

export default Testimonials;