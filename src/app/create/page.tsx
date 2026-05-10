"use client";

import { useState } from "react";
import axios from "axios";
import { Calendar, ChevronDown, ImagePlus, Loader2, MapPin, Trophy, UploadCloud } from "lucide-react";
import ParticipantImport from "@/components/ParticipantImport";
import ProtectedPage from "@/components/protectedPage";
import TemplateResourceCarousel from "@/components/TemplateResourceCarousel";

type EventForm = {
  title: string;
  description: string;
  organizationName: string;
  certificateTitle: string;
  location: string;
  emailContentText: string;
};

type Winner = {
  position: "FIRST" | "SECOND" | "THIRD";
  name: string;
  email: string;
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  organizationName: "",
  certificateTitle: "",
  location: "",
  emailContentText: "",
};

const winnerLabels: Record<Winner["position"], string> = {
  FIRST: "1st place",
  SECOND: "2nd place",
  THIRD: "3rd place",
};

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/api/upload", formData);
  return response.data.url as string;
}

function UploadBox({
  label,
  value,
  onUpload,
  compact = false,
}: {
  label: string;
  value?: string;
  onUpload: (url: string) => void;
  compact?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file);
      onUpload(url);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label
      className={`relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-slate-600 bg-slate-950/70 p-4 text-slate-200 transition hover:border-cyan-400 ${
        compact ? "min-h-32" : "min-h-72"
      }`}
    >
      <input type="file" accept="image/png,image/jpeg" onChange={handleChange} className="sr-only" />
      {value ? (
        <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover opacity-70" />
      ) : null}
      <div className="relative z-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]">
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
        {label}
      </div>
      <div className="relative z-10 mt-8 text-sm text-slate-300">
        {value ? "Uploaded. Click to replace." : "Drop or choose PNG/JPG."}
      </div>
      {error ? <div className="relative z-10 mt-2 text-xs text-red-300">{error}</div> : null}
    </label>
  );
}

export default function CreateEventPage() {
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [defaultTemplateUrl, setDefaultTemplateUrl] = useState("");
  const [roleTemplateUrls, setRoleTemplateUrls] = useState({ first: "", second: "", third: "" });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [winners, setWinners] = useState<Winner[]>([
    { position: "FIRST", name: "", email: "" },
    { position: "SECOND", name: "", email: "" },
    { position: "THIRD", name: "", email: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateForm = (key: keyof EventForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateWinner = (position: Winner["position"], key: "name" | "email", value: string) => {
    setWinners((current) =>
      current.map((winner) => (winner.position === position ? { ...winner, [key]: value } : winner))
    );
  };

  const createEvent = async () => {
    if (!form.title.trim() || !defaultTemplateUrl) {
      setError("Event title and default certificate template are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("/api/events", {
        ...form,
        imageUrl: eventImageUrl || undefined,
        organizationLogoUrl: organizationLogoUrl || undefined,
        templateUrl: defaultTemplateUrl,
        roleTemplateUrls,
      });

      const createdEventId = response.data.data.id as string;
      setEventId(createdEventId);

      const filledWinners = winners.filter((winner) => winner.name.trim() && winner.email.trim());
      if (filledWinners.length > 0) {
        await axios.post(`/api/events/${createdEventId}/awards`, { winners: filledWinners });
      }

      setMessage("Event created. Preview participants before importing.");
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-[#101314] px-5 py-28 text-slate-100">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Create event</span>
            <h1 className="text-4xl font-black tracking-tight">Build certificate session</h1>
          </div>

          <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-5 md:grid-cols-[1fr_280px]">
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Event description"
                className="min-h-80 resize-none rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-lg outline-none focus:border-cyan-400"
              />
              <div className="grid gap-4">
                <input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Event title"
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 outline-none focus:border-cyan-400"
                />
                <input
                  value={form.organizationName}
                  onChange={(event) => updateForm("organizationName", event.target.value)}
                  placeholder="Organization name"
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 outline-none focus:border-cyan-400"
                />
                <input
                  value={form.certificateTitle}
                  onChange={(event) => updateForm("certificateTitle", event.target.value)}
                  placeholder="Certificate title"
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 outline-none focus:border-cyan-400"
                />
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                    placeholder="Event location"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 pl-11 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <UploadBox label="Event image" value={eventImageUrl} onUpload={setEventImageUrl} compact />
              <UploadBox label="Organization logo" value={organizationLogoUrl} onUpload={setOrganizationLogoUrl} compact />
              <textarea
                value={form.emailContentText}
                onChange={(event) => updateForm("emailContentText", event.target.value)}
                placeholder="Email content for this event"
                className="min-h-40 resize-none rounded-2xl border border-slate-800 bg-slate-950/70 p-4 outline-none focus:border-cyan-400"
              />
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <UploadBox label="Default certificate" value={defaultTemplateUrl} onUpload={setDefaultTemplateUrl} />
            <TemplateResourceCarousel />
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Trophy className="size-5 text-yellow-300" />
                Advanced position certificates
              </span>
              <ChevronDown className={`size-5 transition ${advancedOpen ? "rotate-180" : ""}`} />
            </button>

            {advancedOpen ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                {(["FIRST", "SECOND", "THIRD"] as const).map((position) => {
                  const key = position.toLowerCase() as "first" | "second" | "third";
                  return (
                    <div key={position} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                      <UploadBox
                        label={`${winnerLabels[position]} template`}
                        value={roleTemplateUrls[key]}
                        onUpload={(url) => setRoleTemplateUrls((current) => ({ ...current, [key]: url }))}
                        compact
                      />
                      <input
                        value={winners.find((winner) => winner.position === position)?.name ?? ""}
                        onChange={(event) => updateWinner(position, "name", event.target.value)}
                        placeholder={`${winnerLabels[position]} name`}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
                      />
                      <input
                        value={winners.find((winner) => winner.position === position)?.email ?? ""}
                        onChange={(event) => updateWinner(position, "email", event.target.value)}
                        placeholder={`${winnerLabels[position]} email`}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={createEvent}
              disabled={loading || Boolean(eventId)}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Calendar className="size-5" />}
              {eventId ? "Event created" : "Create event"}
            </button>
            {error ? <span className="text-sm text-red-300">{error}</span> : null}
            {message ? <span className="text-sm text-emerald-300">{message}</span> : null}
          </div>

          {eventId ? (
            <ParticipantImport
              eventId={eventId}
              onSuccess={() => {
                setMessage("Participants imported. Event is ready for certificate setup.");
              }}
            />
          ) : null}
        </div>
      </main>
    </ProtectedPage>
  );
}
