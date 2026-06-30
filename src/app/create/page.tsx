"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  MapPin,
  ScanText,
  UploadCloud,
  User,
  Users,
} from "lucide-react";
import ProtectedPage from "@/components/protectedPage";
import TemplateResourceCarousel from "@/components/TemplateResourceCarousel";

type EventForm = {
  title: string;
  description: string;
  organizationName: string;
  certificateTitle: string;
  location: string;
};

type Winner = {
  position: "FIRST" | "SECOND" | "THIRD";
  name: string;
  email: string;
};

type ImportedParticipantRow = {
  rowNumber: number;
  name: string;
  email: string;
  participated: boolean;
};

type ImportPreview = {
  validRows: ImportedParticipantRow[];
  invalidRows: Array<{ rowNumber: number; message: string }>;
  duplicateRows: Array<{ rowNumber: number; message: string }>;
  totalRows: number;
  summary: {
    totalRows: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  organizationName: "",
  certificateTitle: "",
  location: "",
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
  compact = true,
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
      className={`relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/70 p-4 text-zinc-200 transition hover:border-teal-400 ${
        compact ? "min-h-24" : "min-h-48"
      }`}
    >
      <input type="file" accept="image/png,image/jpeg" onChange={handleChange} className="sr-only" />
      {value ? (
        <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover opacity-45" />
      ) : null}
      {uploading ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/70 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-full border border-teal-500/30 bg-zinc-900 px-3 py-1 text-xs text-teal-300">
            <Loader2 className="size-3 animate-spin" />
            Uploading...
          </div>
        </div>
      ) : null}
      <div className="relative z-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]">
        {value ? <CheckCircle2 className="size-4 text-teal-300" /> : <UploadCloud className="size-4 text-zinc-300" />}
        {label}
      </div>
      <div className="relative z-10 mt-4 text-xs text-zinc-300">
        {value ? "Uploaded. Click to replace." : "Drop or choose PNG/JPG."}
      </div>
      {error ? <div className="relative z-10 mt-2 text-xs text-red-300">{error}</div> : null}
    </label>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<EventForm>(emptyForm);
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
  const [participantFile, setParticipantFile] = useState<File | null>(null);
  const [participantPreview, setParticipantPreview] = useState<ImportPreview | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
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
        organizationLogoUrl: organizationLogoUrl || undefined,
        templateUrl: defaultTemplateUrl,
        roleTemplateUrls,
        participantRows: (participantPreview?.validRows ?? []).map((row) => ({
          name: row.name,
          email: row.email,
          participated: row.participated,
        })),
      });

      const createdEventId = response.data.data.id as string;
      setEventId(createdEventId);

      const filledWinners = winners.filter((winner) => winner.name.trim() && winner.email.trim());
      if (filledWinners.length > 0) {
        await axios.post(`/api/events/${createdEventId}/awards`, { winners: filledWinners });
      }

      const importedCount = Number(response.data?.data?.importedParticipants ?? 0);
      setMessage(importedCount > 0 ? `Imported ${importedCount} participants.` : "Event created.");
      router.push(`/events/${createdEventId}`);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const previewParticipants = async () => {
    if (!participantFile) {
      setImportError("Select participant file first.");
      return;
    }

    setImportLoading(true);
    setImportError(null);
    const formData = new FormData();
    formData.append("file", participantFile);

    try {
      const response = await axios.post("/api/participants/import-preview", formData);
      setParticipantPreview(response.data.data);
    } catch (err) {
      setImportError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Preview failed");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-zinc-950 px-5 pb-20 pt-24 text-zinc-100">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200 transition hover:border-teal-400 hover:text-teal-300"
            >
              <ArrowLeft className="size-4" />
              Back to dashboard
            </button>
            <span className="pt-1 text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">Create event</span>
          </div>

          <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="pointer-events-none absolute -left-12 -top-10 h-44 w-44 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-12 -bottom-10 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                  {organizationLogoUrl ? (
                    <img src={organizationLogoUrl} alt="Organization logo" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="size-5 text-zinc-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{form.title.trim() || "Untitled Event"}</h1>
                  <p className="text-sm text-zinc-300">{form.organizationName.trim() || "Organization name"}</p>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs text-zinc-300">
                Live preview
              </div>
            </div>

            <div className="relative mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
              <div className="inline-flex items-center gap-2">
                <Users className="size-4 text-teal-300" />
                0 Participants
              </div>
              <div className="inline-flex items-center gap-2">
                <ScanText className="size-4 text-teal-300" />
                {form.certificateTitle.trim() || "Certificate title"}
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-teal-300" />
                {form.location.trim() || "Location not set"}
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    placeholder="Event title"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 pl-10 outline-none transition focus:border-teal-400"
                  />
                </div>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={form.organizationName}
                    onChange={(event) => updateForm("organizationName", event.target.value)}
                    placeholder="Organization name"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 pl-10 outline-none transition focus:border-teal-400"
                  />
                </div>
                <div className="relative">
                  <ScanText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={form.certificateTitle}
                    onChange={(event) => updateForm("certificateTitle", event.target.value)}
                    placeholder="Certificate title"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 pl-10 outline-none transition focus:border-teal-400"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                    placeholder="Event location"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 pl-10 outline-none transition focus:border-teal-400"
                  />
                </div>
              </div>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Event description"
                className="min-h-32 resize-none rounded-xl border border-zinc-700 bg-zinc-950/70 p-3 outline-none transition focus:border-teal-400"
              />
            </div>

            <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <UploadBox label="Organization logo" value={organizationLogoUrl} onUpload={setOrganizationLogoUrl} compact />
              
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
            <UploadBox label="Default certificate" value={defaultTemplateUrl} onUpload={setDefaultTemplateUrl} />
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <TemplateResourceCarousel />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-left"
            >
              <span className="font-semibold text-zinc-100">
                Advanced position certificates
              </span>
              <ChevronDown className={`size-4 text-zinc-400 transition ${advancedOpen ? "rotate-180" : ""}`} />
            </button>

            {advancedOpen ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                {(["FIRST", "SECOND", "THIRD"] as const).map((position) => {
                  const key = position.toLowerCase() as "first" | "second" | "third";
                  return (
                    <div key={position} className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-900/70 p-3">
                      <UploadBox
                        label={`${winnerLabels[position]} template`}
                        value={roleTemplateUrls[key]}
                        onUpload={(url) => setRoleTemplateUrls((current) => ({ ...current, [key]: url }))}
                        compact
                      />
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          value={winners.find((winner) => winner.position === position)?.name ?? ""}
                          onChange={(event) => updateWinner(position, "name", event.target.value)}
                          placeholder={`${winnerLabels[position]} name`}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 pl-10 outline-none focus:border-teal-400"
                        />
                      </div>
                      <div className="relative">
                        <FileText className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          value={winners.find((winner) => winner.position === position)?.email ?? ""}
                          onChange={(event) => updateWinner(position, "email", event.target.value)}
                          placeholder={`${winnerLabels[position]} email`}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-2.5 pl-10 outline-none focus:border-teal-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-zinc-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Participant import</h3>
                <p className="text-sm text-zinc-400">Upload CSV/Excel. Parse preview, then include rows in create payload.</p>
                <label className="group flex w-full max-w-sm cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm transition hover:border-teal-400">
                  <FileSpreadsheet className={`size-4 ${participantFile ? "text-teal-300" : "text-zinc-400"}`} />
                  <span className={`${participantFile ? "text-zinc-100" : "text-zinc-400"}`}>
                    {participantFile ? participantFile.name : "Choose participant file"}
                  </span>
                  {participantFile ? <CheckCircle2 className="ml-auto size-4 text-teal-300" /> : null}
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    disabled={importLoading || loading || Boolean(eventId)}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setParticipantFile(file);
                      setParticipantPreview(null);
                      setImportError(null);
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={previewParticipants}
                disabled={!participantFile || importLoading || loading || Boolean(eventId)}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-teal-300 disabled:opacity-50"
              >
                {importLoading ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
                {importLoading ? "Parsing..." : "Preview sheet"}
              </button>
            </div>

            {importError ? <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-sm text-rose-200">{importError}</div> : null}

            {participantPreview ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr]">
                <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm">
                  <div>Total: {participantPreview.summary.totalRows}</div>
                  <div>Valid: {participantPreview.summary.valid}</div>
                  <div>Invalid: {participantPreview.summary.invalid}</div>
                  <div>Duplicates: {participantPreview.summary.duplicates}</div>
                </div>
                <div className="max-h-72 overflow-auto rounded-lg border border-zinc-700 bg-zinc-950/40">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-zinc-900 text-zinc-300">
                      <tr>
                        <th className="p-2">Row</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Participated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantPreview.validRows.slice(0, 60).map((row) => (
                        <tr key={`${row.rowNumber}-${row.email}`} className="border-t border-zinc-800">
                          <td className="p-2">{row.rowNumber}</td>
                          <td className="p-2">{row.name}</td>
                          <td className="p-2">{row.email}</td>
                          <td className="p-2">{row.participated ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={createEvent}
              disabled={loading || Boolean(eventId)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 font-bold text-black transition hover:bg-teal-300 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Calendar className="size-5" />}
              {eventId ? "Event created" : "Create event"}
            </button>
            {error ? <span className="text-sm text-red-300">{error}</span> : null}
            {message ? <span className="text-sm text-emerald-300">{message}</span> : null}
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
