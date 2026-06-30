"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 overflow-x-hidden bg-transparent relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[var(--landing-text)] md:text-6xl font-bold text-2xl mb-2 max-w-2xl mx-auto">
            Explore the Pricing
          </p>
          <h2
            className={`text-md md:text-xl text-[var(--landing-text-muted)] font-bold mb-4 ${inter.className}`}
          >
            It&apos;s free for now, but who knows...
          </h2>

          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`${!isYearly ? "text-[var(--landing-text)]" : "text-[var(--landing-text-muted)]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 border border-[var(--landing-surface-border)] rounded-full bg-[var(--landing-surface)] flex items-center px-1 transition-all duration-200"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[var(--landing-accent)] transition-all duration-200 ${
                  isYearly ? "ml-6" : ""
                }`}
              />
            </button>
            <span className={`${isYearly ? "text-[var(--landing-text)]" : "text-[var(--landing-text-muted)]"}`}>
              Yearly <span className="text-xs">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PlanCard
            name="Free"
            price="0"
            subtitle="Perfect for small events and individual use."
            cta="Get Started"
            isFeatured={false}
            features={[
              "Up to 50 certificates/month",
              "Basic templates",
              "Email delivery",
              "Custom branding|disabled",
              "API access|disabled",
            ]}
          />
          <PlanCard
            name="Pro"
            price={isYearly ? "699" : "149"}
            subtitle="For teams and organizations with regular events."
            cta="Get Started"
            isFeatured
            features={[
              "Unlimited certificates",
              "All templates",
              "Email & link delivery",
              "Custom branding",
              "API access|disabled",
            ]}
          />
          <PlanCard
            name="Enterprise"
            price={isYearly ? "999" : "399"}
            subtitle="For large organizations and unique requirements."
            cta="Contact Sales"
            isFeatured={false}
            features={[
              "Everything in Pro",
              "White labeling",
              "Priority support",
              "Custom integrations",
              "Full API access",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

function PlanCard({
  name,
  price,
  subtitle,
  cta,
  features,
  isFeatured,
}: {
  name: string;
  price: string;
  subtitle: string;
  cta: string;
  features: string[];
  isFeatured: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      className={`relative md:mx-0 mx-4 rounded-xl border overflow-hidden ${
        isFeatured
          ? "border-[var(--landing-accent)] bg-[var(--landing-surface)] scale-[1.02]"
          : "border-[var(--landing-surface-border)] bg-[var(--landing-surface)]"
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[var(--landing-accent)] text-[var(--landing-bg-0)] text-xs font-semibold py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}

      <div className="p-6 border-b border-[var(--landing-surface-border)]">
        <h3 className="text-xl font-semibold mb-2 text-[var(--landing-text)]">{name}</h3>
        <div className="text-3xl font-bold text-[var(--landing-text)]">
          ₹{price}
          <span className="text-[var(--landing-text-muted)] text-sm">/month</span>
        </div>
        <p className="text-[var(--landing-text-muted)] mt-2">{subtitle}</p>
      </div>

      <div className="p-6 space-y-4 text-[var(--landing-text-muted)]">
        {features.map((feature) => {
          const [text, flag] = feature.split("|");
          const disabled = flag === "disabled";
          return <Feature key={feature} text={text} disabled={disabled} />;
        })}
      </div>

      <div className="p-6">
        <button
          className={`w-full cursor-pointer py-2 rounded-lg transition-colors ${
            isFeatured
              ? "bg-[var(--landing-accent)] text-[var(--landing-bg-0)] hover:bg-[var(--landing-accent-hover)]"
              : "border border-[var(--landing-surface-border)] text-[var(--landing-text)] bg-transparent hover:bg-[var(--landing-surface-border)]/25"
          }`}
        >
          {cta}
        </button>
      </div>
    </motion.div>
  );
}

function Feature({ text, disabled }: { text: string; disabled?: boolean }) {
  return (
    <div className={`flex items-start ${disabled ? "opacity-50" : ""}`}>
      <Check className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}
