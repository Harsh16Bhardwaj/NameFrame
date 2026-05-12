"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Download, Settings2, Type, Palette, LayoutTemplate } from "lucide-react";
import { DM_Sans, Inter, Space_Grotesk, Poppins } from "next/font/google";

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

const templates = ["/1.png", "/2.png", "/3.png", "/4.png"];

const InteractivePreview = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [previewName, setPreviewName] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState(0);

  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 10,
  });

  const [fontSettings, setFontSettings] = useState({
    family: "Poppins",
    size: 70,
    color: "#2DD4BF",
    weight: "500",
  });

  const handlePositionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    axis: keyof typeof textPosition
  ) => {
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
    setIsImageLoaded(false);
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
      link.download = `certificate-${(previewName || "your-name")
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <section
      id="action"
      className={`${inter.variable} relative overflow-hidden bg-black py-20 sm:py-24`}
      style={{ fontFamily: inter.style.fontFamily }}
    >
      {/* Soft NameFrame-style ambience */}
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p
            className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-teal-400/90"
            style={{ fontFamily: poppins.style.fontFamily }}
          >
            Try the designer
          </p>

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: spaceGrotesk.style.fontFamily }}
          >
            Preview your certificate before sending.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
            Choose a template, type a sample name, adjust the placement, and see
            how your final certificate will look.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-3 shadow-[0_0_70px_rgba(45,212,191,0.05)] sm:p-4">
          {/* Window Bar */}
          <div className="flex h-10 items-center justify-between rounded-t-2xl border border-white/5 bg-black/40 px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400/90" />
            </div>

            <p className="hidden text-xs text-zinc-500 sm:block">
              NameFrame Certificate Studio
            </p>

            <div className="h-2.5 w-14" />
          </div>

          <div className="grid gap-4 rounded-b-2xl border-x border-b border-white/5 bg-zinc-950/70 p-4 lg:grid-cols-[280px_1fr]">
            {/* Toolbar */}
            <aside className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-400/10 text-teal-400">
                  <Settings2 className="h-4 w-4" />
                </div>

                <div>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: spaceGrotesk.style.fontFamily }}
                  >
                    Customize
                  </h3>
                  <p className="text-xs text-zinc-500">Live preview controls</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Preview Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-teal-500/40"
                    placeholder="Enter your name"
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                    style={{ fontFamily: dmSans.style.fontFamily }}
                  />
                </div>

                {/* Position Controls */}
                <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <LayoutTemplate className="h-4 w-4 text-teal-400" />
                    Position
                  </div>

                  <div className="space-y-4">
                    <RangeControl
                      label="X Position"
                      value={textPosition.x}
                      onChange={(e) => handlePositionChange(e, "x")}
                    />

                    <RangeControl
                      label="Y Position"
                      value={textPosition.y}
                      onChange={(e) => handlePositionChange(e, "y")}
                    />
                  </div>
                </div>

                {/* Typography Controls */}
                <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Type className="h-4 w-4 text-teal-400" />
                    Typography
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs text-zinc-500">
                        Font Family
                      </label>
                      <select
                        value={fontSettings.family}
                        onChange={handleFontFamilyChange}
                        className="w-full rounded-lg border border-white/10 bg-zinc-950 px-2 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500/40"
                      >
                        <option value="Poppins">Poppins</option>
                        <option value={dmSans.style.fontFamily}>DM Sans</option>
                        <option value={inter.style.fontFamily}>Inter</option>
                        <option value={spaceGrotesk.style.fontFamily}>
                          Space Grotesk
                        </option>
                      </select>
                    </div>
{/* 
                    <RangeControl
                      label="Font Size"
                      value={fontSettings.size}
                      min={20}
                      max={120}
                      onChange={handleFontSizeChange}
                    /> */}
{/* 
                    <div>
                      <label className="mb-1.5 block text-xs text-zinc-500">
                        Font Weight
                      </label>
                      <select
                        value={fontSettings.weight}
                        onChange={handleFontWeightChange}
                        className="w-full rounded-lg border border-white/10 bg-zinc-950 px-2 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500/40"
                      >
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="700">Bold</option>
                      </select>
                    </div> */}

                    {/* <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs text-zinc-500">
                        <Palette className="h-3.5 w-3.5" />
                        Font Color
                      </label>
                      <input
                        type="color"
                        value={fontSettings.color}
                        onChange={handleFontColorChange}
                        className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                      />
                    </div> */}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
                  <h4 className="mb-3 text-sm font-medium text-zinc-300">
                    Templates
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((template, index) => (
                      <button
                        key={template}
                        onClick={() => handleTemplateChange(index)}
                        className={[
                          "overflow-hidden rounded-xl border bg-zinc-950 p-1 transition-all",
                          currentTemplate === index
                            ? "border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                            : "border-white/10 hover:border-teal-500/25",
                        ].join(" ")}
                      >
                        <Image
                          src={template}
                          alt={`Template ${index + 1}`}
                          width={160}
                          height={110}
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Preview */}
            <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: spaceGrotesk.style.fontFamily }}
                  >
                    Certificate Preview
                  </h3>
                  <p className="text-sm text-zinc-500">
                    This is how the participant name will appear.
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!isImageLoaded}
                  className="inline-flex items-center justify-center rounded-xl bg-teal-400 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: poppins.style.fontFamily }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950 p-3">
                <div className="relative overflow-hidden rounded-xl bg-white">
                  <Image
                    ref={imageRef}
                    key={templates[currentTemplate]}
                    src={templates[currentTemplate]}
                    alt="Certificate preview"
                    width={1000}
                    height={800}
                    className="h-auto w-full"
                    onLoad={() => setIsImageLoaded(true)}
                    priority
                  />

                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      left: `${textPosition.x - textPosition.width / 2}%`,
                      top: `${textPosition.y}%`,
                      width: `${textPosition.width}%`,
                      height: `${textPosition.height}%`,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div
                      className="certificate-name text-center font-bold"
                      style={{
                        fontFamily: fontSettings.family,
                        color: fontSettings.color,
                        fontSize: `${fontSettings.size / 2}px`,
                        fontWeight: fontSettings.weight,
                        lineHeight: 1,
                      }}
                    >
                      {previewName || "Your Name"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniInfo label="Template" value={`Style ${currentTemplate + 1}`} />
                <MiniInfo label="Font Size" value={`${fontSettings.size}px`} />
                <MiniInfo label="Position" value={`${textPosition.x}%, ${textPosition.y}%`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface RangeControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RangeControl: React.FC<RangeControlProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
}) => {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs text-zinc-500">{label}</label>
        <span className="text-xs text-teal-400">{value}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full accent-teal-400"
      />
    </div>
  );
};

interface MiniInfoProps {
  label: string;
  value: string;
}

const MiniInfo: React.FC<MiniInfoProps> = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
};

export default InteractivePreview;