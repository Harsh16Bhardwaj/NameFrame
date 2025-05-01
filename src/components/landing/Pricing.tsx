"use client";
import React, { useState } from "react";
import { Check, Plus } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  return (
    <section className="py-24 bg-[#1a1930]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Choose the plan that's right for your organization.</p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`${!isYearly ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 rounded-full bg-gray-700 flex items-center p-1 transition-all duration-200"
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 ${isYearly ? "ml-6" : ""}`}></div>
            </button>
            <span className={`${isYearly ? "text-white" : "text-gray-500"}`}>Yearly <span className="text-green-400 text-xs">(Save 20%)</span></span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#252440] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold">$0<span className="text-gray-500 text-sm">/month</span></div>
              <p className="text-gray-400 mt-2">Perfect for small events and individual use.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Up to 50 certificates/month</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Basic templates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Email delivery</span>
              </div>
              <div className="flex items-start text-gray-500">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-start text-gray-500">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>API access</span>
              </div>
            </div>
            
            <div className="p-6">
              <button className="w-full py-2 border border-violet-500 text-violet-400 rounded-lg hover:bg-violet-500/10 transition-colors">
                Get Started
              </button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="relative bg-[#252440] rounded-xl border border-violet-500 overflow-hidden shadow-lg shadow-violet-500/20 transform scale-105 z-10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
              Most Popular
            </div>
            
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold">
                ${isYearly ? "24" : "29"}<span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-gray-400 mt-2">For teams and organizations with regular events.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Unlimited certificates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>All templates</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Email & link delivery</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom branding</span>
              </div>
              <div className="flex items-start text-gray-500">
                <Plus className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>API access</span>
              </div>
            </div>
            
            <div className="p-6">
              <button className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/25 transform hover:scale-[1.02]">
                Get Started
              </button>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-[#252440] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold">
                ${isYearly ? "79" : "99"}<span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-gray-400 mt-2">For large organizations and unique requirements.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Everything in Pro</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>White labeling</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Priority support</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Custom integrations</span>
              </div>
              <div className="flex items-start">
                <Check className="text-green-400 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                <span>Full API access</span>
              </div>
            </div>
            
            <div className="p-6">
              <button className="w-full py-2 border border-violet-500 text-violet-400 rounded-lg hover:bg-violet-500/10 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};