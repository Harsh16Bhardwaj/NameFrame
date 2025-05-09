'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Starfield animation
    const canvas = document.getElementById('starfield') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star properties
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const starCount = 200;

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      {/* Starfield Background */}
      <canvas className="absolute inset-0 z-0" id="starfield"></canvas>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/30 shadow-lg z-10 text-center"
      >
        {/* NyayVaad Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100  flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-[var(--bluey)]" />
            NameFrame
          </h1>
          <p className="text-gray-400 text-sm mt-1">Wait Wait Wait.. This one is a classic</p>
        </div>

        {/* 404 Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-6xl font-bold text-[var(--bluey1)]">404</h2>
          <h3 className="text-2xl font-semibold text-gray-100">Page Not Found</h3>
          <p className="text-gray-400">
            The page you're looking for seems to have vanished in the names.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--love)] text-white hover:bg-[var(--love-text)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 