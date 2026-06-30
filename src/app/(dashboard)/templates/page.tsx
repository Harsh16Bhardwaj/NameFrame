"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, Image as ImageIcon, RefreshCw } from "lucide-react";
import Link from "next/link";
import ProtectedPage from "@/components/protectedPage";

interface Template {
  id: string;
  name: string;
  backgroundUrl: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/certificate-templates");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTemplates(
          data.data.map((template: Template) => ({
            id: template.id,
            name: template.name,
            backgroundUrl: template.backgroundUrl,
            createdAt: template.createdAt,
          }))
        );
      } else {
        setTemplates([]);
      }
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDownload = async (imageUrl: string, templateName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateName}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // no-op
    }
  };

  return (
    <ProtectedPage>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-zinc-950 p-6 pt-24 text-zinc-100"
      >
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white">Templates</h1>
              <p className="text-sm text-zinc-400">Download and reuse certificate backgrounds</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTemplates}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition hover:border-teal-400 hover:text-teal-300"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-teal-300"
              >
                <Calendar className="h-4 w-4" />
                New Event
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
              <RefreshCw className="h-6 w-6 animate-spin text-teal-300" />
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              No templates found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((template, idx) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    {template.backgroundUrl ? (
                      <img
                        src={template.backgroundUrl}
                        alt={template.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-zinc-500" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <h2 className="text-base font-semibold text-zinc-100">{template.name}</h2>
                    <p className="text-xs text-zinc-400">
                      Created {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(template.backgroundUrl, template.name)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 transition hover:border-teal-500/50 hover:text-teal-300"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </ProtectedPage>
  );
}
