"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, BarChart2 } from "lucide-react";

interface EventInsightsPopupProps {
  onSelectOption: (option: "insights" | "reports") => void;
}

export default function EventInsightsPopup({ onSelectOption }: EventInsightsPopupProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-[var(--dark-onyx)]/80 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[var(--onyx)] rounded-xl shadow-xl p-8 max-w-4xl w-full mx-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-[var(--pale)] mb-6 text-center">
          Choose AI Analysis Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Event Insights Option */}
          <motion.div
            className="bg-[var(--bluey)]/30 border border-[var(--space)]/30 rounded-xl p-6 cursor-pointer hover:border-[var(--tealy)] transition-all duration-300"
            whileHover={{ scale: 1.02, borderColor: "var(--tealy)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption("insights")}
          >
            <div className="p-4 bg-[var(--bluey)]/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-8 h-8 text-[var(--tealy-heading)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--pale)] text-center mb-3">Event Insights</h3>
            <p className="text-[var(--space-text)] text-center">
              Get AI-powered insights and analytics from multiple events. Compare patterns and discover trends across up to 10 events.
            </p>
            <div className="mt-6 text-center">
              <span className="px-4 py-2 bg-[var(--bluey-text)]/30 text-[var(--tealy-heading)] text-sm rounded-full">
                Select up to 10 events
              </span>
            </div>
          </motion.div>

          {/* Event Reports Option */}
          <motion.div
            className="bg-[var(--space)]/10 border border-[var(--space)]/30 rounded-xl p-6 cursor-pointer hover:border-[var(--tealy)] transition-all duration-300"
            whileHover={{ scale: 1.02, borderColor: "var(--tealy)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectOption("reports")}
          >
            <div className="p-4 bg-[var(--space)]/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart2 className="w-8 h-8 text-[var(--tealy-heading)]" />
            </div>
            <h3 className="text-2xl font-semibold text-[var(--pale)] text-center mb-3">Event Reports</h3>
            <p className="text-[var(--space-text)] text-center">
              Generate comprehensive reports for a specific event. Get detailed analysis and actionable recommendations.
            </p>
            <div className="mt-6 text-center">
              <span className="px-4 py-2 bg-[var(--space)]/30 text-[var(--tealy-heading)] text-sm rounded-full">
                Select a single event
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}