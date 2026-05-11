"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EventHeader from "./components/EventHeader";
import ProtectedPage from "@/components/protectedPage";

const ParticipantsTable = dynamic(() => import("./components/ParticipantsTable"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-zinc-900" />,
});

const CertificateSection = dynamic(() => import("./components/CertificateSection"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-zinc-900" />,
});

const PreviewModal = dynamic(() => import("./components/PreviewModal"), { ssr: false });

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
  description?: string | null;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
  certificateTitle?: string | null;
  location?: string | null;
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
  roleTemplates?: {
    default?: { backgroundUrl?: string };
    first?: { backgroundUrl?: string };
    second?: { backgroundUrl?: string };
    third?: { backgroundUrl?: string };
  };
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
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50, width: 80, height: 15 });
  const [fontSettings, setFontSettings] = useState({ family: "Arial", size: 48, color: "#000000" });
  const [previewParticipant, setPreviewParticipant] = useState<Participant | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({});
  const [emailProgress, setEmailProgress] = useState({ sent: 0, total: 0 });
  const [dummyName, setDummyName] = useState("John Doe");
  const [personalizedMessage, setPersonalizedMessage] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`/api/events/${eventId}`);
        if (!response.data.success) {
          setError("Failed to load event data");
          return;
        }
        const eventData = response.data.data as EventDetails;
        setEvent(eventData);
        setTextPosition({
          x: eventData.textPositionX || 50,
          y: eventData.textPositionY || 50,
          width: eventData.textWidth || 80,
          height: eventData.textHeight || 15,
        });
        setFontSettings({
          family: eventData.fontFamily || "Arial",
          size: eventData.fontSize || 48,
          color: eventData.fontColor || "#000000",
        });
      } catch {
        setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEventData();
  }, [eventId]);

  const handlePositionChange = (property: string, value: number) => {
    setTextPosition((prev) => ({ ...prev, [property]: value }));
  };
  const handleFontChange = (property: string, value: string | number) => {
    setFontSettings((prev) => ({ ...prev, [property]: value }));
  };
  const handleTemplateChange = (newTemplateUrl: string) => {
    setEvent((prev) => (prev ? { ...prev, templateUrl: newTemplateUrl } : prev));
  };

  const savePositionChanges = async () => {
    if (!event) return;
    try {
      await axios.patch(`/api/events/${eventId}/template`, {
        textPositionX: textPosition.x,
        textPositionY: textPosition.y,
        textWidth: textPosition.width,
        textHeight: textPosition.height,
        fontFamily: fontSettings.family,
        fontSize: fontSettings.size,
        fontColor: fontSettings.color,
      });
    } catch {}
  };

  const sendCertificates = async () => {
    if (!event) return;
    const unsentParticipants = event.participants.filter((p) => !p.emailed);
    if (unsentParticipants.length === 0) return;
    const initialStatus: SendingStatus = {};
    unsentParticipants.forEach((p) => (initialStatus[p.id] = "pending"));
    setSendingStatus(initialStatus);
    setEmailProgress({ sent: 0, total: unsentParticipants.length });
    setIsSending(true);
    try {
      const defaultMessage = `Dear {name},\n\nCongratulations on completing the ${event.title}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`;
      const finalMessage = personalizedMessage.trim() ? personalizedMessage : defaultMessage;
      unsentParticipants.forEach((p) => (initialStatus[p.id] = "sending"));
      setSendingStatus({ ...initialStatus });
      const response = await axios.post(`/api/send-email/bulk`, {
        eventId,
        subject: `Your Certificate for ${event.title}`,
        transcript: finalMessage,
      });
      if (response.data.success) {
        const sent = response.data.summary?.sent ?? 0;
        const pending = response.data.summary?.pending ?? 0;
        setEmailProgress({ sent, total: sent + pending });
      }
    } finally {
      setIsSending(false);
      const refreshed = await axios.get(`/api/events/${eventId}`);
      if (refreshed.data.success) setEvent(refreshed.data.data);
    }
  };

  const sendSingleCertificate = async (participantId: string) => {
    if (!event) return;
    const participant = event.participants.find((p) => p.id === participantId);
    if (!participant || participant.emailed) return;
    setSendingStatus((prev) => ({ ...prev, [participantId]: "sending" }));
    try {
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
        setEvent((prev) =>
          prev
            ? { ...prev, participants: prev.participants.map((p) => (p.id === participantId ? { ...p, emailed: true } : p)) }
            : prev,
        );
      } else {
        setSendingStatus((prev) => ({ ...prev, [participantId]: "error" }));
      }
    } catch {
      setSendingStatus((prev) => ({ ...prev, [participantId]: "error" }));
    }
  };

  if (loading) return <LoadingState />;
  if (!eventId) return <LoadingState />;

  return (
    <ProtectedPage>
      <div className="min-h-screen overflow-y-auto bg-zinc-950 text-zinc-200">
        <div className="container mx-auto max-w-7xl px-4 py-8 pt-28">
          {error && <ErrorState error={error} />}
          {!error && event && (
            <>
              <EventHeader event={event} />

              <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="mb-2 text-sm font-semibold text-zinc-300">Normal Certificate Template</p>
                  <img
                    src={event.roleTemplates?.default?.backgroundUrl || event.templateUrl}
                    alt="Default template"
                    className="h-48 w-full rounded-md object-cover"
                  />
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="mb-2 text-sm font-semibold text-zinc-300">Positional Templates</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["first", "second", "third"] as const).map((key) => (
                      <div key={key} className="rounded-md bg-zinc-800 p-2">
                        <p className="mb-1 text-xs uppercase text-zinc-300">{key}</p>
                        {event.roleTemplates?.[key]?.backgroundUrl ? (
                          <img src={event.roleTemplates[key]?.backgroundUrl} alt={`${key} template`} className="h-20 w-full rounded object-cover" />
                        ) : (
                          <div className="flex h-20 items-center justify-center rounded bg-zinc-900 text-[10px] text-zinc-500">Not set</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-col items-center justify-center pt-2">
                <label htmlFor="dummyName" className="ml-2 block text-lg font-medium text-zinc-200">Preview Name:</label>
                <div id="certPreview" className="mt-2 w-full max-w-lg">
                  <input
                    type="text"
                    id="dummyName"
                    value={dummyName}
                    onChange={(e) => setDummyName(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 font-semibold text-gray-200 focus:border-teal-400 focus:text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="Enter a name for preview"
                  />
                </div>
                <p className="mb-4 mt-1 text-xs text-zinc-400">This name will be shown on the certificate preview.</p>
              </div>

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

              <div className="mb-8 mt-10 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <label className="mb-2 block text-lg font-medium text-zinc-200">Personalized Email Message</label>
                <textarea
                  value={personalizedMessage}
                  onChange={(e) => setPersonalizedMessage(e.target.value)}
                  className="h-32 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-gray-200 focus:border-teal-400 focus:text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder="Enter your personalized message here... (Leave empty for default message)&#10;&#10;You can use:&#10;{name} - participant name&#10;{event} - event title"
                />
                <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-zinc-400 md:grid-cols-3">
                  <p>Use <span className="text-teal-300">{"{name}"}</span> to insert participant name</p>
                  <p>Use <span className="text-teal-300">{"{event}"}</span> to insert event title</p>
                  <p>Leave empty to use default message</p>
                </div>

                {!personalizedMessage.trim() && (
                  <div className="mt-6 rounded border border-zinc-800 bg-zinc-950 p-3">
                    <p className="mb-1 text-xs text-zinc-400">Default message preview:</p>
                    <p className="whitespace-pre-wrap text-sm text-zinc-200">
                      {`Dear {name},\n\nCongratulations on completing the ${event?.title || "Event"}! Please find your certificate attached.\n\nBest regards,\nThe NameFrame Team`}
                    </p>
                  </div>
                )}

                {personalizedMessage.trim() && (
                  <div className="mt-6 rounded border border-zinc-800 bg-zinc-950 p-3">
                    <p className="mb-1 text-xs text-zinc-400">Custom message preview (for John Doe):</p>
                    <p className="whitespace-pre-wrap text-sm text-zinc-200">
                      {personalizedMessage.replace(/\{name\}/g, "John Doe").replace(/\{event\}/g, event?.title || "Event")}
                    </p>
                  </div>
                )}
              </div>

              <ParticipantsTable
                participants={event.participants}
                sendCertificates={sendCertificates}
                sendSingleCertificate={sendSingleCertificate}
                isSending={isSending}
                sendingStatus={sendingStatus}
                emailProgress={emailProgress}
                onShowPreview={(participant: Participant) => {
                  setPreviewParticipant(participant);
                  setShowPreview(true);
                }}
                personalizedMessage={personalizedMessage}
                eventId={eventId}
              />
            </>
          )}
        </div>

        {showPreview && previewParticipant && event && (
          <PreviewModal eventId={eventId} participant={previewParticipant} onClose={() => setShowPreview(false)} />
        )}
      </div>
    </ProtectedPage>
  );
}
