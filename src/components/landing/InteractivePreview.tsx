"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DM_Sans, Inter, Space_Grotesk, Poppins } from "next/font/google";
import { SparklesText } from "@/components/magicui/sparkles-text";
import html2canvas from "html2canvas";

// Font Definitions
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const   InteractivePreview = () => {
  const certificateRef = useRef(null);
  const imageRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [previewName, setPreviewName] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const templates = ["/1.png", "/2.png", "/3.png", "/4.png"];

  // Text position and font settings
  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 10,
  });

  const [fontSettings, setFontSettings] = useState({
    family: "Poppins",
    size: 70,
    color: "#4C72B0", // --accent-primary
    weight: "400",
  });

  // Toolbar handlers
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>, axis: keyof typeof textPosition) => {
    setTextPosition((prev) => ({
      ...prev,
      [axis]: Number(e.target.value),
    }));
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSettings((prev) => ({
      ...prev,
      size: Number(e.target.value),
    }));
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSettings((prev) => ({
      ...prev,
      family: e.target.value,
    }));
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSettings((prev) => ({
      ...prev,
      weight: e.target.value,
    }));
  };

  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSettings((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handleTemplateChange = (index: number) => {
    setCurrentTemplate(index);
  };

  const handleDownload = async () => {
    const image = imageRef.current;
    if (!image || !isImageLoaded) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSettings.weight} ${fontSettings.size}px ${fontSettings.family}`;
      ctx.fillStyle = fontSettings.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = (textPosition.x / 100) * canvas.width;
      const y = (textPosition.y / 100) * canvas.height;
      const maxWidth = (textPosition.width / 100) * canvas.width;

      ctx.fillText(previewName || "Your Name", x, y, maxWidth);

      const link = document.createElement("a");
      link.download = `certificate-${(previewName || "your-name").replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <motion.section
      id="action"
      className="py-12 sm:py-16 bg-[var(--bg-primary)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        {/* Main Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[var(--font-light)]"
              style={{ fontFamily: spaceGrotesk.style.fontFamily }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SparklesText>Customize Your Certificate</SparklesText>
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-[var(--font-secondary)] max-w-2xl mx-auto"
              style={{ fontFamily: inter.style.fontFamily }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Enter your name and adjust settings to preview your certificate.
            </motion.p>
          </motion.div>
          <div>
            <motion.div
              className="max-w-6xl mx-auto flex space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Toolbar */}
              <motion.aside
                className="p-4  bg-[var(--bg-secondary)] border border-[var(--onyx)] shadow-md max-h-[600px] overflow-y-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3
                  className="text-lg text-center font-semibold mb-4 text-[var(--font-light)]"
                  style={{ fontFamily: spaceGrotesk.style.fontFamily }}
                >
                  Customize Certificate
                </h3>

                {/* Position Controls */}
                <div className="mb-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[var(--font-secondary)]">
                        X Position (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textPosition.x}
                        onChange={(e) => handlePositionChange(e, "x")}
                        className="w-full h-1 bg-[var(--onyx)] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--font-secondary)]">
                        Y Position (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textPosition.y}
                        onChange={(e) => handlePositionChange(e, "y")}
                        className="w-full h-1 bg-[var(--onyx)] rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Controls */}
                <div className="mb-4">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs mb-1 text-[var(--font-secondary)]">
                        Font Family
                      </label>
                      <select
                        value={fontSettings.family}
                        onChange={handleFontFamilyChange}
                        className="w-full mb-2 p-1 text-xs bg-[var(--bg-tertiary)] text-[var(--font-light)] rounded border border-[var(--onyx)] "
                      >
                        <option value="Poppins">Poppins</option>
                        <option value={dmSans.style.fontFamily}>DM Sans</option>
                        <option value={inter.style.fontFamily}>Inter</option>
                        <option value={spaceGrotesk.style.fontFamily}>
                          Space Grotesk
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs  text-[var(--font-secondary)]">
                        Font Size (px)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={fontSettings.size}
                        onChange={handleFontSizeChange}
                        className="w-full h-1 bg-[var(--onyx)] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1 text-[var(--font-secondary)]">
                        Font Weight
                      </label>
                      <select
                        value={fontSettings.weight}
                        onChange={handleFontWeightChange}
                        className="w-full mb-2 p-1 bg-[var(--bg-tertiary)] text-[var(--font-light)] rounded border border-[var(--onyx)] text-xs"
                      >
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--font-secondary)]">
                        Font Color
                      </label>
                      <input
                        type="color"
                        value={fontSettings.color}
                        onChange={handleFontColorChange}
                        className="w-full h-8 rounded border border-[var(--onyx)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <h4 className="text-xs font-medium text-[var(--font-secondary)] mb-1">
                    Template
                  </h4>
                  <div className="grid grid-cols-2 gap-1">
                    {templates.map((template, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleTemplateChange(index)}
                        className={`p-1 border rounded ${
                          currentTemplate === index
                            ? "border-[var(--cta)] bg-[var(--bg-tertiary)]"
                            : "border-[var(--onyx)]"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={template}
                          alt={`Template ${index + 1}`}
                          width={80}
                          height={60}
                          className="w-full h-auto rounded"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.aside>

              <motion.div
                className="p-4 bg-[var(--bg-secondary)] border border-[var(--onyx)] shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <input
                    type="text"
                    className="w-full p-2 bg-[var(--bg-tertiary)] text-[var(--font-light)] rounded border border-[var(--onyx)] focus:border-[var(--cta)] focus:outline-none text-sm"
                    placeholder="Enter your name"
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                    style={{ fontFamily: dmSans.style.fontFamily }}
                  />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTemplate}
                    ref={certificateRef}
                    className="relative overflow-hidden rounded"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Image
                      ref={imageRef}
                      src={templates[currentTemplate]}
                      alt="Certificate preview"
                      width={1000}
                      height={800}
                      className="w-full h-auto"
                      onLoad={() => setIsImageLoaded(true)}
                    />
                    <div
                      className="absolute flex items-center justify-center w-full"
                      style={{
                        left: "0%",
                        top: `${textPosition.y}%`,
                        width: "100%",
                        height: `${textPosition.height}%`,
                      }}
                    >
                      <motion.div
                        className="text-center"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div
                          className="certificate-name text-xl sm:text-2xl md:text-3xl font-bold"
                          style={{
                            fontFamily: fontSettings.family,
                            color: fontSettings.color,
                            fontSize: `${fontSettings.size / 2}px`,
                            fontWeight: fontSettings.weight,
                          }}
                        >
                          {previewName || "Your Name"}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  className="mt-4 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.button
                    onClick={handleDownload}
                    disabled={!isImageLoaded}
                    className="px-4 py-2 bg-[var(--cta)] text-[var(--font-light)] rounded hover:bg-[var(--tealy)] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: poppins.style.fontFamily }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InteractivePreview;
