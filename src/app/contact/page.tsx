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
  FaSlack,
  FaRedditAlien,
  FaDiscord,
} from 'react-icons/fa';

interface ContactForm {
  name: string;
  email: string;
  message: string;
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
  { name: 'Telegram', icon: FaTelegramPlane, url: 'https://t.me/yourhandle', color: '#24A1DE', orbitRadius: 100, orbitSpeed: 10 },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/yourhandle', color: '#E1306C', orbitRadius: 120, orbitSpeed: 12 },
  { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com/yourhandle', color: '#1DA1F2', orbitRadius: 90, orbitSpeed: 9 },
  { name: 'Slack', icon: FaSlack, url: 'https://yourworkspace.slack.com', color: '#4A154B', orbitRadius: 110, orbitSpeed: 11 },
  { name: 'Reddit', icon: FaRedditAlien, url: 'https://reddit.com/r/yourcommunity', color: '#FF4500', orbitRadius: 95, orbitSpeed: 10.5 },
  { name: 'Discord', icon: FaDiscord, url: 'https://discord.gg/yourserver', color: '#5865F2', orbitRadius: 115, orbitSpeed: 11.5 },
];

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size for confetti
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        toast.success('Message sent! Celebrate!', { duration: 4000 });
        setFormData({ name: '', email: '', message: '' });
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
    <div className="min-h-screen -mt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden font-poppins">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-900 text-white border border-neon-blue' }} />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#3B82F6', '#EC4899', '#F59E0B', '#10B981']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Subtle Circuit Board Background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/circuit-board.svg"
          alt="Circuit Board"
          layout="fill"
          objectFit="cover"
          priority
          className="animate-pulse-slow"
        />
      </div>

      {/* Neon Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="w-32 h-32 bg-neon-blue rounded-full absolute top-10 left-16 opacity-20 blur-2xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="w-48 h-48 bg-neon-pink rounded-full absolute bottom-20 right-24 opacity-20 blur-2xl"
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
          className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink font-inter"
        >
          Reach Out Worldwide
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-neon-blue/30"
          >
            <h2 className="text-3xl font-semibold mb-6 text-neon-blue font-inter">Drop Us a Message</h2>
            <p className="text-sm text-gray-400 mb-6 font-poppins">
              We're fully online, but you can vibe with us in person at MAIT Rohini, Delhi.
            </p>
            <form onSubmit={submitForm} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2 font-poppins">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 font-poppins">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message"
className="block text-sm font-medium text-gray-200 mb-2 font-poppins">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-teal-900 to-teal-900 via-teal-600 cursor-pointer  border border-gray-100/50 rounded-lg font-semibold text-white transition duration-300 hover:from-neon-blue/80 hover:to-neon-pink/80 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } font-inter`}
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
                  } font-poppins`}
                >
                  {result.success ? (
                    <p className="font-semibold">
                      {result.message || 'Message sent! Party time! 🎉'}
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
            className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-neon-pink/30 relative flex flex-col items-center"
          >
            <h2 className="text-3xl font-semibold mb-6 text-neon-pink font-inter">Orbit Our Communities</h2>
            <p className="text-sm text-gray-400 mb-6 font-poppins text-center">
              We're online 24/7. Connect with us across the globe or meet us at MAIT Rohini, Delhi!
            </p>
            <div className="relative w-full h-80 flex items-center justify-center">
              {/* Central Node */}
              <motion.div
                className="absolute w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full flex items-center justify-center text-sm font-semibold font-inter border-2 border-white/20"
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
                    className="absolute top-14 left-1/2 -translate-x-1/2 text-xs font-poppins text-white opacity-0"
                    whileHover={{ opacity: 1, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {handle.name}
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Poppins:wght@400;500;600&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        :root {
          --neon-blue: #3B82F6;
          --neon-pink: #EC4899;
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;