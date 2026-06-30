"use client";

import { useState } from "react";
import axios from "axios";

type PreviewRow = {
  rowNumber: number;
  name: string;
  email: string;
  participated: boolean;
};

type ImportPreview = {
  validRows: PreviewRow[];
  invalidRows: Array<{ rowNumber: number; message: string }>;
  duplicateRows: Array<{ rowNumber: number; message: string }>;
  summary: {
    totalRows: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
};

interface ParticipantImportProps {
  eventId: string;
  onSuccess?: (data: unknown) => void;
}

const MAX_FILE_SIZE_MB = 50;
const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export default function ParticipantImport({ eventId, onSuccess }: ParticipantImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [loading, setLoading] = useState<"preview" | "confirm" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imported: number; total: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size should be under ${MAX_FILE_SIZE_MB}MB`);
      setFile(null);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError("Upload a CSV or Excel file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Select a file first");
      return;
    }

    setLoading("preview");
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`/api/events/${eventId}/import-participants/preview`, formData);
      setPreview(response.data.data);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Preview failed");
    } finally {
      setLoading(null);
    }
  };

  const handleConfirm = async () => {
    if (!preview?.validRows.length) {
      setError("No valid rows to import");
      return;
    }

    setLoading("confirm");
    setError(null);

    try {
      const response = await axios.post(`/api/events/${eventId}/import-participants/confirm`, {
        rows: preview.validRows,
      });
      setResult(response.data.data);
      onSuccess?.(response.data.data);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.error ?? err.message : "Import failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-5 text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Import participants</h3>
          <p className="text-sm text-slate-400">Columns: name, email, participated. Preview first, then approve DB upload.</p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={Boolean(loading)}
            className="block w-full max-w-sm rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!file || Boolean(loading)}
            className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading === "preview" ? "Parsing..." : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!preview?.validRows.length || Boolean(loading)}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading === "confirm" ? "Importing..." : "Approve import"}
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200">{error}</div>}

      {preview && (
        <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="rounded-lg bg-slate-900 p-4 text-sm">
            <div>Total: {preview.summary.totalRows}</div>
            <div>Valid: {preview.summary.valid}</div>
            <div>Invalid: {preview.summary.invalid}</div>
            <div>Duplicates: {preview.summary.duplicates}</div>
          </div>
          <div className="max-h-72 overflow-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-2">Row</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Participated</th>
                </tr>
              </thead>
              <tbody>
                {preview.validRows.slice(0, 60).map((row) => (
                  <tr key={`${row.rowNumber}-${row.email}`} className="border-t border-slate-800">
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
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/50 p-3 text-sm text-emerald-200">
          Imported {result.imported} of {result.total} approved rows.
        </div>
      )}
    </div>
  );
}
