"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Clock } from "lucide-react";
import ChatArea from "./ChatArea";
import ReportGenerator from "./ReportGenerator";
import InsightsSwitcher from "./InsightsSwitcher";
import EventSelector from "./EventSelector";

interface DashboardProps {
  mode: "insights" | "reports";
  selectedEvents: string[];
  onEventsSelect: (events: string[]) => void;
}

export default function Dashboard({ mode, selectedEvents, onEventsSelect }: DashboardProps) {
  const [currentTab, setCurrentTab] = useState<"chat" | "reports">("chat");
  const [conversations, setConversations] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's events
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Placeholder for API call
        // const response = await fetch('/api/events');
        // const data = await response.json();
        
        // Placeholder data until we have the API
        const dummyEvents = [
          { id: "1", title: "Annual Conference 2025", date: "2025-05-15", participants: 240 },
          { id: "2", title: "Tech Workshop Series", date: "2025-03-22", participants: 85 },
          { id: "3", title: "Leadership Summit", date: "2025-06-10", participants: 120 },
          { id: "4", title: "Product Launch", date: "2025-04-05", participants: 350 },
          { id: "5", title: "Team Building Retreat", date: "2025-07-18", participants: 45 }
        ];
        
        setEvents(dummyEvents);

        // Placeholder for conversations/reports
        setConversations([
          {
            id: "c1",
            timestamp: new Date('2025-06-23T14:30:00'),
            messages: [
              { role: "user", content: "What was the attendance rate across my events?" },
              { role: "assistant", content: "Based on your events data, the average attendance rate was 87%, with the highest being the Annual Conference at 92% and the lowest being the Tech Workshop Series at 78%." }
            ]
          },
          {
            id: "c2",
            timestamp: new Date('2025-06-20T10:15:00'),
            messages: [
              { role: "user", content: "Which event had the most engaged participants?" },
              { role: "assistant", content: "The Leadership Summit had the most engaged participants with an average session rating of 4.8/5 and 95% of participants staying for the full duration." }
            ]
          }
        ]);

        setReports([
          {
            id: "r1",
            eventId: "1",
            title: "Annual Conference 2025 - Comprehensive Analysis",
            timestamp: new Date('2025-06-22'),
            summary: "This report provides a detailed analysis of the Annual Conference 2025, covering attendance, engagement metrics, and feedback analysis."
          },
          {
            id: "r2",
            eventId: "4",
            title: "Product Launch Report - Key Insights",
            timestamp: new Date('2025-06-15'),
            summary: "A complete breakdown of the Product Launch event, including audience demographics, participation metrics, and follow-up recommendations."
          }
        ]);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--dashboard-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-[var(--pale)]">
              {mode === "insights" ? "AI Event Insights" : "Event Report Generation"}
            </h1>
            
            <InsightsSwitcher 
              activeTab={currentTab} 
              onTabChange={setCurrentTab} 
            />
          </div>

          {/* Event Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--onyx)] rounded-xl p-6 border border-[var(--space)]/30 shadow-lg"
          >
            <EventSelector 
              events={events}
              selectedEvents={selectedEvents}
              onEventsSelect={onEventsSelect}
              mode={mode}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--onyx)] rounded-xl border border-[var(--space)]/30 overflow-hidden shadow-lg"
          >
            {currentTab === "chat" ? (
              <ChatArea 
                selectedEvents={selectedEvents} 
                events={events}
              />
            ) : (
              <ReportGenerator 
                selectedEvents={selectedEvents}
                events={events}
                mode={mode}
              />
            )}
          </motion.div>
          
          {/* History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversation History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--onyx)] rounded-xl p-6 border border-[var(--space)]/30 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="text-[var(--tealy-heading)] w-5 h-5" />
                <h3 className="text-xl font-semibold text-[var(--pale)]">Recent Conversations</h3>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-[var(--space-text)]">
                    <p>No conversation history yet</p>
                    <p className="text-sm mt-1">Start a new chat to see history here</p>
                  </div>
                ) : (
                  conversations.map(convo => (
                    <div 
                      key={convo.id}
                      className="p-4 rounded-lg bg-[var(--bluey-text)]/10 hover:bg-[var(--bluey-text)]/20 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-[var(--tealy-heading)] truncate max-w-[70%]">
                          {convo.messages[0].content.length > 50 
                            ? convo.messages[0].content.substring(0, 50) + '...'
                            : convo.messages[0].content
                          }
                        </p>
                        <div className="flex items-center text-xs text-[var(--space-text)]">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(convo.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--space-text)] truncate">
                        {convo.messages[1].content.length > 60
                          ? convo.messages[1].content.substring(0, 60) + '...'
                          : convo.messages[1].content
                        }
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
            
            {/* Reports History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--onyx)] rounded-xl p-6 border border-[var(--space)]/30 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-[var(--tealy-heading)] w-5 h-5" />
                <h3 className="text-xl font-semibold text-[var(--pale)]">Generated Reports</h3>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-[var(--space-text)]">
                    <p>No reports generated yet</p>
                    <p className="text-sm mt-1">Generate a report to see it here</p>
                  </div>
                ) : (
                  reports.map(report => {
                    const relatedEvent = events.find(e => e.id === report.eventId);
                    
                    return (
                      <div 
                        key={report.id}
                        className="p-4 rounded-lg bg-[var(--space)]/10 hover:bg-[var(--space)]/20 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-[var(--pale)] truncate max-w-[70%]">
                            {report.title}
                          </p>
                          <div className="flex items-center text-xs text-[var(--space-text)]">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(report.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        {relatedEvent && (
                          <p className="text-xs text-[var(--tealy-heading)] mb-1">
                            {relatedEvent.title}
                          </p>
                        )}
                        <p className="text-sm text-[var(--space-text)] truncate">
                          {report.summary}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}