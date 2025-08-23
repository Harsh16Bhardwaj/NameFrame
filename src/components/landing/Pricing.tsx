"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-40 overflow-x-hidden bg-black relative">
      <ParticleCanvas />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-gray-100 md:text-6xl font-bold text-2xl mb-2 max-w-2xl mx-auto">
            Explore the Pricing
          </p>
          <h2
            className={`text-md md:text-xl text-gray-300 font-bold mb-4 ${inter.className}`}
          >
            It’s Free for Now, but who knows...
          </h2>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`${!isYearly ? "text-white" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 border-2 border-gray-200 rounded-full bg-neutral-800 flex items-center px-1 transition-all duration-200"
            >
              <div
                className={`w-4 h-4 rounded-full bg-teal-600 transition-all duration-200 ${
                  isYearly ? "ml-6" : ""
                }`}
              ></div>
            </button>
            <span className={`${isYearly ? "text-white" : "text-gray-500"}`}>
              Yearly <span className="text-gray-400 text-xs">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/5 backdrop-blur-xl md:mx-0 mx-4 rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold mb-2 text-white">Free</h3>
              <div className="text-3xl font-bold text-white">
                ₹0<span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-gray-400 mt-2">
                Perfect for small events and individual use.
              </p>
            </div>

            <div className="p-6 space-y-4 text-gray-300">
              <Feature text="Up to 50 certificates/month" />
              <Feature text="Basic templates" />
              <Feature text="Email delivery" />
              <Feature text="Custom branding" disabled />
              <Feature text="API access" disabled />
            </div>

            <div className="p-6">
              <button className="w-full cursor-pointer py-2 border border-white/10 text-white rounded-lg bg-neutral-700/50 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative md:mx-0 mx-4 bg-white/5 backdrop-blur-xl rounded-xl border border-teal-600 transform scale-105 z-10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600 rounded-xl"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
              Most Popular
            </div>

            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold mb-2 text-white">Pro</h3>
              <div className="text-3xl font-bold text-white">
                ₹{isYearly ? "699" : "149"}
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-gray-400 mt-2">
                For teams and organizations with regular events.
              </p>
            </div>

            <div className="p-6 space-y-4 text-gray-300">
              <Feature text="Unlimited certificates" />
              <Feature text="All templates" />
              <Feature text="Email & link delivery" />
              <Feature text="Custom branding" />
              <Feature text="API access" disabled />
            </div>

            <div className="p-6">
              <button className="w-full cursor-pointer py-2 bg-teal-700 rounded-lg hover:bg-teal-600 transition-all text-white">
                Get Started
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/5 backdrop-blur-xl md:mx-0 mx-4 rounded-xl border border-white/40 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold mb-2 text-white">
                Enterprise
              </h3>
              <div className="text-3xl font-bold text-white">
                ₹{isYearly ? "999" : "399"}
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-gray-400 mt-2">
                For large organizations and unique requirements.
              </p>
            </div>

            <div className="p-6 space-y-4 text-gray-300">
              <Feature text="Everything in Pro" />
              <Feature text="White labeling" />
              <Feature text="Priority support" />
              <Feature text="Custom integrations" />
              <Feature text="Full API access" />
            </div>

            <div className="p-6">
              <button className="w-full cursor-pointer py-2 border border-white/10 bg-gray-700/50 text-white rounded-lg hover:bg-white/10 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Feature({ text, disabled }: { text: string; disabled?: boolean }) {
  return (
    <div
      className={`flex items-start ${
        disabled ? "text-gray-500" : "text-gray-300"
      }`}
    >
      <Check
        className={`mt-1 mr-2 h-4 w-4 flex-shrink-0 ${disabled ? "text-gray-500" : "text-gray-300"}`}
      />
      <span>{text}</span>
    </div>
  );
}