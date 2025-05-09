"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dancing_Script,
  Cookie,
  Josefin_Sans,
  Pacifico,
  Merienda,
  Leckerli_One,
  Just_Another_Hand,
  Titan_One,
  Style_Script,
  Delius,
} from "next/font/google";
import { SparklesText } from "@/components/magicui/sparkles-text";
import html2canvas from "html2canvas";

export const cookieFont = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export const josefinFont = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-josefin",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dancing-script",
});

export const delius = Delius({
  weight: "400",
  subsets: ["latin"],
});

export const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const styleScript = Style_Script({
  weight: "400",
  subsets: ["latin"],
});

export const merienda = Merienda({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-merienda",
});

export const leckerliOne = Leckerli_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-leckerli-one",
});

export const justAnotherHand = Just_Another_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-just-another-hand",
});

interface InteractivePreviewProps {
  previewName: string;
  setPreviewName: (name: string) => void;
  currentTemplate: number;
  templates: string[];
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  previewName,
  setPreviewName,
  currentTemplate,
  templates,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Adjusted parameters for text position and font settings to match the preview
  const textPosition = {
    x: 50, // Center horizontally (adjusted to match the preview's centering)
    y: 46, // Position below the "Certificate of Appreciation" text
    width: 80, // Wider to accommodate longer names
    height: 10,
  };

  const fontSettings = {
    family: "Poppins", // Match the preview and certificate style
    size: 70, // Base font size; will be halved in preview
    color: "#414141", // Match the certificate's text color
  };

  const handleDownload = async () => {
    const image = imageRef.current;
    if (!image || !isImageLoaded) return;

    try {
      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the certificate background
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Apply font settings
      ctx.font = `${fontSettings.size }px ${fontSettings.family}`; // Match the preview's font size
      ctx.fillStyle = fontSettings.color;
      ctx.textAlign = "center"; // Center the text
      ctx.textBaseline = "middle";

      // Calculate absolute position
      const x = (textPosition.x / 100) * canvas.width;
      const y = (textPosition.y / 100) * canvas.height + 30;
      const maxWidth = (textPosition.width / 100) * canvas.width;

      // Draw participant name
      ctx.fillText(previewName || "Your Name", x, y, maxWidth);

      // Create download link
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
      className="py-16 sm:py-24 bg-gradient-to-b from-[#1a1930] to-[#151423]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h2
            className={`${titanOne.className} text-2xl sm:text-3xl md:text-5xl mt-8 sm:mt-10 font-bold mb-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SparklesText>Don't Miss The Action</SparklesText>
          </motion.h2>
          <motion.p
            className={`text-sm sm:text-base md:text-xl text-gray-400 max-w-2xl mx-auto ${delius.className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Type your name below to see how it looks on our certificate templates.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className="p-4 sm:p-6 darkOnyx border border-gray-800 rounded-xl shadow-xl"
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
              <div className="flex gap-2 mb-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <input
                  type="text"
                  className={`w-full p-3 px-5 ${delius.className} bg-[#141423] rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none text-sm sm:text-base`}
                  placeholder="Enter your name"
                  value={previewName}
                  onChange={(e) =>
                    setPreviewName(e.target.value || "Your Name")
                  }
                />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTemplate}
                  ref={certificateRef}
                  className="relative overflow-hidden rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                      left: "0%", // Position the container at the left edge
                      top: `${textPosition.y}%`,
                      width: "100%", // Full width to allow centering
                      height: `${textPosition.height}%`,
                    }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div
                        className={`certificate-name text-2xl sm:text-3xl md:text-4xl ${dancingScript.className} font-bold`}
                        style={{
                          fontFamily: fontSettings.family,
                          color: fontSettings.color,
                        }}
                      >
                        {previewName || "Your Name"}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <motion.button
                onClick={handleDownload}
                disabled={!isImageLoaded}
                className="px-6 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Preview
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default InteractivePreview;