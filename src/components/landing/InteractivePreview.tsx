"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Download } from 'lucide-react';

interface InteractivePreviewProps {
  previewName: string;
  setPreviewName: (name: string) => void;
  currentTemplate: number;
  templates: any[];
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({ 
  previewName, 
  setPreviewName,
  currentTemplate,
  templates
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="py-24 bg-gradient-to-b from-[#1a1930] to-[#151423]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It in Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Type your name below to see how it looks on our certificate templates.</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-[#1f1d36] border border-gray-800 rounded-xl shadow-xl">
            <div className="mb-6">
              <div className="flex gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm text-gray-500">~ Interactive Preview ~</div>
            </div>
            
            <div>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-3 bg-[#252440] rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none"
                  placeholder="Enter your name"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value || "Your Name")}
                />
              </div>
              
              <div ref={certificateRef} className="relative overflow-hidden rounded-lg">
                <Image 
                  src={templates[currentTemplate]} 
                  alt="Certificate preview" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-script text-black font-bold">
                      {previewName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="px-6 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
                <Download className="inline mr-2 h-4 w-4" />
                Download Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};