"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, AlertCircle } from "lucide-react";

interface EventSelectorProps {
  events: any[];
  selectedEvents: string[];
  onEventsSelect: (events: string[]) => void;
  mode: "insights" | "reports";
  isLoading: boolean;
}

export default function EventSelector({ events, selectedEvents, onEventsSelect, mode, isLoading }: EventSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEventToggle = (eventId: string) => {
    if (mode === "reports") {
      // For reports mode, only allow one selection
      onEventsSelect([eventId]);
    } else {
      // For insights mode, allow multiple selections (up to 10)
      if (selectedEvents.includes(eventId)) {
        onEventsSelect(selectedEvents.filter(id => id !== eventId));
      } else {
        // Check if already at max selection (10)
        if (selectedEvents.length < 10) {
          onEventsSelect([...selectedEvents, eventId]);
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex gap-2 items-center">
          <Calendar className="w-5 h-5 text-[var(--tealy-heading)]" />
          <h2 className="text-xl font-medium text-[var(--pale)]">
            Select {mode === "insights" ? "Events" : "an Event"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--bluey-text)]/10 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 items-center">
          <Calendar className="w-5 h-5 text-[var(--tealy-heading)]" />
          <h2 className="text-xl font-medium text-[var(--pale)]">
            Select {mode === "insights" ? "Events" : "an Event"}
          </h2>
          {mode === "insights" && (
            <span className="text-xs bg-[var(--bluey)]/30 text-[var(--tealy-heading)] px-2 py-1 rounded-md">
              {selectedEvents.length}/10 selected
            </span>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--space-text)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 pl-9 pr-4 bg-[var(--bluey-text)]/10 border border-[var(--space)]/30 rounded-lg text-[var(--pale)] text-sm focus:outline-none focus:border-[var(--tealy)] transition-all w-full md:w-[300px]"
          />
        </div>
      </div>
      
      {events.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-[var(--tealy-heading)] mb-3 opacity-60" />
          <p className="text-[var(--pale)]">No events found</p>
          <p className="text-[var(--space-text)] text-sm mt-1">
            Create an event first to use AI Insights
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-lg cursor-pointer transition-all border
                ${selectedEvents.includes(event.id) 
                  ? 'border-[var(--tealy)] bg-[var(--tealy)]/10' 
                  : 'border-[var(--space)]/30 bg-[var(--bluey-text)]/10 hover:bg-[var(--bluey-text)]/20'
                }
              `}
              onClick={() => handleEventToggle(event.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--pale)] truncate">{event.title}</h3>
                  <p className="text-sm text-[var(--space-text)]">
                    {new Date(event.date).toLocaleDateString()} • {event.participants} participants
                  </p>
                </div>
                
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedEvents.includes(event.id) 
                    ? 'bg-[var(--tealy)] border-[var(--tealy)]' 
                    : 'border-[var(--space)]'
                }`}>
                  {selectedEvents.includes(event.id) && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}