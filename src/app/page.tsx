import React from "react";
import Hero from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import InteractivePreview from "@/components/landing/InteractivePreview";
import Testimonials from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import FeedbackForm from "@/components/feedbackForm";
import LandingMotionSection from "@/components/landing/LandingMotionSection";

export default function LandingPage() {
  return (
    <div className="landing-root min-h-screen overflow-x-hidden text-[var(--landing-text)]">
      <Hero />
      <LandingMotionSection delay={0.05}>
        <Features />
      </LandingMotionSection>
      <LandingMotionSection delay={0.08}>
        <InteractivePreview />
      </LandingMotionSection>
      <LandingMotionSection delay={0.1}>
        <Testimonials />
      </LandingMotionSection>
      <LandingMotionSection delay={0.12}>
        <Pricing />
      </LandingMotionSection>
      <LandingMotionSection delay={0.14}>
        <FAQ />
      </LandingMotionSection>
      <LandingMotionSection delay={0.16}>
        <CTA />
      </LandingMotionSection>
      <LandingMotionSection delay={0.18}>
        <FeedbackForm />
      </LandingMotionSection>
    </div>
  );
}
