import React from "react";
import CertificatePreview from "./CertificatePreview";
import TextPositionControls from "./TextPositionControls";

interface CertificateSectionProps {
  templateUrl: string;
  textPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fontSettings?: {
    family: string;
    size: number;
    color: string;
  };
  dummyName?: string;
  onPositionChange: (property: string, value: number) => void;
  onFontChange: (property: string, value: string | number) => void;
  onSavePositions: () => Promise<void>;
  onTemplateChange?: (newUrl: string) => void;
}

export default function CertificateSection({
  templateUrl,
  textPosition,
  fontSettings = {
    family: "Arial",
    size: 48,
    color: "#000000",
  },
  dummyName,
  onPositionChange,
  onFontChange,
  onSavePositions,
  onTemplateChange,
}: CertificateSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Certificate Preview */}
      <CertificatePreview
        templateUrl={templateUrl}
        textPosition={textPosition}
        fontSettings={fontSettings}
        onPositionChange={onPositionChange}
        onTemplateChange={onTemplateChange}
        dummyName={dummyName}
      />

      {/* Text Position and Font Customization */}
      <TextPositionControls
        textPosition={textPosition}
        fontSettings={fontSettings}
        onPositionChange={onPositionChange}
        onFontChange={onFontChange}
        onSavePositions={onSavePositions}
        dummyName={dummyName}
      />
    </div>
  );
}
