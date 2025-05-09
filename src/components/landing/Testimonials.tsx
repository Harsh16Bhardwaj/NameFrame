"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { partners } from "@/data/partners";
import Image from "next/image";
import { MorphingText } from "../magicui/morphing-text";

export const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 mt-10 bg-[#151423]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-3xl flex items-center justify-center font-bold mb-2">
            Loved by{" "}
          </h2>

          <MorphingText
            texts={["College Socities", "Teams WorldWide", "6th Sem Students"]}
          ></MorphingText>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Be a part of the community we are building here, Trust in us..{" "}
          </p>
        </div>

        {/* Partner logos with gradient placeholders */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-16 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="group transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-16 w-36 relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-violet-500/50 group-hover:shadow-lg group-hover:shadow-violet-500/10">
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, 
                                    hsl(${(index * 60) % 360}, 70%, 30%), 
                                    hsl(${(index * 60 + 30) % 360}, 70%, 20%))`,
                  }}
                ></div>
                <div className="text-center flex flex-col items-center justify-center z-10">
                  <div className="text-xl font-bold text-white/80 group-hover:text-white transition-all duration-300">
                    {partner.shortName}
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-all duration-300 mt-1">
                    {partner.name}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-[#1a1930] p-8 rounded-xl border border-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-6"
              >
                <div className="md:w-1/4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-violet-500/30">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < testimonials[currentTestimonial].rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="md:w-3/4">
                  <blockquote className="text-gray-300 mb-4">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="text-sm">
                    <div className="font-semibold text-white">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-violet-400">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonial === index
                      ? "bg-violet-500 w-6"
                      : "bg-gray-600"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
