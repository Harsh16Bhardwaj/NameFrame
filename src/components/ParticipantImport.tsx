"use client";

import { useState } from "react";
import axios from "axios";
import { Signika_Negative } from "next/font/google";
import {
  Geist,
  Geist_Mono,
  Style_Script,
  Bangers,
  Titan_One,
  Signika,
  Raleway,
  Josefin_Sans,
} from "next/font/google";

interface ParticipantImportProps {
  eventId: string;
  onSuccess?: (data: any) => void;
}

const signika = Signika({
  variable: "--font-signika",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

  const handleUpload = async () => {
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
    <div className="px-6 py-2 pb-6 max-w-4xl mx-auto bg-gray-800 border-2 border-gray-400 rounded-lg shadow-lg">
      <h3 className={`text-2xl font-bold text-gray-300 mb-4 ${raleway}`}>Import Participants</h3>

      <div className="mb-6">
        <label htmlFor="participantFile" className="text-sm  font-medium text-gray-400 block mb-2">
          Upload CSV or Excel file
        </label>
        <input
          id="participantFile"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="w-1/4 px-3 border cursor-pointer ml-4 h-8 p-0.5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          disabled={loading}
        />
        {file && (
          <p className="text-sm text-gray-700 mt-2">
            📄 Selected file: <strong>{file.name}</strong>
          </p>
        )}
        <p className="text-xs text-gray-400 -mb-5 mt-4">
          Max 50MB. File must contain at least <code>name</code> and <code>email</code> columns.
        </p>
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-2 rounded-md c text-white font-semibold ${
          !file || loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-700 hover:bg-teal-800"
        } transition-all duration-200 ease-in-out`}
      >
        {loading ? "Uploading..." : "Import Participants"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-3 p-1 text-sm bg-gradient-to-b bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
          <p>✅ Successfully imported <strong>{result.imported}</strong> participants.</p>
          {result.invalidRows?.length > 0 && (
            <p className="mt-2">
              ⚠️ <strong>{result.invalidRows.length}</strong> rows were skipped due to missing or invalid data.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
