import React from "react";
import {
  Upload,
  Award,
  Mail,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const features = [
  {
    icon: Upload,
    step: "01",
    title: "Bulk Upload",
    description:
      "Import participant names, emails, and event data using CSV or Excel instead of creating certificates manually.",
    accentText: "Clean participant data in one place.",
  },
  {
    icon: Award,
    step: "02",
    title: "Visual Designer",
    description:
      "Position names, dates, event titles, and custom text precisely on your certificate templates.",
    accentText: "Bring your own design or use a template.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Generate Certificates",
    description:
      "Create personalized certificates for every participant in bulk without editing files one by one.",
    accentText: "Fast generation for large events.",
  },
  {
    icon: Mail,
    step: "04",
    title: "Automated Delivery",
    description:
      "Send certificates directly to participant emails with event-specific messages and delivery tracking.",
    accentText: "Know what was sent and what failed.",
  },
  {
    icon: Sparkles,
    step: "05",
    title: "Custom Mails",
    description:
      "Personalize email content with participant names, event details, and certificate links.",
    accentText: "Make every certificate feel intentional.",
  },
  {
    icon: TrendingUp,
    step: "06",
    title: "Actionable Insights",
    description:
      "Track participants, generated certificates, sent emails, failed deliveries, and event performance.",
    accentText: "Improve future events with real data.",
  },
];

export const Features: React.FC = () => {
  return (
    <section
      className={`${inter.variable} relative bg-black py-24 sm:py-28`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Subtle background glows */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-4">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-teal-400/90">
            How NameFrame Works
          </p>

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: spaceGrotesk.style.fontFamily }}
          >
            From participant list to delivered certificates.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-sm">
            Everything you need to create, manage, and send event
            certificates without repetitive manual work.
          </p>
        </div>

        {/* Workflow Strip */}
        <div className="mb-10 hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-4 md:block">
          <div className="grid grid-cols-4 gap-3">
            {["Upload Data", "Design Template", "Generate in Bulk", "Send & Track"].map(
              (item, index) => (
                <div
                  key={item}
                  className="relative rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-center"
                >
                  <span className="text-sm font-medium text-zinc-300">
                    {item}
                  </span>

                  {index < 3 && (
                    <span className="absolute right-[-18px] top-1/2 hidden h-px w-9 -translate-y-1/2 bg-teal-400/30 md:block" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isPrimary = index === 2;

            return (
              <article id="workflow" 
                key={feature.title}
                className={[
                  "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                  "bg-zinc-900/50 hover:bg-zinc-900/80",
                  isPrimary
                    ? "border-teal-500/30 shadow-[0_0_45px_rgba(45,212,191,0.08)]"
                    : "border-white/5 hover:border-teal-500/25",
                ].join(" ")}
              >
                {/* Card glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-teal-400/0 blur-2xl transition-all duration-300 group-hover:bg-teal-400/10" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-xl border",
                        isPrimary
                          ? "border-teal-500/30 bg-teal-400/10 text-teal-400"
                          : "border-white/5 bg-black/30 text-teal-400",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-semibold text-zinc-600 group-hover:text-teal-400/80">
                      {feature.step}
                    </span>
                  </div>

                  <h3
                    className="mb-3 text-xl font-semibold text-white"
                    style={{ fontFamily: spaceGrotesk.style.fontFamily }}
                  >
                    {feature.title}
                  </h3>

                  <p className="mb-5 min-h-[72px] text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>

                  <p className="text-sm font-medium text-teal-400/90">
                    {feature.accentText}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;