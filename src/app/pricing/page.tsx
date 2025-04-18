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
  glowColor: string;
  buyLink: string;
}

interface Feature {
  name: string;
  key: keyof PricingTier;
}

const features: Feature[] = [
  { name: 'Events', key: 'events' },
  { name: 'Participants', key: 'participants' },
  { name: 'Custom Mails', key: 'customizedMails' },
  { name: 'Mail Modes', key: 'modes' },
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0/mo',
    events: '1',
    participants: '100',
    customizedMails: false,
    modes: '1',
    gradient: 'from-neon-gray to-neon-dark',
    glowColor: '#6B7280',
    buyLink: '/signup/free',
  },
  {
    name: 'Pro',
    price: '$29/mo',
    events: '10/mo',
    participants: '150',
    customizedMails: true,
    modes: '2',
    gradient: 'from-neon-blue to-neon-cyan',
    glowColor: '#3B82F6',
    buyLink: '/signup/pro',
  },
  {
    name: 'Premium',
    price: '$79/mo',
    events: '20/mo',
    participants: '200',
    customizedMails: true,
    modes: 'All',
    gradient: 'from-neon-pink to-neon-purple',
    glowColor: '#EC4899',
    buyLink: '/signup/premium',
  },
];

const PricingPage: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Window size for confetti
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Subdued particle animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        interface Particle {
          x: number;
          y: number;
          vx: number;
          vy: number;
          size: number;
          color: string;
          glow: number;
        }

        const particles: Particle[] = [];
        const colors = ['#3B82F6', '#EC4899', '#22D3EE', '#A855F7'];
        for (let i = 0; i < 80; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            glow: Math.random() * 5 + 3,
          });
        }

        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };
        canvas.addEventListener('mousemove', handleMouseMove);

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
            if (dist < 150) {
              p.vx += dx * 0.02;
              p.vy += dy * 0.02;
              p.size = Math.min(p.size + 0.1, 4);
              p.glow = Math.min(p.glow + 2, 8);
            } else {
              p.size = Math.max(p.size - 0.05, 1);
              p.glow = Math.max(p.glow - 0.5, 3);
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.glow;
            ctx.shadowColor = p.color;
            ctx.fill();
          });

          particles.forEach((p1, i) => {
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - dist / 160})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });

          requestAnimationFrame(animate);
        };
        animate();
      }
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleBuyClick = (tier: string) => {
    setShowConfetti(true);
    toast.success(`Locked in ${tier}! Time to shine!`, { duration: 4000 });
    setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-poppins">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-900/90 text-white border border-neon-blue/60 backdrop-blur-lg' }} />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#3B82F6', '#EC4899', '#22D3EE', '#A855F7', '#F59E0B', '#10B981']}
          numberOfPieces={300}
          recycle={false}
          tweenDuration={5000}
        />
      )}

      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50 pointer-events-auto" />

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="text-5xl md:text-7xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-pink font-inter"
        >
          Plans That Pop
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
          className="text-center text-gray-100 mb-12 font-poppins max-w-md mx-auto text-xl tracking-wide"
        >
          Pick a plan and make your events the talk of the galaxy.
        </motion.p>

        {/* Desktop Grid Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
          className="hidden lg:block bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-2xl rounded-2xl border border-neon-cyan/40 shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-4">
            {/* Feature Column */}
            <div className="border-r border-neon-cyan/20">
              <div className="p-6 bg-gradient-to-b from-neon-cyan/20 to-transparent">
                <h3 className="text-2xl font-bold font-inter bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-blue">
                  Features
                </h3>
              </div>
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="p-6 border-t border-neon-cyan/20 font-poppins text-gray-100 text-base font-semibold"
                >
                  {feature.name}
                </motion.div>
              ))}
              <div className="p-6 border-t border-neon-cyan/20"></div>
            </div>

            {/* Pricing Tiers */}
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.name}
                onMouseEnter={() => setHoveredColumn(index)}
                onMouseLeave={() => setHoveredColumn(null)}
                className="relative"
              >
                {/* Neon Glow Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow:
                      hoveredColumn === index
                        ? `0 0 40px ${tier.glowColor}80`
                        : `0 0 8px ${tier.glowColor}20`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                <div className="relative z-10">
                  <div className="p-6 bg-gradient-to-b from-black/50 to-transparent border-t border-neon-cyan/20">
                    <h3 className="text-xl font-extrabold font-inter text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-neon-cyan">
                      {tier.name}
                    </h3>
                    <p className="text-3xl font-black text-center font-inter bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-purple">
                      {tier.price}
                    </p>
                  </div>
                  {features.map((feature) => (
                    <motion.div
                      key={feature.name}
                      whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="p-6 border-t border-neon-cyan/20 flex justify-center items-center font-poppins text-gray-100 text-base font-semibold"
                    >
                      {feature.key === 'customizedMails' ? (
                        tier[feature.key] ? (
                          <motion.div
                            animate={{ scale: hoveredColumn === index ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.8, repeat: hoveredColumn === index ? Infinity : 0, ease: 'easeInOut' }}
                          >
                            <FaCheck className="text-neon-cyan text-xl" />
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={{ scale: hoveredColumn === index ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.8, repeat: hoveredColumn === index ? Infinity : 0, ease: 'easeInOut' }}
                          >
                            <FaTimes className="text-neon-pink text-xl" />
                          </motion.div>
                        )
                      ) : (
                        <motion.span
                          animate={{ y: hoveredColumn === index ? [0, -2, 0] : 0 }}
                          transition={{ duration: 0.6, repeat: hoveredColumn === index ? Infinity : 0, ease: 'easeInOut' }}
                          className="text-white"
                        >
                          {tier[feature.key]}
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                  <div className="p-6 border-t border-neon-cyan/20 flex justify-center">
                    <motion.a
                      href={tier.buyLink}
                      onClick={() => handleBuyClick(tier.name)}
                      whileHover={{ scale: 1.15, boxShadow: `0 0 25px ${tier.glowColor}CC` }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className={`px-6 py-3 bg-gradient-to-r ${tier.gradient} from-neutral-900  text-teal-600 to-neutral-900 via-neutral-800 rounded-lg font-extrabold  font-inter text-sm transition duration-300 shadow-lg hover:shadow-2xl`}
                    >
                      Buy Now
                    </motion.a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: index * 0.3, ease: 'easeInOut' }}
              className="bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-2xl rounded-2xl border border-neon-cyan/40 p-6 shadow-2xl"
            >
              <h3 className="text-xl font-extrabold font-inter text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neon-cyan">
                {tier.name}
              </h3>
              <p className="text-3xl font-black text-center mb-6 font-inter bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-purple">
                {tier.price}
              </p>
              <ul className="space-y-4 mb-6">
                {features.map((feature) => (
                  <li key={feature.name} className="flex justify-between font-poppins text-gray-100 text-sm font-semibold">
                    <span>{feature.name}</span>
                    {feature.key === 'customizedMails' ? (
                      tier[feature.key] ? (
                        <FaCheck className="text-neon-cyan text-lg" />
                      ) : (
                        <FaTimes className="text-neon-pink text-lg" />
                      )
                    ) : (
                      <span className="text-white">{tier[feature.key]}</span>
                    )}
                  </li>
                ))}
              </ul>
              <motion.a
                href={tier.buyLink}
                onClick={() => handleBuyClick(tier.name)}
                whileHover={{ scale: 1.15, boxShadow: `0 0 25px ${tier.glowColor}CC` }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`block px-6 py-3 bg-gradient-to-r ${tier.gradient} rounded-lg font-bold text-white font-inter text-center text-sm transition duration-300 shadow-lg hover:shadow-2xl`}
              >
                Buy Now
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Poppins:wght@400;600;700&display=swap');

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
          --neon-gray: #6B7280;
          --neon-dark: #1F2937;
        }
      `}</style>
    </div>
  );
};

export default PricingPage;