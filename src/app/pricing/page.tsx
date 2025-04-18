'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import Image from 'next/image';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface PricingTier {
  name: string;
  price: string;
  events: string;
  participants: string;
  customizedMails: boolean;
  modes: string;
  color: string;
  buyLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0/mo',
    events: '1 event',
    participants: '100 max',
    customizedMails: false,
    modes: '1 mode',
    color: '#6B7280',
    buyLink: '/signup/free',
  },
  {
    name: 'Pro',
    price: '$29/mo',
    events: '10 events/month',
    participants: '150 max',
    customizedMails: true,
    modes: '2 modes',
    color: '#3B82F6',
    buyLink: '/signup/pro',
  },
  {
    name: 'Premium',
    price: '$79/mo',
    events: '20 events/month',
    participants: '200 max',
    customizedMails: true,
    modes: 'All modes',
    color: '#EC4899',
    buyLink: '/signup/premium',
  },
];

const PricingPage = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Set window size for confetti
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleBuyClick = (tier: string) => {
    setShowConfetti(true);
    toast.success(`Selected ${tier} plan! Redirecting...`, { duration: 4000 });
    setTimeout(() => setShowConfetti(false), 3000);
    // In production, redirect to buyLink or trigger payment flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden font-poppins">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-900 text-white border border-neon-blue' }} />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#3B82F6', '#EC4899', '#F59E0B', '#10B981']}
          numberOfPieces={150}
          recycle={false}
        />
      )}

      {/* Circuit Board Background */}
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
          Choose Your Plan
        </motion.h1>
        <p className="text-center text-gray-400 mb-12 font-poppins max-w-2xl mx-auto">
          Unlock the power of seamless event management with our tailored plans. From free to premium, we've got you covered.
        </p>

        {/* Desktop Table View */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-neon-blue/30 overflow-hidden"
        >
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-6 font-inter text-gray-400"></th>
                {pricingTiers.map((tier) => (
                  <th key={tier.name} className="p-6 text-center">
                    <h3 className="text-2xl font-semibold font-inter" style={{ color: tier.color }}>
                      {tier.name}
                    </h3>
                    <p className="text-xl font-bold mt-2 font-inter">{tier.price}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700/50">
                <td className="p-6 font-poppins text-gray-200">Number of Events</td>
                {pricingTiers.map((tier) => (
                  <td key={tier.name} className="p-6 text-center font-poppins text-white">
                    {tier.events}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700/50">
                <td className="p-6 font-poppins text-gray-200">Max Participants</td>
                {pricingTiers.map((tier) => (
                  <td key={tier.name} className="p-6 text-center font-poppins text-white">
                    {tier.participants}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700/50">
                <td className="p-6 font-poppins text-gray-200">Customized Mails</td>
                {pricingTiers.map((tier) => (
                  <td key={tier.name} className="p-6 text-center">
                    {tier.customizedMails ? (
                      <FaCheck className="inline-block text-green-400 text-xl" />
                    ) : (
                      <FaTimes className="inline-block text-red-400 text-xl" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700/50">
                <td className="p-6 font-poppins text-gray-200">Modes of Mail</td>
                {pricingTiers.map((tier) => (
                  <td key={tier.name} className="p-6 text-center font-poppins text-white">
                    {tier.modes}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700/50">
                <td className="p-6"></td>
                {pricingTiers.map((tier) => (
                  <td key={tier.name} className="p-6 text-center">
                    <motion.a
                      href={tier.buyLink}
                      onClick={() => handleBuyClick(tier.name)}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${tier.color}80` }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-pink rounded-lg font-semibold text-white font-inter transition duration-300"
                      style={{ background: `linear-gradient(to right, ${tier.color}, ${tier.color}CC)` }}
                    >
                      Buy Now
                    </motion.a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-8">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * pricingTiers.indexOf(tier) }}
              className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-neon-blue/30"
            >
              <h3 className="text-2xl font-semibold font-inter text-center mb-4" style={{ color: tier.color }}>
                {tier.name}
              </h3>
              <p className="text-xl font-bold text-center mb-6 font-inter">{tier.price}</p>
              <ul className="space-y-4">
                <li className="flex justify-between font-poppins text-gray-200">
                  <span>Number of Events</span>
                  <span>{tier.events}</span>
                </li>
                <li className="flex justify-between font-poppins text-gray-200">
                  <span>Max Participants</span>
                  <span>{tier.participants}</span>
                </li>
                <li className="flex justify-between font-poppins text-gray-200">
                  <span>Customized Mails</span>
                  {tier.customizedMails ? (
                    <FaCheck className="text-green-400 text-xl" />
                  ) : (
                    <FaTimes className="text-red-400 text-xl" />
                  )}
                </li>
                <li className="flex justify-between font-poppins text-gray-200">
                  <span>Modes of Mail</span>
                  <span>{tier.modes}</span>
                </li>
              </ul>
              <motion.a
                href={tier.buyLink}
                onClick={() => handleBuyClick(tier.name)}
                whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${tier.color}80` }}
                whileTap={{ scale: 0.95 }}
                className="block mt-6 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-pink rounded-lg font-semibold text-white font-inter text-center transition duration-300"
                style={{ background: `linear-gradient(to right, ${tier.color}, ${tier.color}CC)` }}
              >
                Buy Now
              </motion.a>
            </motion.div>
          ))}
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

export default PricingPage;