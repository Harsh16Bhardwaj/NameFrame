"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Template {
  id: number;
  url: string;
  name: string;
}

interface TemplateCarouselProps {
  onTemplateSelect: (templateUrl: string) => void;
  selectedTemplate?: string;
}

const templates: Template[] = [
  { id: 1, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/1_apqifw.png", name: "Template 1" },
  { id: 2, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/2_fdk1r3.png", name: "Template 2" },
  { id: 3, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/3_ti9ldy.png", name: "Template 3" },
  { id: 4, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/4_ueiiaq.png", name: "Template 4" },
  { id: 5, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/5_k4bbbw.png", name: "Template 5" },
  { id: 6, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489425/6_fankq1.png", name: "Template 6" },
  { id: 7, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/7_rmz8s4.png", name: "Template 7" },
  { id: 8, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489425/8_c1onpk.png", name: "Template 8" },
  { id: 9, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489425/9_ivndjb.png", name: "Template 9" },
  { id: 10, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489425/10_zferfa.png", name: "Template 10" },
  { id: 11, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489368/11_lxdqko.png", name: "Template 11" },
  { id: 12, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489431/12_epowrv.png", name: "Template 12" },
  { id: 13, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489432/13_btm0eu.png", name: "Template 13" },
  { id: 14, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489432/14_chtsot.png", name: "Template 14" },
  { id: 15, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489432/15_u2ayqw.png", name: "Template 15" },
  { id: 16, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/16_j2ppbi.png", name: "Template 16" },
  { id: 17, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/17_gix8ri.png", name: "Template 17" },
  { id: 18, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489432/18_zvelwz.png", name: "Template 18" },
  { id: 19, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/19_trc4z2.png", name: "Template 19" },
  { id: 20, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/20_dwzljd.png", name: "Template 20" },
  { id: 21, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/21_ume0lx.png", name: "Template 21" },
  { id: 22, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489433/22_hdgnao.png", name: "Template 22" },
  { id: 23, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489438/23_f13ukv.png", name: "Template 23" },
  { id: 24, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489438/24_phklus.png", name: "Template 24" },
  { id: 25, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489438/25_nymeul.png", name: "Template 25" },
  { id: 26, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489439/26_o6vnpm.png", name: "Template 26" },
  { id: 27, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489441/27_mhifv3.png", name: "Template 27" },
  { id: 28, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489441/28_oc9two.png", name: "Template 28" },
  { id: 29, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489442/29_upjx1b.png", name: "Template 29" },
  { id: 30, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489442/30_d3mel7.png", name: "Template 30" },
  { id: 31, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489442/31_u700jz.png", name: "Template 31" },
  { id: 32, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489443/32_c66lau.png", name: "Template 32" },
  { id: 33, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489446/33_tcxbpz.png", name: "Template 33" },
  { id: 34, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489447/34_kqveva.png", name: "Template 34" },
  { id: 35, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489447/35_fk9omu.png", name: "Template 35" },
  { id: 36, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489447/36_ngfgle.png", name: "Template 36" },
  { id: 37, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489458/37_sklzit.png", name: "Template 37" },
  { id: 38, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489459/38_duhxmh.png", name: "Template 38" },
  { id: 39, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489459/39_plmxqd.png", name: "Template 39" },
  { id: 40, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489459/40_caciip.png", name: "Template 40" },
  { id: 41, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489463/41_pyjw8w.png", name: "Template 41" },
  { id: 42, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489463/42_zfihyt.png", name: "Template 42" },
  { id: 43, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489466/43_xk7k6u.png", name: "Template 43" },
  { id: 44, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489465/44_wduxtm.png", name: "Template 44" },
  { id: 45, url: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489465/45_thd2vb.png", name: "Template 45" },
];

export default function TemplateCarousel({ onTemplateSelect, selectedTemplate }: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState(selectedTemplate || '');

  const templatesPerView = 5;
  const maxIndex = Math.max(0, templates.length - templatesPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplateUrl(template.url);
    onTemplateSelect(template.url);
  };

  const visibleTemplates = templates.slice(currentIndex, currentIndex + templatesPerView);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Choose a Template</h3>
        <p className="text-[#c5c3c4]">Select a certificate template from our library</p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#4b3a70] border border-[#6b5a8a] text-white transition-all duration-200 ${
            currentIndex === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#5d4b82] hover:scale-110 hover:shadow-lg'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#4b3a70] border border-[#6b5a8a] text-white transition-all duration-200 ${
            currentIndex >= maxIndex 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#5d4b82] hover:scale-110 hover:shadow-lg'
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* Templates Container */}
        <div className="mx-12 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: `-${currentIndex * (100 / templatesPerView)}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                className="flex-shrink-0 w-1/5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  onClick={() => handleTemplateClick(template)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedTemplateUrl === template.url
                      ? 'border-[#b7a2c9] shadow-xl shadow-[#b7a2c9]/20'
                      : 'border-[#4b3a70]/50 hover:border-[#6b5a8a]'
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedTemplateUrl === template.url && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 z-10 w-6 h-6 bg-[#b7a2c9] rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}

                  {/* Template Image */}
                  <div className="aspect-[3/4] relative bg-gradient-to-br from-[#272936] to-[#1a1b23]">
                    <img
                      src={template.url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 ${
                      selectedTemplateUrl !== template.url ? 'hover:opacity-100' : ''
                    }`} />
                  </div>

                  {/* Template Name */}
                  <div className="p-3 bg-[#272936] border-t border-[#4b3a70]/30">
                    <p className="text-sm font-medium text-[#c5c3c4] text-center">
                      {template.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(templates.length / templatesPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / templatesPerView) === index
                  ? 'bg-[#b7a2c9] w-6'
                  : 'bg-[#4b3a70] hover:bg-[#6b5a8a]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Selected Template Info */}
      {selectedTemplateUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#272936] rounded-lg border border-[#4b3a70]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[#c5c3c4]">
              Template selected: <span className="text-[#b7a2c9] font-medium">
                {templates.find(t => t.url === selectedTemplateUrl)?.name}
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
