"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileText } from "lucide-react";

interface InsightsSwitcherProps {
  activeTab: "chat" | "reports";
  onTabChange: (tab: "chat" | "reports") => void;
}

export default function InsightsSwitcher({ activeTab, onTabChange }: InsightsSwitcherProps) {
  return (
    <div className="flex border border-[var(--space)]/40 rounded-lg overflow-hidden p-1 bg-[var(--dark-onyx)]/60">
      <button
        onClick={() => onTabChange("chat")}
        className={`relative px-4 py-2 rounded-md flex items-center gap-2 text-sm ${
          activeTab === "chat" 
            ? "text-[var(--pale)]" 
            : "text-[var(--space-text)] hover:text-[var(--pale)] transition-colors"
        }`}
      >
        {activeTab === "chat" && (
          <motion.div
            layoutId="active-tab"
            className="absolute inset-0 bg-[var(--bluey)] rounded-md"
            style={{ zIndex: -1 }}
            initial={false}
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <MessageSquare className="w-4 h-4" />
        Chat
      </button>
      
      <button
        onClick={() => onTabChange("reports")}
        className={`relative px-4 py-2 rounded-md flex items-center gap-2 text-sm ${
          activeTab === "reports" 
            ? "text-[var(--pale)]" 
            : "text-[var(--space-text)] hover:text-[var(--pale)] transition-colors"
        }`}
      >
        {activeTab === "reports" && (
          <motion.div
            layoutId="active-tab"
            className="absolute inset-0 bg-[var(--bluey)] rounded-md" 
            style={{ zIndex: -1 }}
            initial={false}
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        <FileText className="w-4 h-4" />
        Reports
      </button>
    </div>
  );
}