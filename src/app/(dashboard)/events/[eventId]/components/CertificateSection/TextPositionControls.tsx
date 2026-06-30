import React, { useState } from "react";
import { Sliders, Type, Palette } from "lucide-react";

interface TextPositionControlsProps {
  textPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fontSettings: {
    family: string;
    size: number;
    color: string;
  };
  onPositionChange: (property: string, value: number) => void;
  onFontChange: (property: string, value: string | number) => void;
  onSavePositions: () => Promise<void>;
}

export default function TextPositionControls({
  textPosition,
  fontSettings,
  onPositionChange,
  onFontChange,
  onSavePositions,
}: TextPositionControlsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Verdana",
    "Josefin",
    "Georgia",
    "Courier New",
    "Open Sans",
    "Roboto",
    "Montserrat",
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await onSavePositions();
    setIsSaving(false);
  };

  const handlePositionChange = (property: string, value: number) => {
    onPositionChange(property, value);
  };

  const handleFontChange = (property: string, value: string | number) => {
    onFontChange(property, value);
  };

  return (
    <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="cursor-pointer text-2xl font-semibold text-white">
            Text Customization
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex cursor-pointer items-center gap-1 rounded-lg bg-teal-400 px-3 py-1 text-xs font-medium text-black transition-all hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isSaving ? (
                <>
                  <span className="h-3 w-3  cursor-pointer animate-spin rounded-full border-2 border-t-transparent"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sliders size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="m-3 border-b border-zinc-800"></div>
        <div className="space-y-5">
          {/* Font Family Selection */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                <Type className="mr-1 inline h-3 w-3 text-zinc-300" /> Font
                Family
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs">
                {fontSettings.family}
              </span>
            </div>
            <select
              value={fontSettings.family}
              onChange={(e) => handleFontChange("family", e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-md font-semibold text-gray-100"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Control */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Font Size</label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                {fontSettings.size}px
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="20"
                max="120"
                value={fontSettings.size}
                onChange={(e) =>
                  handleFontChange("size", parseInt(e.target.value))
                }
                className="w-full accent-teal-300 focus:outline-none"
              />
              <input
                type="number"
                min="20"
                max="120"
                value={fontSettings.size}
                onChange={(e) =>
                  handleFontChange("size", parseInt(e.target.value) || 48)
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-zinc-300"
              />
            </div>
          </div>

          {/* Font Color Control */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                <Palette className="mr-1 inline h-3 w-3 text-teal-300" /> Font
                Color
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-gray-300">
                {fontSettings.color}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fontSettings.color}
                onChange={(e) => handleFontChange("color", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-zinc-700 bg-zinc-800 text-gray-300"
              />
              <input
                type="text"
                value={fontSettings.color}
                onChange={(e) => handleFontChange("color", e.target.value)}
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-950"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Horizontal Position */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Horizontal Position (X)
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs">
                {textPosition.x}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="95"
                value={textPosition.x}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value))
                }
                className="w-full accent-teal-300"
              />
              <input
                type="number"
                min="5"
                max="95"
                value={textPosition.x}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value) || 50)
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-zinc-300"
              />
            </div>
          </div>

          {/* Vertical Position */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Vertical Position (Y)
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs">
                {textPosition.y}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="95"
                value={textPosition.y}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value))
                }
                className="w-full accent-teal-300"
              />
              <input
                type="number"
                min="5"
                max="95"
                value={textPosition.y}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value) || 50)
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-zinc-300"
              />
            </div>
          </div>

          {/* Text Area Width */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Text Width
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs">
                {textPosition.width}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="20"
                max="95"
                value={textPosition.width}
                onChange={(e) =>
                  handlePositionChange("width", parseInt(e.target.value))
                }
                className="w-full accent-teal-300"
              />
              <input
                type="number"
                min="20"
                max="95"
                value={textPosition.width}
                onChange={(e) =>
                  handlePositionChange("width", parseInt(e.target.value) || 80)
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-zinc-300"
              />
            </div>
          </div>

          {/* Text Area Height */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Text Height
              </label>
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs">
                {textPosition.height}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                value={textPosition.height}
                onChange={(e) =>
                  handlePositionChange("height", parseInt(e.target.value))
                }
                className="w-full accent-teal-300"
              />
              <input
                type="number"
                min="5"
                max="50"
                value={textPosition.height}
                onChange={(e) =>
                  handlePositionChange("height", parseInt(e.target.value) || 15)
                }
                className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-center text-sm text-zinc-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
