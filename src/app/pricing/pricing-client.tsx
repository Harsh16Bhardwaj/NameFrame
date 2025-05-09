"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";

const PricingPageClient = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-20 bg-[var(--dashboard-bg)] text-[var(--text-primary)]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--tealy-heading)] via-[var(--pale)] to-[var(--bluey)] text-transparent bg-clip-text">
            Free For Beta Release !
          </h1>
          <p className="text-[var(--text-secondary)] mt-4 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your certificate needs. Start free or go pro for more features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-lg ${!isYearly ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 rounded-full bg-[var(--muted)] flex items-center p-1 transition-all duration-200"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[var(--tealy)] transition-all duration-200 ${isYearly ? "ml-6" : ""}`}
              ></div>
            </button>
            <span className={`text-lg ${isYearly ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
              Yearly <span className="text-[var(--color-success)] text-xs">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-md)]"
          >
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Free</h3>
              <div className="text-3xl font-bold text-[var(--text-primary)]">
                ₹0<span className="text-[var(--text-secondary)] text-sm">/month</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2">Ideal for small events and personal use.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Up to 50 certificates/month</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Basic templates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Email delivery</span>
              </div>
              <div className="flex items-start text-[var(--text-secondary)]">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-start text-[var(--text-secondary)]">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>API access</span>
              </div>
            </div>
            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 border border-[var(--tealy)] text-[var(--tealy)] rounded-lg hover:bg-[var(--tealy)]/10 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-[var(--card-bg)] rounded-xl border border-[var(--tealy)] overflow-hidden shadow-[var(--shadow-lg)] shadow-[var(--tealy)]/20 transform scale-105 z-10"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)]"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)] text-[var(--pale-text)] text-xs font-semibold py-1 px-3 rounded-full">
              Most Popular
            </div>
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Pro</h3>
              <div className="text-3xl font-bold text-[var(--text-primary)]">₹
                {isYearly ? "699" : "149"}<span className="text-[var(--text-secondary)] text-sm">/month</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2">For teams and frequent events.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Unlimited certificates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>All templates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Email & link delivery</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-start text-[var(--text-secondary)]">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>API access</span>
              </div>
            </div>
            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)] rounded-lg hover:from-[var(--bluey1)] hover:to-[var(--bluey-hover)] text-[var(--pale-text)] transition-all shadow-lg hover:shadow-[var(--tealy)]/25"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-[var(--shadow-md)]"
          >
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Enterprise</h3>
              <div className="text-3xl font-bold text-[var(--text-primary)]">
                ₹{isYearly ? "999" : "399"}<span className="text-[var(--text-secondary)] text-sm">/month</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2">For large organizations with custom needs.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Everything in Pro</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>White labeling</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Priority support</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom integrations</span>
              </div>
              <div className="flex items-start">
                <Check className="text-[var(--color-success)] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Full API access</span>
              </div>
            </div>
            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 border border-[var(--tealy)] text-[var(--tealy)] rounded-lg hover:bg-[var(--tealy)]/10 transition-colors"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingPageClient;