'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';
import axios from 'axios';
import Confetti from 'react-confetti';
import {
  FaTelegramPlane,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { josefinFont } from '@/components/landing/Hero';

interface ContactForm {
  name: string;
  email: string;
  message: string;
  phone?: string;
  caseType?: string;
}

interface SocialHandle {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
}

const socialHandles: SocialHandle[] = [
  { name: 'Telegram', icon: FaTelegramPlane, url: 'https://t.me/nyaayvaad', color: '#24A1DE', orbitRadius: 100, orbitSpeed: 10 },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/nyaayvaad', color: '#E1306C', orbitRadius: 120, orbitSpeed: 12 },
  { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/nyaayvaad', color: '#1DA1F2', orbitRadius: 90, orbitSpeed: 9 },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/company/nyaayvaad', color: '#0077B5', orbitRadius: 110, orbitSpeed: 11 },
  { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://wa.me/yournumber', color: '#25D366', orbitRadius: 95, orbitSpeed: 10.5 },
  { name: 'Email', icon: FaEnvelope, url: 'mailto:contact@nyaayvaad.com', color: '#EA4335', orbitRadius: 115, orbitSpeed: 11.5 },
];

const caseTypes = [
  'Property Dispute',
  'Family Law',
  'Criminal Case',
  'Civil Suit',
  'Corporate Law',
  'Other'
];

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
    phone: '',
    caseType: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (result?.success) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/contact', formData);
      setResult(response.data);
      if (response.data.success) {
        toast.success('Message sent! We\'ll get back to you soon.', { duration: 4000 });
        setFormData({ name: '', email: '', message: '', phone: '', caseType: '' });
      } else {
        toast.error(response.data.error || 'Failed to send message.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'An error occurred. Please try again.';
      setResult({ success: false, error: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10  bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-900 text-white border border-purple-500' }} />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Subtle Legal Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/legal-pattern.svg"
          alt="Legal Pattern"
          layout="fill"
          objectFit="cover"
          priority
          className="animate-pulse-slow"
        />
      </div>

      {/* Neon Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="w-32 h-32 bg-purple-500 rounded-full absolute top-10 left-16 opacity-20 blur-2xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="w-48 h-48 bg-indigo-500 rounded-full absolute bottom-20 right-24 opacity-20 blur-2xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-5xl decoration-2  underline-offset-4 font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C75] to-indigo-500 ]"
        >
          Got an Issue?
          <span className={`text-[#d6d6d5] ${josefinFont.className} -mt-4 md:mt-0 text-2xl ml-2`}>We have you covered</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/30"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-[#C83E4D]">Contact Our Team</h2>
            <p className="text-sm text-gray-400 mb-6 font-[var(--font-inter)]">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
            <form onSubmit={submitForm} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2 font-[var(--font-inter)]">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 font-[var(--font-inter)]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2 font-[var(--font-inter)]">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="+91 1234567890"
                />
              </div>
              <div>
                <label htmlFor="caseType" className="block text-sm font-medium text-gray-200 mb-2 font-[var(--font-inter)]">
                  Type of Case
                </label>
                <select
                  id="caseType"
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="">Select case type</option>
                  {caseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2 font-[var(--font-inter)]">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full p-2 md:p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Brief description of your legal matter..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 md:p-3 bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer border border-gray-100/50 rounded-lg font-semibold text-white transition duration-300 hover:from-purple-500/80 hover:to-indigo-500/80 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } font-[var(--font-inter)]`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-solid rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`mt-6 p-4 rounded-lg ${
                    result.success
                      ? 'bg-green-100/20 text-green-300 border border-green-400/50'
                      : 'bg-red-100/20 text-red-300 border border-red-400/50'
                  } font-[var(--font-inter)]`}
                >
                  {result.success ? (
                    <p className="font-semibold">
                      {result.message || 'Message sent! We\'ll get back to you soon.'}
                    </p>
                  ) : (
                    <p>{result.error}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Handles Constellation */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-indigo-500/30 relative flex flex-col items-center"
          >
            <SparklesText>

            <h2 className="text-2xl md:text-4xl underline underline-offset-4 decoration-1 font-bold mb-6 text-[#048a91] x-40 relative ">Connect With Us</h2>
            </SparklesText>
            <p className="text-sm text-gray-400 mb-6 font-[var(--font-inter)] text-center">
              Reach out to us through any of our social channels or visit our office in Delhi.
            </p>

            

            {/* Social Media Constellation */}
            <div className="relative w-full h-80 flex items-center justify-center mb-8">
              {/* Central Node */}
              <motion.div
                className="absolute w-16 h-16 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center font-semibold font-[var(--font-inter)] border-2 border-white/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Connect
              </motion.div>
              {/* Orbiting Icons */}
              {socialHandles.map((handle, index) => (
                <motion.a
                  key={handle.name}
                  href={handle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute rounded-full"
                  animate={{
                    x: [
                      handle.orbitRadius * Math.cos(0),
                      handle.orbitRadius * Math.cos((2 * Math.PI) / 3),
                      handle.orbitRadius * Math.cos((4 * Math.PI) / 3),
                      handle.orbitRadius * Math.cos(0),
                    ],
                    y: [
                      handle.orbitRadius * Math.sin(0),
                      handle.orbitRadius * Math.sin((2 * Math.PI) / 3),
                      handle.orbitRadius * Math.sin((4 * Math.PI) / 3),
                      handle.orbitRadius * Math.sin(0),
                    ],
                  }}
                  transition={{
                    duration: handle.orbitSpeed,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5,
                  }}
                  whileHover={{
                    scale: 1.3,
                    boxShadow: `0 0 20px ${handle.color}CC`,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `radial-gradient(circle, ${handle.color}40, transparent)` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  >
                    <handle.icon className="text-3xl" style={{ color: handle.color }} />
                  </motion.div>
                  <motion.span
                    className="absolute top-14 left-1/2 -translate-x-1/2 text-xs font-[var(--font-inter)] text-white opacity-0"
                    whileHover={{ opacity: 1, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {handle.name}
                  </motion.span>
                </motion.a>
              ))}
            </div>

            {/* Office Information */}
            <div className="w-full mb-8 p-4 bg-gray-800/50 rounded-xl border border-indigo-500/20">
              <h3 className="text-lg font-bold text-[#f7c172] mb-3 ">Our Office :</h3>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="w-5 h-5 mr-2 flex items-center justify-center bg-indigo-500/20 rounded-full">
                    📍
                  </span>
                  Mahraja Agrasen Institute of Technology, Sec-22, Rohini, New Delhi
                </p>
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="w-5 h-5 mr-2 flex items-center justify-center bg-indigo-500/20 rounded-full">
                    🕒
                  </span>
                  Mon-Fri: 11:00 AM - 3:00 PM
                </p>
                <p className="text-gray-300 text-sm flex items-center">
                  <span className="w-5 h-5 mr-2 flex items-center justify-center bg-indigo-500/20 rounded-full">
                    📞
                  </span>
                  +91 8826200156
                </p>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="w-full p-4 bg-gray-800/50 rounded-xl border border-indigo-500/20">
              <h3 className="text-lg font-semibold text-white mb-3 font-[var(--font-inter)]">Quick Message</h3>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Your message"
                  rows={3}
                  className="w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  Send Quick Message
                </button>
              </form>
            </div>

          
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 