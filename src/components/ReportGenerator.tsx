"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ReportGeneratorProps {
  selectedEvents: string[];
  events: any[];
  mode: "insights" | "reports";
}

export default function ReportGenerator({ selectedEvents, events, mode }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const selectedEvent = events.find(event => selectedEvents.includes(event.id));
  
  const handleGenerateReport = async () => {
    if (mode === "reports" && selectedEvents.length !== 1) {
      setError("Please select exactly one event for report generation");
      return;
    }
    
    if (mode === "insights" && selectedEvents.length === 0) {
      setError("Please select at least one event for insights analysis");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    
    // Simulate report generation with timeout
    setTimeout(() => {
      try {
        if (mode === "reports") {
          setReport({
            title: `${selectedEvent?.title} - Comprehensive Analysis`,
            date: new Date().toLocaleDateString(),
            sections: [
              {
                title: "Executive Summary",
                content: `This report provides an in-depth analysis of ${selectedEvent?.title} held on ${new Date(selectedEvent?.date).toLocaleDateString()}. The event had ${selectedEvent?.participants} registered participants with an 87% attendance rate. Overall satisfaction rating was 4.3/5 based on post-event surveys.`
              },
              {
                title: "Attendance Analysis",
                content: "The event had an 87% attendance rate with 209 out of 240 registered participants attending. Peak attendance was observed during the keynote session (98%) while the lowest attendance was during the closing remarks (72%). Attendance patterns show that morning sessions had 15% higher attendance than afternoon sessions."
              },
              {
                title: "Participant Engagement",
                content: "Engagement metrics show that participants were most active during interactive workshops and panel discussions. The average session rating was 4.3/5, with the highest rated session being 'Future Tech Trends' (4.8/5) and the lowest being 'Technical Implementation' (3.7/5). Q&A participation was highest during industry expert panels."
              },
              {
                title: "Feedback Analysis",
                content: "Sentiment analysis of participant feedback shows 78% positive, 15% neutral, and 7% negative comments. Common praise points included speaker quality, networking opportunities, and venue facilities. Areas for improvement mentioned were session timing, technical issues with presentations, and catering options."
              },
              {
                title: "Recommendations",
                content: "Based on the analysis, we recommend: 1) Extending popular sessions in future events, 2) Adding more interactive elements to technical presentations, 3) Improving pre-event communication frequency, 4) Implementing a mobile app for real-time feedback, and 5) Increasing networking opportunities throughout the event schedule."
              }
            ]
          });
        } else {
          // For insights mode with multiple events
          const eventNames = selectedEvents.map(id => {
            const event = events.find(e => e.id === id);
            return event ? event.title : "";
          }).filter(Boolean);
          
          setReport({
            title: `Cross-Event Analysis: ${eventNames.length} Events`,
            date: new Date().toLocaleDateString(),
            sections: [
              {
                title: "Comparative Analysis",
                content: `This report compares key metrics across ${eventNames.length} events: ${eventNames.join(", ")}. Analysis reveals patterns in attendance, engagement, and participant satisfaction that can inform future event planning strategies.`
              },
              {
                title: "Attendance Patterns",
                content: `Average attendance rate across events was 85%, with the highest being ${eventNames[0]} (92%) and lowest being ${eventNames[eventNames.length-1]} (78%). Events held mid-week showed 12% higher attendance than those on Mondays or Fridays. Pre-event communication frequency directly correlated with attendance rates.`
              },
              {
                title: "Engagement Metrics",
                content: "Cross-event analysis shows that interactive sessions consistently outperformed lecture-style presentations by an average of 27% in engagement scores. Digital engagement (app usage, social media activity) was 3x higher in events that offered incentives for online participation."
              },
              {
                title: "Satisfaction Drivers",
                content: "Key factors influencing participant satisfaction across events were: 1) Speaker quality (correlation coefficient: 0.82), 2) Networking opportunities (0.76), 3) Content relevance (0.74), 4) Venue comfort (0.65), and 5) Technical execution (0.61)."
              },
              {
                title: "Strategic Recommendations",
                content: "Based on cross-event analysis, we recommend: 1) Standardizing the most successful interactive formats across all events, 2) Implementing consistent pre-event communication strategies that proved effective, 3) Focusing resources on the top three satisfaction drivers, and 4) Developing a unified measurement framework for comparing future event performance."
              }
            ]
          });
        }
        
        setIsGenerating(false);
      } catch (err) {
        setError("Failed to generate report. Please try again.");
        setIsGenerating(false);
      }
    }, 3000);
  };
  
  const handleDownload = () => {
    if (!report) return;
    
    // Create a text version of the report
    let reportText = `# ${report.title}\nGenerated: ${report.date}\n\n`;
    report.sections.forEach((section: any) => {
      reportText += `## ${section.title}\n${section.content}\n\n`;
    });
    
    // Create and download the file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex flex-col h-[600px]">
      {!report ? (
        <div className="h-full flex flex-col items-center justify-center p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--love)]/20 text-[var(--love-text)] p-4 rounded-lg mb-6 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
          
          {selectedEvents.length > 0 ? (
            <>
              <FileText className="w-16 h-16 text-[var(--tealy-heading)] mb-4" />
              <h3 className="text-2xl font-medium text-[var(--pale)] mb-2">
                Generate {mode === "reports" ? "Event Report" : "Cross-Event Analysis"}
              </h3>
              <p className="text-[var(--space-text)] text-center max-w-md mb-8">
                {mode === "reports"
                  ? `Create a comprehensive report for ${selectedEvent?.title} with insights and recommendations.`
                  : `Generate a cross-event analysis comparing data from ${selectedEvents.length} selected events.`
                }
              </p>
              
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)] hover:from-[var(--tealy-text)] hover:to-[var(--bluey-text)] text-white font-medium rounded-lg shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    {`Generate ${mode === "reports" ? "Report" : "Analysis"}`}
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <FileText className="w-16 h-16 text-[var(--space-text)] opacity-40 mb-4" />
              <h3 className="text-xl font-medium text-[var(--pale)] mb-2">
                Select Events First
              </h3>
              <p className="text-[var(--space-text)] text-center max-w-md">
                Please select {mode === "reports" ? "an event" : "one or more events"} above to generate {mode === "reports" ? "a report" : "an analysis"}.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Report Header */}
          <div className="bg-[var(--bluey-text)]/20 p-6 border-b border-[var(--space)]/30">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--pale)]">{report.title}</h2>
                <p className="text-[var(--space-text)] mt-1">Generated on {report.date}</p>
              </div>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[var(--tealy)]/20 hover:bg-[var(--tealy)]/30 text-[var(--tealy-heading)] rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">AI-generated analysis based on event data</span>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {report.sections.map((section: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-8"
              >
                <h3 className="text-xl font-medium text-[var(--tealy-heading)] mb-3">{section.title}</h3>
                <p className="text-[var(--pale)] leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}