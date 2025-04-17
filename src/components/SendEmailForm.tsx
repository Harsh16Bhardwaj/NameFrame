import React, { useState, useEffect } from "react";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  participants?: any[];
}

const SendEmailForm: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [transcript, setTranscript] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        if (response.data.success) {
          setEvents(response.data.data);
        } else {
          console.error("Failed to fetch events:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setFetchingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Update participant count when event selection changes
  useEffect(() => {
    if (selectedEventId) {
      const selectedEvent = events.find(event => event.id === selectedEventId);
      setParticipantCount(
        selectedEvent?.participants?.filter(p => !p.emailed)?.length || 0
      );
    } else {
      setParticipantCount(0);
    }
  }, [selectedEventId, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/send-email", {
        subject,
        transcript,
        eventId: selectedEventId,
      });
      setResult(res.data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.error || "Failed to send emails.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Certificates to Participants</h2>
      
      <div>
        <label className="block mb-1 font-medium text-gray-800">Select Event</label>
        {fetchingEvents ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-5 h-5 border-t-2 border-teal-500 border-solid rounded-full animate-spin"></div>
            <span>Loading events...</span>
          </div>
        ) : (
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-800 bg-white"
            required
          >
            <option value="">-- Select an event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        )}
        
        {participantCount > 0 && (
          <p className="mt-1 text-sm text-green-600">
            {participantCount} participants will receive certificates
          </p>
        )}
        
        {participantCount === 0 && selectedEventId && (
          <p className="mt-1 text-sm text-amber-600">
            No participants pending emails for this event
          </p>
        )}
      </div>
      
      <div>
        <label className="block mb-1 font-medium text-gray-800">Email Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded px-3 py-2 text-gray-800 bg-white"
          required
          placeholder="Your Certificate for [Event Name]"
        />
      </div>
      
      <div>
        <label className="block mb-1 font-medium text-gray-800">Email Body Message</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="w-full border rounded px-3 py-2 text-gray-800 bg-white"
          rows={5}
          required
          placeholder="Dear participant,

Congratulations on completing our event! Please find your certificate attached.

Best regards,
The NameFrame Team"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !selectedEventId}
        className={`w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition ${
          loading || !selectedEventId ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Sending..." : "Send Certificates"}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {result.success ? (
            <p className="font-bold">{result.message || "Certificates sent successfully!"}</p>
          ) : (
            <p>{result.error}</p>
          )}
        </div>
      )}
    </form>
  );
};

export default SendEmailForm;