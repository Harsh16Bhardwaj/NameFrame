"use client";
import React from "react";
import Hero from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import InteractivePreview from "@/components/landing/InteractivePreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { CustomStyles } from "@/components/ui/CustomStyles";
import Prism from "@/components/ui/Prism";
import {Plasma} from "@/components/ui/plasma"

// Certificate template images - these are imported in the Hero component
import template1 from "@/../public/1.png";
import template2 from "@/../public/2.png";
import template3 from "@/../public/3.png";
import template4 from "@/../public/4.png";
import FeedbackForm from "@/components/feedbackForm";

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
  return (
    <div className="min-h-screen bg-[#151423] overflow-x-hidden text-white">
      <div style={{ width: "100%", height: "100vh", paddingLeft: "20rem", position: "absolute" }}>
        {/* <Plasma
          color="#4eb3a3"
          speed={0.6}
          direction="forward"
          scale={1.4}
          opacity={0.8}
          mouseInteractive={false}
        /> */}
      </div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Interactive Preview Section */}
      <InteractivePreview />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <CTA />
      <FeedbackForm />

      {/* Custom styles for animations */}
      <CustomStyles />
    </div>
  );
}
