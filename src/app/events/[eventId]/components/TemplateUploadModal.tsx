import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

interface TemplateUploadModalProps {
  eventId: string;
  onClose: () => void;
  onSuccess: (templateUrl: string) => void;
}

export default function TemplateUploadModal({ eventId, onClose, onSuccess }: TemplateUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setError('Please select a PNG or JPEG image');
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'certificate_templates');
      
      // Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      if (cloudinaryResponse.data.secure_url) {
        // Update the template URL in the database
        const updateResponse = await axios.patch(`/api/events/${eventId}/update-template`, {
          templateUrl: cloudinaryResponse.data.secure_url
        });
        
        if (updateResponse.data.success) {
          onSuccess(cloudinaryResponse.data.secure_url);
        } else {
          throw new Error('Failed to update template in database');
        }
      }
    } catch (err) {
      console.error('Error uploading template:', err);
      setError('Failed to upload template. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-md w-full rounded-2xl bg-[#322f42] border border-[#4b3a70]/50 shadow-2xl overflow-hidden"
      >
        <div className="absolute right-4 top-4">
          <button 
            onClick={onClose}
            className="rounded-full bg-[#272936]/80 p-2 text-[#c5c3c4] hover:bg-[#272936] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-white">
            Update Certificate Template
          </h3>
          
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-[#4b3a70] p-4 text-center">
              <input
                type="file"
                accept="image/png, image/jpeg"
                id="template-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="template-upload"
                className="cursor-pointer flex flex-col items-center justify-center py-4"
              >
                <Upload className="h-10 w-10 text-[#b7a2c9] mb-2" />
                <span className="text-sm text-[#c5c3c4] mb-1">
                  Click to select a template image
                </span>
                <span className="text-xs text-[#c5c3c4]/70">
                  PNG or JPEG, 1000x700px or larger recommended
                </span>
              </label>
            </div>
            
            {preview && (
              <div className="rounded-lg overflow-hidden border border-[#4b3a70]/30">
                <img src={preview} alt="Template preview" className="w-full" />
              </div>
            )}
            
            {error && (
              <div className="text-sm text-red-400 p-2 bg-red-400/10 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-[#4b3a70]/50 bg-[#272936] px-4 py-2 text-sm font-medium text-[#c5c3c4] transition-all hover:bg-[#3a3c4a]"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="rounded-lg bg-[#b7a2c9] px-4 py-2 text-sm font-medium text-[#212531] transition-all hover:bg-[#c9b8d7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Template</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}