"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  imageUrl: string;
  eventName: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/templates");
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const transformedTemplates = data.data.map((template: any) => ({
          id: template?.id || "",
          name: template?.name || "Unnamed Template",
          imageUrl: template?.imageUrl || "",
          eventName: template?.eventName || "Unnamed Event",
          createdAt: template?.createdAt || new Date().toISOString()
        }));
        setTemplates(transformedTemplates);
      } else {
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
      className="min-h-screen bg-gradient-to-r pt-24 from-[#0d172a] via-[#131f2d] to-[#101a26] text-white p-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#4b3a70]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-[#b7a2c9]/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#c7b9d3] via-[#ffffff] to-[#542082] text-transparent bg-clip-text">
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
              New Template
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
                className="group relative bg-gradient-to-br from-[#d8d8d8] via-[#3e8169] to-[#79c7ad] text-black backdrop-blur-xl rounded-lg p-6 border border-[#4b3a70]/30 shadow-lg overflow-hidden"
              >
                {/* Template Image */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {template.imageUrl ? (
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-black mb-2">
                    {template.name}
                  </h3>
                  <p className="text-[#464646] mb-4">
                    Event: {template.eventName}
                  </p>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(template.imageUrl, template.name)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#4b3a70] to-[#2a2f3d] text-white rounded-lg flex items-center justify-center gap-2 hover:from-[#5c4b80] hover:to-[#3a3f4d] transition-all"
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