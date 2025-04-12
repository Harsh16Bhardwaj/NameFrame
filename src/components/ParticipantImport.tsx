"use client";

import { useState } from "react";
import axios from "axios";

interface ParticipantImportProps {
  eventId: string;
  onSuccess?: (data: any) => void;
}

const MAX_FILE_SIZE_MB = 50; // Maximum file size in MB
const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export default function ParticipantImport({ eventId, onSuccess }: ParticipantImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // File size check
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size should be under ${MAX_FILE_SIZE_MB}MB`);
      setFile(null);
      return;
    }

    // MIME type check
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload a CSV or Excel file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `/api/events/${eventId}/import-participants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.data);
      if (onSuccess) onSuccess(response.data.data);
    } catch (err: unknown) {
      console.error("Upload error:", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "An unexpected error occurred.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold text-lg mb-3">Import Participants</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="participantFile" className="block text-sm font-medium mb-1">
            Upload CSV or Excel file
          </label>
          <input
            id="participantFile"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          {file && (
            <p className="text-sm text-gray-700 mt-1">
              📄 Selected file: <strong>{file.name}</strong>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Max 5MB. File must contain at least <code>name</code> and <code>email</code> columns.
          </p>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className={`px-4 py-2 rounded bg-blue-600 text-white ${
            !file || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Import Participants"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          <p>✅ Successfully imported <strong>{result.imported}</strong> participants.</p>
          {result.invalidRows?.length > 0 && (
            <p className="mt-1">
              ⚠️ <strong>{result.invalidRows.length}</strong> rows were skipped due to missing or invalid data.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
