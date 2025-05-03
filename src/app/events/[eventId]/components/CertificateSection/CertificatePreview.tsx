import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FileUp, Move } from 'lucide-react';
import { useParams } from 'next/navigation';
import TemplateUploadModal from '../TemplateUploadModal';

interface CertificatePreviewProps {
  templateUrl: string;
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
  onTemplateChange?: (newUrl: string) => void;
}

export default function CertificatePreview({ 
  templateUrl, 
  textPosition,
  fontSettings,
  onTemplateChange
}: CertificatePreviewProps) {
  const { eventId } = useParams();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Handle mouse down for dragging the text position
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    
    setIsDragging(true);
    
    const previewRect = previewRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - (previewRect.width * textPosition.x / 100),
      y: e.clientY - (previewRect.height * textPosition.y / 100)
    });
  };

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging || !previewRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      
      const previewRect = previewRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - dragStart.x) / previewRect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - dragStart.y) / previewRect.height) * 100));
      
      // Implement your position update logic here
      // For demonstration, we'll log the new position
      console.log(`New position: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle template update success
  const handleUploadSuccess = (newTemplateUrl: string) => {
    setShowUploadModal(false);
    if (onTemplateChange) {
      onTemplateChange(newTemplateUrl);
    }
  };
  
  return (
    <div className="lg:col-span-3 overflow-hidden rounded-2xl bg-[#322f42]/90 backdrop-blur-md shadow-lg border border-[#4b3a70]/30">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Certificate Preview</h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-3 py-1 text-xs font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <FileUp size={14} />
              <span>Update Template</span>
            </button>
          </div>
        </div>
        
        <div ref={previewRef} className="relative overflow-hidden rounded-lg border border-[#4b3a70]/30 bg-[#272936]">
          <div className="relative aspect-[1.414/1] w-full overflow-hidden">
            {/* Certificate Image */}
            {templateUrl && (
              <Image 
                src={templateUrl}
                alt="Certificate template"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            )}
            
            {/* Overlay for text position */}
            {imageLoaded && (
              <div 
                className="absolute flex items-center justify-center cursor-move"
                style={{
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  width: `${textPosition.width}%`,
                  height: `${textPosition.height}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="bg-white/10 border border-[#b7a2c9]/50 backdrop-blur-sm rounded-md px-4 py-2 w-full h-full flex items-center justify-center">
                  <span style={{
                    fontFamily: fontSettings.family,
                    fontSize: `${fontSettings.size}px`,
                    color: fontSettings.color,
                  }}>
                    John Doe
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-[#c5c3c4]/70">
          <p>• This is how the certificate will appear with participant names</p>
          <p>• Drag the text box to adjust its position on the certificate</p>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <TemplateUploadModal 
          eventId={eventId as string}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}