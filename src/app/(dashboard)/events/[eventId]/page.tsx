"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EventHeader from "./components/EventHeader";
import ProtectedPage from "@/components/protectedPage";

// Dynamic imports for code splitting
const ParticipantsTable = dynamic(
  () => import("./components/ParticipantsTable"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse bg-[#322f42]/50 rounded-2xl"></div>
    ),
  }
);

const CertificateSection = dynamic(
  () => import("./components/CertificateSection"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse bg-[#322f42]/30 rounded-2xl"></div>
    ),
  }
);

const PreviewModal = dynamic(() => import("./components/PreviewModal"), {
  ssr: false,
});

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
  [participantId: string]: "pending" | "sending" | "success" | "error";
}

export default function EventDashboard() {
  const params = useParams();
  const eventId = params?.eventId as string;
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
    color: "#000000",
  });

  const [previewParticipant, setPreviewParticipant] =
    useState<Participant | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // New state to track individual email sending status
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({});
  const [emailProgress, setEmailProgress] = useState({ sent: 0, total: 0 });
  const [dummyName, setDummyName] = useState("John Doe");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add personalized message state
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Fetching event data for eventId:", eventId);
        const response = await axios.get(`/api/events/${eventId}`);
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          const eventData = response.data.data;
          setEvent(eventData);

          // Set position data from the database
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
            color: eventData.fontColor || "#000000",
          });          setLoading(false);
        } else {
          console.error("API returned success: false");
          setError("Failed to load event data");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data");
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

  // Add a new handler for template URL changes
  const handleTemplateChange = (newTemplateUrl: string) => {
    if (!event) return;

    setEvent((prevEvent) => {
      if (!prevEvent) return null;
      return {
        ...prevEvent,
        templateUrl: newTemplateUrl,
      };
    });
  };

  // Save position and font changes
  const savePositionChanges = async () => {
    if (!event) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await axios.patch(`/api/events/${eventId}/template`, {
        textPositionX: textPosition.x,
        textPositionY: textPosition.y,
        textWidth: textPosition.width,
        textHeight: textPosition.height,
        fontFamily: fontSettings.family,
        fontSize: fontSettings.size,
        fontColor: fontSettings.color,
      });

      if (response.data.success) {
        // Show success message
        setSaveSuccess(true);

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
            fontColor: fontSettings.color,
          };
        });

        // Hide success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving position changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Send certificates to unsent participants with real-time status updates
  const sendCertificates = async () => {
    if (!event) return;

    // Find unsent participants
    const unsentParticipants = event.participants.filter((p) => !p.emailed);
    if (unsentParticipants.length === 0) return;

    // Initialize sending status for all unsent participants
    const initialStatus: SendingStatus = {};
    unsentParticipants.forEach((p) => {
      initialStatus[p.id] = "pending";
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
        setSendingStatus((prev) => {
          const updated = { ...prev };
          group.forEach((p) => {
            updated[p.id] = "sending";
          });
          return updated;
        });

        // Process this batch
        await Promise.all(
          group.map(async (participant) => {
            try {              // Make individual API call for real-time updates
              const defaultMessage = `Dear ${participant.name},\n\nCongratulations on completing the ${event.title}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`;
              const finalMessage = personalizedMessage.trim() 
                ? personalizedMessage.replace(/\{name\}/g, participant.name).replace(/\{event\}/g, event.title)
                : defaultMessage;
              
              const response = await axios.post(`/api/send-email/single`, {
                participantId: participant.id,
                eventId: eventId,
                subject: `Your Certificate for ${event.title}`,
                transcript: finalMessage,
                fontFamily: fontSettings.family,
                fontSize: fontSettings.size,
                fontColor: fontSettings.color,
              });

              // Update status based on response
              if (response.data.success) {
                setSendingStatus((prev) => ({
                  ...prev,
                  [participant.id]: "success",
                }));
                setEmailProgress((prev) => ({ ...prev, sent: prev.sent + 1 }));

                // Update the participant in the event state
                setEvent((prevEvent) => {
                  if (!prevEvent) return null;
                  return {
                    ...prevEvent,
                    participants: prevEvent.participants.map((p) =>
                      p.id === participant.id ? { ...p, emailed: true } : p
                    ),
                  };
                });
              } else {
                setSendingStatus((prev) => ({
                  ...prev,
                  [participant.id]: "error",
                }));
              }
            } catch (error) {
              console.error(
                `Error sending certificate to ${participant.email}:`,
                error
              );
              setSendingStatus((prev) => ({
                ...prev,
                [participant.id]: "error",
              }));
            }
          })
        );

        // Small delay between batches to prevent overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 300));
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
    const participant = event.participants.find((p) => p.id === participantId);
    if (!participant || participant.emailed) return;

    // Update status
    setSendingStatus((prev) => ({ ...prev, [participantId]: "sending" }));    try {
      const defaultMessage = `Dear ${participant.name},\n\nCongratulations on completing the ${event.title}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`;
      const finalMessage = personalizedMessage.trim() 
        ? personalizedMessage.replace(/\{name\}/g, participant.name).replace(/\{event\}/g, event.title)
        : defaultMessage;
        
      const response = await axios.post(`/api/send-email/single`, {
        participantId,
        eventId,
        subject: `Your Certificate for ${event.title}`,
        transcript: finalMessage,
        fontFamily: fontSettings.family,
        fontSize: fontSettings.size,
        fontColor: fontSettings.color,
      });

      if (response.data.success) {
        setSendingStatus((prev) => ({ ...prev, [participantId]: "success" }));

        // Update the participant in the event state
        setEvent((prevEvent) => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            participants: prevEvent.participants.map((p) =>
              p.id === participantId ? { ...p, emailed: true } : p
            ),
          };
        });
      } else {
        setSendingStatus((prev) => ({ ...prev, [participantId]: "error" }));
      }
    } catch (error) {
      console.error(`Error sending certificate:`, error);
      setSendingStatus((prev) => ({ ...prev, [participantId]: "error" }));
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

  // // Render error state
  // if (error || !event) {
  //   return <ErrorState error={error} />;
  // }
  // Early return if no eventId (prevents issues during SSR/hydration)
  if (!eventId) {
    return <LoadingState />;
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gradient-to-br from-[#080711] to-[#0e1015] text-[#c5c3c4] overflow-y-auto">
        <div className="container mx-auto max-w-7xl px-4 py-8 pt-28">
          
          {loading && <LoadingState />}
          {error && <ErrorState error={error} />}
          
          {!loading && !error && event && (
            <>
              {/* Top Section: Event Overview */}
              <EventHeader event={event} />

              {/* Dummy Name Input */}
              <div className="mb-4 flex flex-col justify-center items-center pt-5">
                <label
                  htmlFor="dummyName"
                  className="block text-lg ml-2 font-medium text-[#c5c3c4]"
                >
                  Preview Name :
                </label>
                <div id="certPreview" className="mt-2 w-1/3">
                  <input
                    type="text"
                    id="dummyName"
                    value={dummyName}
                    onChange={(e) => setDummyName(e.target.value)}
                    className="w-full rounded-md border border-[#4b3a70]/30 font-semibold  bg-[#272936] px-4 py-2 text-gray-200 focus:text-white focus:border-[#b7a2c9] focus:outline-none focus:ring-1 focus:ring-[#b7a2c9]"
                    placeholder="Enter a name for preview"
                  />
                </div>
                <p className="mt-1 text-xs text-[#c5c3c4]/70 mb-4">
                  This name will be shown on the certificate preview.
                </p>
              </div>              {/* Bottom Section: Certificate Preview & Customization */}
          <CertificateSection
            templateUrl={event.templateUrl}
            textPosition={textPosition}
            fontSettings={fontSettings}
            dummyName={dummyName}
            onPositionChange={handlePositionChange}
            onFontChange={handleFontChange}
            onSavePositions={savePositionChanges}
            onTemplateChange={handleTemplateChange}
          />

          {/* Save Button */}
          <div className="m-4 mb-10 flex justify-end">
            <button
              onClick={savePositionChanges}
              disabled={isSaving}
              className={`rounded-md bg-[#4b3a70] px-4 py-2 text-white transition-all hover:bg-[#5d4b82] ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save Position Settings"}
            </button>

            {saveSuccess && (
              <span className="ml-3 text-green-400 text-sm">
                Settings saved successfully!
              </span>
            )}          </div>
            {/* Personalized Email Message Section */}
          <div className="mb-8 p-6 bg-[#272936] rounded-lg border border-[#4b3a70]/30">
            <label className="block text-lg font-medium text-[#c5c3c4] mb-2">
              Personalized Email Message
            </label>
            <textarea
              value={personalizedMessage}
              onChange={(e) => setPersonalizedMessage(e.target.value)}
              className="w-full h-32 rounded-md border border-[#4b3a70]/30 bg-[#1a1b23] px-4 py-3 text-gray-200 focus:text-white focus:border-[#b7a2c9] focus:outline-none focus:ring-1 focus:ring-[#b7a2c9] resize-none"
              placeholder="Enter your personalized message here... (Leave empty for default message)&#10;&#10;You can use:&#10;{name} - Will be replaced with participant's name&#10;{event} - Will be replaced with event title"
            />
            <div className="mt-2 text-xs text-[#c5c3c4]/70">
              <p className="mb-1">• Use <span className="text-[#b7a2c9]">{"{name}"}</span> to insert participant's name</p>
              <p className="mb-1">• Use <span className="text-[#b7a2c9]">{"{event}"}</span> to insert event title</p>
              <p>• Leave empty to use the default message</p>
            </div>
            
            {/* Default Message Preview */}
            {!personalizedMessage.trim() && (
              <div className="mt-3 p-3 bg-[#1a1b23] rounded border border-[#4b3a70]/20">
                <p className="text-xs text-[#c5c3c4]/70 mb-1">Default message preview:</p>
                <p className="text-sm text-[#c5c3c4] whitespace-pre-wrap">
                  {`Dear {name},\n\nCongratulations on completing the ${event?.title || 'Event'}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`}
                </p>
              </div>
            )}
            
            {/* Custom Message Preview */}
            {personalizedMessage.trim() && (
              <div className="mt-3 p-3 bg-[#1a1b23] rounded border border-[#4b3a70]/20">
                <p className="text-xs text-[#c5c3c4]/70 mb-1">Custom message preview (for John Doe):</p>
                <p className="text-sm text-[#c5c3c4] whitespace-pre-wrap">
                  {personalizedMessage.replace(/\{name\}/g, 'John Doe').replace(/\{event\}/g, event?.title || 'Event')}
                </p>
              </div>
            )}
          </div>              <ParticipantsTable
                participants={event.participants}
                sendCertificates={sendCertificates}
                sendSingleCertificate={sendSingleCertificate}
                isSending={isSending}
                sendingStatus={sendingStatus}
                emailProgress={emailProgress}
                onShowPreview={handleShowPreview}
                personalizedMessage={personalizedMessage}
                eventId={eventId as string}
              />
            </>
          )}
        </div>

        {/* Certificate Preview Modal */}
        {showPreview && previewParticipant && event && (
          <PreviewModal
            participant={previewParticipant}
            templateUrl={event.templateUrl}
            textPosition={textPosition}
            fontSettings={fontSettings}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </ProtectedPage>
  );
}
