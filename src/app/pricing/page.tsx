'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface PricingTier {
  name: string;
  price: string;
  events: string;
  participants: string;
  customizedMails: boolean;
  modes: string;
  gradient: string;
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
    gradient: 'from-gray-700 to-gray-900',
    buyLink: '/signup/free',
  },
  {
    name: 'Pro',
    price: '$29/mo',
    events: '10 events/month',
    participants: '150 max',
    customizedMails: true,
    modes: '2 modes',
    gradient: 'from-neon-blue to-neon-cyan',
    buyLink: '/signup/pro',
  },
  {
    name: 'Premium',
    price: '$79/mo',
    events: '20 events/month',
    participants: '200 max',
    customizedMails: true,
    modes: 'All modes',
    gradient: 'from-neon-pink to-neon-purple',
    buyLink: '/signup/premium',
  },
];

const PricingPage = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Set window size for confetti
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Particle animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
      const colors = ['#3B82F6', '#EC4899', '#22D3EE', '#A855F7'];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      let mouseX = 0;
      let mouseY = 0;
      canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.vx += dx * 0.01;
            p.vy += dy * 0.01;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        particles.forEach((p1, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 50})`;
              ctx.stroke();
            }
          }
        });

        requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const handleBuyClick = (tier: string) => {
    setShowConfetti(true);
    toast.success(`Selected ${tier} plan! Redirecting...`, { duration: 4000 });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-poppins">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-900/80 text-white border border-neon-blue/50 backdrop-blur-md' }} />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#3B82F6', '#EC4899', '#22D3EE', '#A855F7', '#F59E0B', '#10B981']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30 pointer-events-auto" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink font-inter"
        >
          Unlock Your Event Potential
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-gray-300 mb-12 font-poppins max-w-2xl mx-auto text-lg"
        >
          Choose a plan that powers your events with seamless management and cutting-edge features.
        </motion.p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              whileHover={{ scale: 1.05, rotateY: 5, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)' }}
              className={`relative bg-gradient-to-b ${tier.gradient} bg-opacity-20 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 overflow-hidden`}
            >
              {/* Holographic Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
                animate={{ x: ['-100%', '100%'], opacity: [0, 0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              {/* Glassmorphic Overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold font-inter text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                  {tier.name}
                </h3>
                <p className="text-5xl font-extrabold text-center mb-6 font-inter bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                  {tier.price}
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center justify-between font-poppins text-gray-200">
                    <span>Number of Events</span>
                    <span className="font-semibold text-white">{tier.events}</span>
                  </li>
                  <li className="flex items-center justify-between font-poppins text-gray-200">
                    <span>Max Participants</span>
                    <span className="font-semibold text-white">{tier.participants}</span>
                  </li>
                  <li className="flex items-center justify-between font-poppins text-gray-200">
                    <span>Customized Mails</span>
                    {tier.customizedMails ? (
                      <FaCheck className="text-neon-cyan text-xl" />
                    ) : (
                      <FaTimes className="text-neon-pink text-xl" />
                    )}
                  </li>
                  <li className="flex items-center justify-between font-poppins text-gray-200">
                    <span>Modes of Mail</span>
                    <span className="font-semibold text-white">{tier.modes}</span>
                  </li>
                </ul>
                <motion.a
                  href={tier.buyLink}
                  onClick={() => handleBuyClick(tier.name)}
                  whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${tier.gradient.split(' ')[0]}80` }}
                  whileTap={{ scale: 0.95 }}
                  className={`block px-8 py-4 bg-gradient-to-r ${tier.gradient} rounded-lg font-semibold text-white font-inter text-center transition duration-300 shadow-lg`}
                >
                  Buy Now
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
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
          --neon-cyan: #22D3EE;
          --neon-purple: #A855F7;
        }
      `}</style>
    </div>
  );
};

export default PricingPage;