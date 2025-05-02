"use client";
import React, { useState, useEffect } from "react";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { InteractivePreview } from "@/components/landing/InteractivePreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { CustomStyles } from "@/components/ui/CustomStyles";

// Certificate template images - these are imported in the Hero component
import template1 from '@/../public/1.png';
import template2 from '@/../public/2.png';
import template3 from '@/../public/3.png';
import template4 from '@/../public/4.png';

// Throttle function
const throttle = (func: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

export default function LandingPage() {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [previewName, setPreviewName] = useState("Your Name");
  
  // Templates array
  const templates = [template1, template2, template3, template4];
  
  // Auto rotate templates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemplate((prev) => (prev + 1) % templates.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [templates.length]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      
      elements.forEach((el) => {
        const htmlElement = el as HTMLElement;
        const speed = parseFloat(htmlElement.dataset.speed || '0.1');
        htmlElement.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#151423] overflow-x-hidden text-white">
      {/* Hero Section */}
      <Hero 
        previewName={previewName} 
        templates={templates}
        currentTemplate={currentTemplate}
      />
      
      {/* Features Section */}
      <Features />
      
      {/* Interactive Preview Section */}
      <InteractivePreview 
        previewName={previewName}
        setPreviewName={setPreviewName}
        currentTemplate={currentTemplate}
        templates={templates}
      />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* CTA Section */}
      <CTA />
      
      {/* Custom styles for animations */}
      <CustomStyles />
    </div>
  );
}
