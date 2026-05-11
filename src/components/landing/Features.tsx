"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Award, Mail, Sparkles, TrendingUp } from "lucide-react";
import { Inter } from "next/font/google";
import { MorphingText } from "@/components/magicui/morphing-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BlackHoleEffect = () => (
  <div className="absolute top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    {/* Black hole core */}
    <div className="w-24 h-24 bg-black rounded-full shadow-inner ring-2 ring-gray-800" />

    {/* Glow Rings with Pulsing and Enhanced Shadow */}
    <div className="absolute -top-[10px] left-[-50px] w-48 h-48 rounded-full border-2 border-purple-800 opacity-30 animate-spin-slow glow-ring-1" />
    <div className="absolute -top-[50px] left-[-100px] w-72 h-72 rounded-full border-2 border-pink-500 opacity-20 animate-spin-slower glow-ring-2" />
    <div className="absolute -top-[100px] left-[-150px] w-96 h-96 rounded-full border-2 border-indigo-400 opacity-10 animate-spin-reverse glow-ring-3" />

    <style jsx>{`
      .glow-ring-1,
      .glow-ring-2,
      .glow-ring-3 {
        transform: translate(-50%, -50%);
        border-style: solid;
        box-shadow: 0 0 30px 5px var(--ring-color);
      }

      .glow-ring-1 {
        --ring-color: rgba(126, 34, 206, 0.2); /* Purple */
      }
      .glow-ring-2 {
        --ring-color: rgba(236, 72, 153, 0.2); /* Pink */
      }
      .glow-ring-3 {
        --ring-color: rgba(99, 102, 241, 0.2); /* Indigo */
      }

      /* Pulse animation */
      @keyframes pulse {
        0%,
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.01);
        }
      }

      /* Combined animations */
      .animate-spin-slow {
        animation:
          spin-slow 30s linear infinite,
          pulse 4s ease-in-out infinite;
      }

      .animate-spin-slower {
        animation:
          spin-slower 60s linear infinite,
          pulse 6s ease-in-out infinite;
      }

      .animate-spin-reverse {
        animation:
          spin-reverse 90s linear infinite,
          pulse 8s ease-in-out infinite;
      }

      /* Original spin keyframes */
      @keyframes spin-slow {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      @keyframes spin-slower {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      @keyframes spin-reverse {
        from {
          transform: translate(-50%, -50%) rotate(360deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(0deg);
        }
      }
    `}</style>
  </div>
);

export const Features: React.FC = () => {
  return (
    <motion.section
      className="py-16 py-24 bg-black pb-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container mx-auto px-4 max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h4
            className={`text-2xl sm:text-3xl md:text-4xl text-gray-200 font-bold  mt-8 sm:mt-10 ${inter.className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MorphingText
              texts={[
                "Powerful Features",
                "Simple Interface",
                "Fully Automated",
                "Lightning Fast",
              ]}
            />
          </motion.h4>
          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-400  max-w-2xl mx-auto "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Everything you need to create, manage, and distribute professional
            certificates for any events.
          </motion.p>
        </motion.div>

        {/* New Layout: Structured Workflow with varying heights */}
        <div className="relative flex flex-col md:flex-row justify-center items-end gap-6 sm:gap-8 mx-4 md:mx-0">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/10 md:w-full md:h-px md:inset-x-0 md:top-1/4 md:left-0 md:transform-none"></div>

          {/* Step 1: Upload (Slightly shorter) */}
          <StepCard
            icon={Upload}
            title="Bulk Upload"
            description="Upload all your participant data at once via CSV or Excel. No more creating certificates manually."
            accentText="Your data is secure and formatted correctly."
            stepNumber={1}
            delay={0.5}
            heightClass="h-72"
          />

          {/* Step 2: Design (Medium height) */}
          <StepCard
            icon={Award}
            title="Visual Designer"
            description="Our drag-and-drop editor helps you perfectly position names and details on your custom certificates."
            accentText="Bring your own designs or choose from our library."
            stepNumber={2}
            delay={0.6}
            heightClass="h-72 md:h-80"
          />

          {/* Step 3: Deliver (Tallest) */}
          <StepCard
            icon={Mail}
            title="Automated Delivery"
            description="Send certificates directly to participants via email with custom messages and track their delivery."
            accentText="Guaranteed delivery and real-time tracking."
            stepNumber={3}
            delay={0.7}
            heightClass="h-72 md:h-80 lg:h-88"
          />

          {/* New Cards */}
          <StepCard
            icon={Sparkles}
            title="Custom Mails"
            description="Personalize each email with participant names and event details, ensuring a unique and professional touch."
            accentText="Create a memorable experience for your attendees."
            stepNumber={4}
            delay={0.8}
            heightClass="h-72 lg:h-92"
          />
          <StepCard
            icon={TrendingUp}
            title="Actionable Insights"
            description="Gain valuable data on certificate engagement and distribution. See who has viewed and downloaded their certificate."
            accentText="Make data-driven decisions for future events."
            stepNumber={5}
            delay={0.9}
            heightClass="h-72 lg:h-96"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

// Helper component for the new card style
interface StepCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  accentText: string;
  stepNumber: number;
  delay: number;
  heightClass: string;
}

const StepCard: React.FC<StepCardProps> = ({
  icon: Icon,
  title,
  description,
  accentText,
  stepNumber,
  delay,
  heightClass,
}) => {
  return (
    <AnimatePresence>
      <BlackHoleEffect />

      <motion.div
        className={`relative z-10 w-full md:w-1/3 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] ${heightClass}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 30px -15px rgba(0, 255, 255, 0.3)",
        }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-500/20 to-emerald-500/10">
            <span className="absolute inset-0 z-0 bg-teal-500 blur-sm opacity-20 animate-pulseSlow"></span>
            <Icon className="w-6 h-6 text-teal-500" />
          </div>
          <span className="text-xl font-bold text-white relative z-10">
            {stepNumber}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm mb-4">
          {description}
        </p>
        <div className="text-sm font-light text-teal-400">{accentText}</div>
      </motion.div>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes wave {
          0%,
          100% {
            border-radius: 50% 50% 50% 50%;
          }
          25% {
            border-radius: 55% 45% 55% 50%;
          }
          50% {
            border-radius: 50% 60% 50% 55%;
          }
          75% {
            border-radius: 55% 50% 50% 45%;
          }
        }

        .sun-blob {
          animation:
            rotate 10s linear infinite,
            wave 5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
      `}</style>
    </AnimatePresence>
  );
};
