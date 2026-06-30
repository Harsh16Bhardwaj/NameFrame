"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Loader2, Bot, User } from "lucide-react";

interface ChatAreaProps {
  selectedEvents: string[];
  events: any[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatArea({ selectedEvents, events }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectedEventNames = events
    .filter(event => selectedEvents.includes(event.id))
    .map(event => event.title);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus on input field when chat starts
  useEffect(() => {
    if (chatStarted) {
      inputRef.current?.focus();
    }
  }, [chatStarted]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isTyping) return;
    
    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setChatStarted(true);
    setIsTyping(true);
    
    // Simulate AI response with a delay (to be replaced with actual API call)
    setTimeout(() => {
      // Generate relevant response based on selected events
      let response = "I've analyzed the data from ";
      
      if (selectedEventNames.length === 0) {
        response = "Please select at least one event for me to analyze first.";
      } else if (selectedEventNames.length === 1) {
        response = `I've analyzed the data from ${selectedEventNames[0]}. `;
        
        if (input.toLowerCase().includes("attendance")) {
          response += "The attendance rate was 87% with 240 participants registered and 209 attending.";
        } else if (input.toLowerCase().includes("feedback") || input.toLowerCase().includes("rating")) {
          response += "The overall event rating was 4.3/5 based on 175 participant feedback submissions.";
        } else {
          response += "Based on your event data, participants were most engaged during the keynote session and networking lunch. The technical workshops had mixed reactions with a 3.8/5 average rating.";
        }
      } else {
        response = `I've analyzed the data from your ${selectedEventNames.length} selected events (${selectedEventNames.slice(0, 2).join(", ")}${selectedEventNames.length > 2 ? ", and others" : ""}). `;
        
        if (input.toLowerCase().includes("compare") || input.toLowerCase().includes("difference")) {
          response += "The Annual Conference 2025 had the highest attendance rate at 92%, while the Tech Workshop Series had the lowest at 78%. In terms of participant engagement, the Leadership Summit scored highest with an average session rating of 4.8/5.";
        } else if (input.toLowerCase().includes("trend") || input.toLowerCase().includes("pattern")) {
          response += "I've detected a pattern where events with pre-event communications sent at least 3 days in advance had 23% higher attendance rates. Also, events with interactive elements had 35% higher engagement scores.";
        } else {
          response += "Across all events, the average attendance rate was 85%, and the average participant satisfaction score was 4.2/5. The most common feedback themes were related to content quality, networking opportunities, and venue facilities.";
        }
      }
      
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000); // Simulate network delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {!chatStarted && selectedEvents.length > 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Bot className="w-12 h-12 text-[var(--tealy-heading)] mb-4 opacity-70" />
            <h3 className="text-xl font-medium text-[var(--pale)] mb-2">
              AI Insights Assistant
            </h3>
            <p className="text-[var(--space-text)] max-w-md mb-6">
              Ask questions about your {selectedEventNames.length > 1 ? "events" : "event"} to get data-driven insights and recommendations.
            </p>
            <div className="space-y-3 max-w-md w-full">
              <button
                onClick={() => {
                  setInput("What are the main trends across these events?");
                  setTimeout(() => handleSubmit(), 100);
                }}
                className="w-full p-3 text-left rounded-lg bg-[var(--bluey-text)]/10 hover:bg-[var(--bluey-text)]/20 text-[var(--pale)] transition-colors"
              >
                What are the main trends across these events?
              </button>
              <button
                onClick={() => {
                  setInput("Compare attendance rates between events");
                  setTimeout(() => handleSubmit(), 100);
                }}
                className="w-full p-3 text-left rounded-lg bg-[var(--bluey-text)]/10 hover:bg-[var(--bluey-text)]/20 text-[var(--pale)] transition-colors"
              >
                Compare attendance rates between events
              </button>
              <button
                onClick={() => {
                  setInput("What can I improve in future events?");
                  setTimeout(() => handleSubmit(), 100);
                }}
                className="w-full p-3 text-left rounded-lg bg-[var(--bluey-text)]/10 hover:bg-[var(--bluey-text)]/20 text-[var(--pale)] transition-colors"
              >
                What can I improve in future events?
              </button>
            </div>
          </div>
        )}

        {!chatStarted && selectedEvents.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Bot className="w-12 h-12 text-[var(--space-text)] mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-[var(--pale)] mb-2">
              Select Events First
            </h3>
            <p className="text-[var(--space-text)] max-w-md">
              Please select one or more events above to start getting insights from the AI assistant.
            </p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div className={`
                flex gap-3 max-w-[80%] rounded-2xl p-4
                ${message.role === "assistant" 
                  ? "bg-[var(--bluey-text)]/20 text-[var(--pale)]" 
                  : "bg-[var(--tealy)]/20 text-[var(--pale)]"
                }
              `}>
                <div className="mt-1">
                  {message.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-[var(--tealy-heading)]" />
                  ) : (
                    <User className="w-5 h-5 text-[var(--tealy)]" />
                  )}
                </div>
                <div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-[var(--bluey-text)]/20 rounded-2xl p-4 flex items-center gap-2 text-[var(--pale)]">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--tealy-heading)]" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          </motion.div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-[var(--space)]/30 p-4">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedEvents.length > 0 ? "Ask about your event data..." : "Select events above first..."}
            disabled={selectedEvents.length === 0 || isTyping}
            className="w-full bg-[var(--bluey-text)]/10 border border-[var(--space)]/30 rounded-lg py-3 pl-4 pr-12 text-[var(--pale)] min-h-[50px] max-h-[200px] focus:outline-none focus:border-[var(--tealy)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || selectedEvents.length === 0}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--tealy)] disabled:text-[var(--space-text)] disabled:cursor-not-allowed transition-colors p-1 rounded-lg hover:bg-[var(--tealy)]/10"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}