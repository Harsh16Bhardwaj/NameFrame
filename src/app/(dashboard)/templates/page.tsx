"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  backgroundUrl: string;
  createdAt: string;
  userId: string;
  textPositionX: number;
  textPositionY: number;
  textWidth: number;
  textHeight: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/certificate-templates");
      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      if (data.success && Array.isArray(data.data)) {
        const transformedTemplates = data.data.map((template: any) => ({
          id: template?.id || "",
          name: template?.name || "Unnamed Template",
          backgroundUrl: template?.backgroundUrl || "",
          createdAt: template?.createdAt || new Date().toISOString(),
          userId: template?.userId || "",
          textPositionX: template?.textPositionX || 50,
          textPositionY: template?.textPositionY || 50,
          textWidth: template?.textWidth || 80,
          textHeight: template?.textHeight || 15,
          fontFamily: template?.fontFamily || "Arial",
          fontSize: template?.fontSize || 16,
          fontColor: template?.fontColor || "#000000"
        }));
        console.log("Transformed templates:", transformedTemplates); // Debug log
        setTemplates(transformedTemplates);
      } else {
        console.error("Invalid data format:", data); // Debug log
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
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
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r pt-24 from-[#0b1424] via-[#131f2d] to-[#090f17] text-white p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#c7b9d3] via-[#ffffff] to-[#542082] text-transparent bg-clip-text">
              Templates
            </h1>
            <p className="text-[#c5c3c4]/70 mt-2">
              Browse and download certificate templates
            </p>
          </div>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#b7a2c9] via-[#e7e7e7] to-[#a894b9] hover:from-[#c9b8d7] hover:via-[#9d8db3] hover:to-[#c9b8d7] text-[#212531] font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[#b7a2c9]/20"
            >
              <Calendar></Calendar>
              New Event
            </motion.button>
          </Link>
        </motion.div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ImageIcon className="w-8 h-8 text-[#b7a2c9]" />
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer relative bg-gradient-to-br from-[var(--bluey-text)] to-slate-800 text-black backdrop-blur-xl rounded-lg p-6 border border-[#4b3a70]/30 shadow-lg overflow-hidden"
              >
                {/* Template Image */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {template.backgroundUrl ? (
                    <img
                      src={template.backgroundUrl}
                      alt={template.name}
                      className="w-full rounded-xl h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-300 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-[#b6b6b6] text-sm mb-5">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </p>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(template.backgroundUrl, template.name)}
                    className="w-full cursor-pointer px-4 py-2 bg-gradient-to-r from-gray-900 to-slate-900 text-white rounded-lg flex items-center justify-center gap-2 hover:from-[#5c4b80] hover:to-[#3a3f4d] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#c5c3c4]/70 text-lg">
              No templates found
            </p>
            <p className="text-[#c5c3c4]/50 text-sm mt-1">
              Create a new template to get started
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}