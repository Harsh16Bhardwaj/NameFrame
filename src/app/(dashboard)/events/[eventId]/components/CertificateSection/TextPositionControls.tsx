import React, { useState, useEffect } from "react";
import { Sliders, Type, Palette } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";

interface TextPositionControlsProps {
  eventId: string;
  onPositionChange: (property: string, value: number) => void;
  onFontChange: (property: string, value: string | number) => void;
  onSavePositions: () => Promise<void>;
}

export default function TextPositionControls({
  onPositionChange,
  onFontChange,
  onSavePositions,
}: TextPositionControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 15,
  });
  const [fontSettings, setFontSettings] = useState({
    family: "Arial",
    size: 48,
    color: "#000000",
  });
  const { eventId } = useParams<{ eventId: string }>();
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get(`/api/events/${eventId}/template`);
        if (res.data.success) {
          setTextPosition(res.data.textPosition);
          setFontSettings(res.data.fontSettings);
        }
      } catch (err) {
        // fallback to defaults
      }
    }
    fetchSettings();
  }, [eventId]);

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

  // Local change handlers to update state and call parent
  const handlePositionChange = (property: string, value: number) => {
    setTextPosition((prev) => ({ ...prev, [property]: value }));
    onPositionChange(property, value);
  };

  const handleFontChange = (property: string, value: string | number) => {
    setFontSettings((prev) => ({ ...prev, [property]: value }));
    onFontChange(property, value);
  };

  return (
    <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-[#322f42]/90 backdrop-blur-md shadow-lg border border-[#4b3a70]/30">
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl cursor-pointer font-semibold text-white">
            Text Customization
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex cursor-pointer items-center gap-1 rounded-lg bg-[#b7a2c9] px-3 py-1 text-xs font-medium text-[#212531] transition-all hover:bg-[#c9b8d7] disabled:opacity-50 disabled:cursor-not-allowed`}
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
        <div className="border-b border-[#4a4c57] m-3"></div>
        <div className="space-y-5">
          {/* Font Family Selection */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#cfc3d9]">
                <Type className="inline w-3 h-3 mr-1 text-[#cfc3d9]" /> Font
                Family
              </label>
              <span className="text-xs bg-[#272936] rounded-md px-2 py-1">
                {fontSettings.family}
              </span>
            </div>
            <select
              value={fontSettings.family}
              onChange={(e) => handleFontChange("family", e.target.value)}
              className="w-full rounded-md border border-[#4b3a70]/30 bg-[#232530] px-3 py-2 text-md text-gray-100 font-semibold"
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
              <label className="text-sm font-medium [#cfc3d9]">Font Size</label>
              <span className="text-xs bg-[#272936] text-[#cfc3d9] rounded-md px-2 py-1">
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
                className="w-full accent-[#e5e1e8] focus:outline-none focus:accent-[#e5e1e8]"
              />
              <input
                type="number"
                min="20"
                max="120"
                value={fontSettings.size}
                onChange={(e) =>
                  handleFontChange("size", parseInt(e.target.value) || 48)
                }
                className="w-16 rounded-md border border-[#4b3a70]/30 bg-[#232530] px-2 py-1 text-center text-sm text-[#c5c3c4]"
              />
            </div>
          </div>

          {/* Font Color Control */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium [#cfc3d9]">
                <Palette className="inline w-3 h-3 mr-1 text-[#a98ec0]" /> Font
                Color
              </label>
              <span className="text-xs bg-[#272936] text-gray-300 rounded-md px-2 py-1">
                {fontSettings.color}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fontSettings.color}
                onChange={(e) => handleFontChange("color", e.target.value)}
                className="w-12 h-10 text-gray-300 rounded border border-[#4b3a70]/30 bg-[#272936] cursor-pointer"
              />
              <input
                type="text"
                value={fontSettings.color}
                onChange={(e) => handleFontChange("color", e.target.value)}
                className="flex-1 rounded-md border border-[#4b3a70]/30 hover:bg-[#232530] bg-[#232530] px-2 py-2 focus:bg-[#1a1b23] text-sm text-[#c5c3c4]"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Horizontal Position */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#cfc3d9]">
                Horizontal Position (X)
              </label>
              <span className="text-xs bg-[#272936] rounded-md px-2 py-1">
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
                className="w-full accent-[#e5e1e8]"
              />
              <input
                type="number"
                min="5"
                max="95"
                value={textPosition.x}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value) || 50)
                }
                className="w-16 rounded-md border border-[#4b3a70]/30 bg-[#232530] px-2 py-1 text-center text-sm text-[#c5c3c4]"
              />
            </div>
          </div>

          {/* Vertical Position */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium [#cfc3d9]">
                Vertical Position (Y)
              </label>
              <span className="text-xs bg-[#272936] rounded-md px-2 py-1">
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
                className="w-full accent-[#e5e1e8]"
              />
              <input
                type="number"
                min="5"
                max="95"
                value={textPosition.y}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value) || 50)
                }
                className="w-16 rounded-md border border-[#4b3a70]/30 bg-[#232530] px-2 py-1 text-center text-sm text-[#c5c3c4]"
              />
            </div>
          </div>

          {/* Text Area Width */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#cfc3d9]">
                Text Width
              </label>
              <span className="text-xs bg-[#272936] rounded-md px-2 py-1">
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
                className="w-full accent-[#e5e1e8]"
              />
              <input
                type="number"
                min="20"
                max="95"
                value={textPosition.width}
                onChange={(e) =>
                  handlePositionChange("width", parseInt(e.target.value) || 80)
                }
                className="w-16 rounded-md border border-[#4b3a70]/30 bg-[#232530] px-2 py-1 text-center text-sm text-[#c5c3c4]"
              />
            </div>
          </div>

          {/* Text Area Height */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#cfc3d9]">
                Text Height
              </label>
              <span className="text-xs bg-[#272936] rounded-md px-2 py-1">
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
                className="w-full accent-[#e5e1e8]"
              />
              <input
                type="number"
                min="5"
                max="50"
                value={textPosition.height}
                onChange={(e) =>
                  handlePositionChange("height", parseInt(e.target.value) || 15)
                }
                className="w-16 rounded-md border border-[#4b3a70]/30 bg-[#232530] px-2 py-1 text-center text-sm text-[#c5c3c4]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
