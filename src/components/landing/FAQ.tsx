"use client";
import React, { useState } from "react";
import { ChevronUp, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { faqs } from '@/data/faqs';

export const FAQ: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Toggle FAQ
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  return (
    <section className="py-24 bg-[#151423]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm md:text-md">Everything you need to know about NameFrame.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="darkOnyx border border-gray-800 rounded-lg overflow-hidden"
            >
              <button 
                className="w-full p-4 flex justify-between items-center text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-sm md:text-lg">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="flex-shrink-0 h-5 w-5 tealy-text" />
                ) : (
                  <ChevronDown className="flex-shrink-0 h-5 w-5 tealy-text" />
                )}
              </button>
              
              {expandedFaq === index && (
                <div className="p-4 py-6 pt-3 md:text-lg text-sm text-gray-400 border-t border-gray-800">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 m-2">Still have questions?</p>
          <Link href="/contact">
            <button className="px-6 py-2 border border-violet-500 tealy-text cursor-pointer rounded-lg hover:bg-violet-500/10 transition-colors">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};