"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedPage from "@/components/protectedPage";
import EventInsightsPopup from "@/components/EventInsightsPopup";
import Dashboard from "@/components/AiDashboard";

export default function InsightsPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [selectedOption, setSelectedOption] = useState<"insights" | "reports" | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  const handleOptionSelect = (option: "insights" | "reports") => {
    setSelectedOption(option);
    setShowPopup(false);
  };
  
  const handleEventsSelect = (events: string[]) => {
    setSelectedEvents(events);
  };

  return (
    <ProtectedPage>
      <AnimatePresence>
        {showPopup && (
          <EventInsightsPopup 
            onSelectOption={handleOptionSelect}
          />
        )}
      </AnimatePresence>
      
      {!showPopup && selectedOption && (
        <Dashboard 
          mode={selectedOption} 
          selectedEvents={selectedEvents}
          onEventsSelect={handleEventsSelect}
        />
      )}
    </ProtectedPage>
  );
}