"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EventHeader from "./components/EventHeader";

// Dynamic imports for code splitting
const ParticipantsTable = dynamic(() => 
  import("./components/ParticipantsTable"), { 
    ssr: false, 
    loading: () => <div className="h-64 animate-pulse bg-[#322f42]/50 rounded-2xl"></div> 
  }
);

const CertificateSection = dynamic(() => 
  import("./components/CertificateSection"), { 
    ssr: false, 
    loading: () => <div className="h-64 animate-pulse bg-[#322f42]/50 rounded-2xl"></div> 
  }
);

const PreviewModal = dynamic(() => 
  import("./components/PreviewModal"), { ssr: false }
);

interface Participant {
  id: string;
  name: string;
  email: string;
  emailed: boolean;
  certificateUrl?: string;
}

interface EventDetails {
  id: string;
  title: string;
  createdAt: string;
  templateUrl: string;
  textPositionX: number;
  textPositionY: number;
  textWidth: number;
  textHeight: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  participants: Participant[];
}

interface SendingStatus {
  [participantId: string]: 'pending' | 'sending' | 'success' | 'error';
}

export default function EventDashboard() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Position and font settings
  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 15,
  });
  
  const [fontSettings, setFontSettings] = useState({
    family: "Arial",
    size: 48,
    color: "#000000"
  });
  
  const [previewParticipant, setPreviewParticipant] = useState<Participant | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // New state to track individual email sending status
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({});
  const [emailProgress, setEmailProgress] = useState({ sent: 0, total: 0 });

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${eventId}`);
        if (response.data.success) {
          const eventData = response.data.data;
          setEvent(eventData);
          
          // Set position data
          setTextPosition({
            x: eventData.textPositionX || 50,
            y: eventData.textPositionY || 50,
            width: eventData.textWidth || 80,
            height: eventData.textHeight || 15,
          });
          
          // Set font settings
          setFontSettings({
            family: eventData.fontFamily || "Arial",
            size: eventData.fontSize || 48,
            color: eventData.fontColor || "#000000"
          });
        } else {
          setError("Failed to load event data");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("An error occurred while loading the event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Handle position change
  const handlePositionChange = (property: string, value: number) => {
    setTextPosition((prev) => ({
      ...prev,
      [property]: value,
    }));
  };
  
  // Handle font settings change
  const handleFontChange = (property: string, value: string | number) => {
    setFontSettings((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  // Save position and font changes
  const savePositionChanges = async () => {
    if (!event) return;

    try {
      const response = await axios.patch(`/api/events/${eventId}/template`, {
        textPositionX: textPosition.x,
        textPositionY: textPosition.y,
        textWidth: textPosition.width,
        textHeight: textPosition.height,
        fontFamily: fontSettings.family,
        fontSize: fontSettings.size,
        fontColor: fontSettings.color
      });

      if (response.data.success) {
        // Update the event with new positions
        setEvent((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            textPositionX: textPosition.x,
            textPositionY: textPosition.y,
            textWidth: textPosition.width,
            textHeight: textPosition.height,
            fontFamily: fontSettings.family,
            fontSize: fontSettings.size,
            fontColor: fontSettings.color
          };
        });
      }
    } catch (error) {
      console.error("Error saving position changes:", error);
    }
  };

  // Send certificates to unsent participants with real-time status updates
  const sendCertificates = async () => {
    if (!event) return;

    // Find unsent participants
    const unsentParticipants = event.participants.filter(p => !p.emailed);
    if (unsentParticipants.length === 0) return;
    
    // Initialize sending status for all unsent participants
    const initialStatus: SendingStatus = {};
    unsentParticipants.forEach(p => {
      initialStatus[p.id] = 'pending';
    });
    
    setSendingStatus(initialStatus);
    setEmailProgress({ sent: 0, total: unsentParticipants.length });
    setIsSending(true);

    // Process participants in small batches for smoother UI updates
    const batchSize = 3;
    const participantGroups = [];
    
    for (let i = 0; i < unsentParticipants.length; i += batchSize) {
      participantGroups.push(unsentParticipants.slice(i, i + batchSize));
    }

    try {
      for (const group of participantGroups) {
        // Mark current batch as "sending"
        setSendingStatus(prev => {
          const updated = {...prev};
          group.forEach(p => { updated[p.id] = 'sending'; });
          return updated;
        });
        
        // Process this batch
        await Promise.all(group.map(async (participant) => {
          try {
            // Make individual API call for real-time updates
            const response = await axios.post(`/api/send-email/single`, {
              participantId: participant.id,
              eventId: eventId,
              subject: `Your Certificate for ${event.title}`,
              transcript: `Dear ${participant.name},\n\nCongratulations on completing the ${event.title}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`,
              fontFamily: fontSettings.family,
              fontSize: fontSettings.size,
              fontColor: fontSettings.color
            });

            // Update status based on response
            if (response.data.success) {
              setSendingStatus(prev => ({...prev, [participant.id]: 'success'}));
              setEmailProgress(prev => ({...prev, sent: prev.sent + 1}));
              
              // Update the participant in the event state
              setEvent(prevEvent => {
                if (!prevEvent) return null;
                return {
                  ...prevEvent,
                  participants: prevEvent.participants.map(p => 
                    p.id === participant.id ? {...p, emailed: true} : p
                  )
                };
              });
            } else {
              setSendingStatus(prev => ({...prev, [participant.id]: 'error'}));
            }
          } catch (error) {
            console.error(`Error sending certificate to ${participant.email}:`, error);
            setSendingStatus(prev => ({...prev, [participant.id]: 'error'}));
          }
        }));
        
        // Small delay between batches to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("Error in certificate sending process:", error);
    } finally {
      setIsSending(false);
      
      // Refresh event data to ensure UI is in sync with backend
      try {
        const updatedEvent = await axios.get(`/api/events/${eventId}`);
        if (updatedEvent.data.success) {
          setEvent(updatedEvent.data.data);
        }
      } catch (error) {
        console.error("Error refreshing event data:", error);
      }
    }
  };

  // Individual certificate sending function
  const sendSingleCertificate = async (participantId: string) => {
    if (!event) return;
    
    // Find participant
    const participant = event.participants.find(p => p.id === participantId);
    if (!participant || participant.emailed) return;
    
    // Update status
    setSendingStatus(prev => ({...prev, [participantId]: 'sending'}));
    
    try {
      const response = await axios.post(`/api/send-email/single`, {
        participantId,
        eventId,
        subject: `Your Certificate for ${event.title}`,
        transcript: `Dear ${participant.name},\n\nCongratulations on completing the ${event.title}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`,
        fontFamily: fontSettings.family,
        fontSize: fontSettings.size,
        fontColor: fontSettings.color
      });
      
      if (response.data.success) {
        setSendingStatus(prev => ({...prev, [participantId]: 'success'}));
        
        // Update the participant in the event state
        setEvent(prevEvent => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            participants: prevEvent.participants.map(p => 
              p.id === participantId ? {...p, emailed: true} : p
            )
          };
        });
      } else {
        setSendingStatus(prev => ({...prev, [participantId]: 'error'}));
      }
    } catch (error) {
      console.error(`Error sending certificate:`, error);
      setSendingStatus(prev => ({...prev, [participantId]: 'error'}));
    }
  };

  // Show certificate preview for a specific participant
  const handleShowPreview = (participant: Participant) => {
    setPreviewParticipant(participant);
    setShowPreview(true);
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error || !event) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#212531] text-[#c5c3c4]">
      <div className="container mx-auto max-w-7xl px-4 py-8 pt-28">
        {/* Top Section: Event Overview */}
        <EventHeader event={event} />

        {/* Middle Section: Participants Table */}
        <ParticipantsTable
          participants={event.participants}
          sendCertificates={sendCertificates}
          sendSingleCertificate={sendSingleCertificate}
          isSending={isSending}
          sendingStatus={sendingStatus}
          emailProgress={emailProgress}
          onShowPreview={handleShowPreview}
        />

        {/* Bottom Section: Certificate Preview & Customization */}
        <CertificateSection
          templateUrl={event.templateUrl}
          textPosition={textPosition}
          fontSettings={fontSettings}
          onPositionChange={handlePositionChange}
          onFontChange={handleFontChange}
          onSavePositions={savePositionChanges}
        />
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && previewParticipant && (
        <PreviewModal
          participant={previewParticipant}
          templateUrl={event.templateUrl}
          textPosition={textPosition}
          fontSettings={fontSettings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
