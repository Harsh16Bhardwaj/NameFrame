import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FileUp, Move, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TemplateUploadModal from '../TemplateUploadModal';
import { useAuth } from '@clerk/nextjs';

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
  dummyName?: string;
  onPositionChange?: (property: string, value: number) => void;
  onTemplateChange?: (newUrl: string) => void;
}

export default function CertificatePreview({ 
  templateUrl, 
  textPosition,
  fontSettings,
  dummyName = "John Doe", // Default to John Doe if not provided
  onPositionChange,
  onTemplateChange
}: CertificatePreviewProps) {
  const { eventId } = useParams();
  const { getToken } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [localPosition, setLocalPosition] = useState(textPosition);
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [currentTemplateUrl, setCurrentTemplateUrl] = useState(templateUrl);
  const [isClient, setIsClient] = useState(false);

  const templateLoadedRef = useRef(false);
  const usedTemplatesLoadedRef = useRef(false);

  // Make sure fontSettings has default values
  const defaultFontSettings = {
    family: "Arial",
    size: 48,
    color: "#000000"
  };

  // Use the defaults with the incoming props
  const actualFontSettings = {
    family: fontSettings?.family || defaultFontSettings.family,
    size: fontSettings?.size || defaultFontSettings.size,
    color: fontSettings?.color || defaultFontSettings.color,
  };

  // Add this to ensure any client-side specific code runs after hydration
  useEffect(() => {
    // Place any browser-only code here that might cause hydration errors
    setImageLoaded(false);
    setImageError(false);
    
    // Client-side initialization
    if (currentTemplateUrl) {
      // Any client-side operations that might differ from server
      console.log("Template URL initialized on client:", currentTemplateUrl);
    }
  }, []);  // Empty dependency array means this runs once after initial render

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch event-specific template only ONCE when the component loads
  useEffect(() => {
    // Only fetch if we haven't loaded the template yet
    if (templateLoadedRef.current) return;
    
    const fetchEventTemplate = async () => {
      try {
        setLoadingTemplates(true);
        
        // Get the authentication token
        const token = await getToken();
        
        // Include the token in the request headers
        const response = await axios.get(`/api/certificate-templates/used?eventId=${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (response.data.success && response.data.data) {
          // Extract the background URL from the template data
          const fetchedTemplateUrl = response.data.data.backgroundUrl;
          
          // Update the state with the fetched template URL
          setCurrentTemplateUrl(fetchedTemplateUrl);
          
          // If there's a callback for template changes, call it
          if (onTemplateChange && fetchedTemplateUrl !== templateUrl) {
            onTemplateChange(fetchedTemplateUrl);
          }
          
          console.log("Fetched template:", response.data.data);
          
          // Mark template as loaded
          templateLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching event template:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    if (eventId) {
      fetchEventTemplate();
    }
  }, [eventId]); // Only depend on eventId, not onTemplateChange or getToken

  // Also fetch all previously used templates only ONCE
  useEffect(() => {
    // Skip if we've already loaded the templates
    if (usedTemplatesLoadedRef.current) return;
    
    const fetchUsedTemplates = async () => {
      try {
        const token = await getToken();
        
        const response = await axios.get('/api/certificate-templates/used', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        if (response.data.success) {
          setUsedTemplates(response.data.data || []);
          usedTemplatesLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching used templates:", error);
      }
    };

    fetchUsedTemplates();
  }, []); // Empty dependency array - only run once

  // Debug info for troubleshooting
  useEffect(() => {
    console.log("Template URL props:", templateUrl);
    console.log("Current template URL:", currentTemplateUrl);
    console.log("Used templates:", usedTemplates);
  }, [templateUrl, currentTemplateUrl, usedTemplates]);

  // Keep local position in sync with props
  useEffect(() => {
    setLocalPosition(textPosition);
  }, [textPosition]);

  // Update local state when prop changes
  useEffect(() => {
    if (templateUrl !== currentTemplateUrl) {
      setCurrentTemplateUrl(templateUrl);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [templateUrl]);

  // Handle mouse down for dragging the text position
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const previewRect = previewRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - (previewRect.width * localPosition.x / 100),
      y: e.clientY - (previewRect.height * localPosition.y / 100)
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
      
      // Update local position state for immediate visual feedback
      setLocalPosition(prev => ({
        ...prev,
        x,
        y
      }));
    };
    
    const handleMouseUp = () => {
      // When mouse is released, propagate changes to parent component
      setIsDragging(false);
      if (onPositionChange) {
        onPositionChange('x', Number(localPosition.x.toFixed(2)));
        onPositionChange('y', Number(localPosition.y.toFixed(2)));
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onPositionChange, localPosition.x, localPosition.y]);

  // Handle template update success
  const handleUploadSuccess = (newTemplateUrl: string) => {
    setShowUploadModal(false);
    setImageLoaded(false);
    setImageError(false);
    if (onTemplateChange) {
      onTemplateChange(newTemplateUrl);
    }
  };
  
  // Reset image error state when template URL changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [templateUrl]);
  
  return (
    <div className="lg:col-span-3 overflow-hidden rounded-2xl bg-[#322f42]/40 backdrop-blur-md shadow-lg border border-[#4b3a70]/30">
      <div className="p-6">
        {/* Status indicator while loading template */}
        {loadingTemplates && (
          <div className="mb-2 text-sm text-[#c5c3c4]/70 flex items-center">
            <div className="mr-2 h-3 w-3 border-2 border-t-transparent border-[#b7a2c9] rounded-full animate-spin"></div>
            Loading template...
          </div>
        )}
        
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Certificate Preview</h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-3 py-1 text-xs font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <FileUp size={14} />
              <span>Update Template</span>
            </button>
          </div>
        </div>
        
        <div ref={previewRef} className="relative overflow-hidden rounded-lg border border-[#4b3a70]/30 bg-[#272936]">
          <div className="relative aspect-[1.414/1] w-full overflow-hidden">
            {/* No template state */}
            {!currentTemplateUrl && !loadingTemplates && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#c5c3c4]/50">
                <FileUp className="h-12 w-12 mb-2" />
                <p className="text-center max-w-xs">
                  No certificate template uploaded yet
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-4 py-2 bg-[#4b3a70] text-white rounded-lg hover:bg-[#5d4b82] transition-all"
                >
                  Upload Template
                </button>
              </div>
            )}
            
            {/* Template loading state */}
            {((currentTemplateUrl && !imageLoaded && !imageError) || loadingTemplates) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-t-transparent border-[#b7a2c9] rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Template error state */}
            {currentTemplateUrl && imageError && !loadingTemplates && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <p className="text-center max-w-xs">
                  Failed to load certificate template
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Certificate Image */}
            {isClient && currentTemplateUrl && (
              <Image 
                src={currentTemplateUrl}
                alt="Certificate template"
                fill
                className={`object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                onLoadingComplete={() => setImageLoaded(true)}
                onError={() => {
                  console.error("Failed to load image:", currentTemplateUrl);
                  setImageError(true);
                  setImageLoaded(false);
                }}
              />
            )}
            
            {/* Overlay for text position */}
            {imageLoaded && currentTemplateUrl && (
              <div 
                className={`absolute flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: `${localPosition.x}%`,
                  top: `${localPosition.y}%`,
                  width: `${localPosition.width}%`,
                  height: `${localPosition.height}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: isDragging ? 'none' : 'all 0.2s ease'
                }}
                onMouseDown={handleMouseDown}
              >
                <div className={`bg-white/10 border ${isDragging ? 'border-blue-500' : 'border-[#b7a2c9]/50'} backdrop-blur-sm rounded-md px-4 py-2 w-full h-full flex items-center justify-center`}>
                  <span style={{
                    fontFamily: actualFontSettings.family,
                    fontSize: `${actualFontSettings.size}px`,
                    color: actualFontSettings.color,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitLineClamp: 2,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {dummyName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-[#c5c3c4]/70">
          <p>• Position: X: {localPosition.x.toFixed(1)}%, Y: {localPosition.y.toFixed(1)}%</p>
          <p>• Drag the text box to adjust its position on the certificate</p>
          <p>• Font: {actualFontSettings.family}, {actualFontSettings.size}px</p>
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