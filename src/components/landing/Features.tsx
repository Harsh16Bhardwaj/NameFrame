"use client";
import React from "react";
import { motion } from "framer-motion";
import { Upload, Award, Mail } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section  className="py-24 bg-[#1a1930]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features, Simple Interface</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to create, manage, and distribute professional certificates in one place.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            className="bg-[#252440] p-6 rounded-xl border border-gray-800 hover:border-violet-500/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)" }}
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
              <Upload className="text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bulk Upload</h3>
            <p className="text-gray-400">Upload hundreds of participant names at once via CSV or Excel. No more manual entry.</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            className="bg-[#252440] p-6 rounded-xl border border-gray-800 hover:border-violet-500/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)" }}
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
              <Award className="text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2" >Visual Designer</h3>
            <p className="text-gray-400">Drag-and-drop interface to position names perfectly on your certificates. No design skills required.</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            className="bg-[#252440] p-6 rounded-xl border border-gray-800 hover:border-violet-500/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)" }}
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
              <Mail className="text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2" >Automated Delivery</h3>
            <p className="text-gray-400">Send certificates directly to participants via email with customized messages.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};