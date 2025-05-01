
"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { Manrope } from "next/font/google";
import Footer from "@/components/footer";
import example1 from "@/../public/ex1.jpg";
import example2 from "@/../public/ex2.jpg";
import example3 from "@/../public/ex3.jpg";
import example4 from "@/../public/ex4.jpg";
import add from "@/../public/add.png";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const Dashboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      draw: () => void;
      update: () => void;
    }[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.2;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})`; // Amber particles
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (canvas && (this.x < 0 || this.x > canvas.width)) this.speedX *= -1;
        if (canvas && (this.y < 0 || this.y > canvas.height)) this.speedY *= -1;
        this.draw();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            particle.speedX += dx * 0.0002;
            particle.speedY += dy * 0.0002;
          }
          particle.update();
        });
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Scroll Animation Hook
  const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
      if (isInView) {
        controls.start({ opacity: 1, y: 0, scale: 1 });
      }
    }, [isInView, controls]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={controls}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className={`${manrope.variable} font-sans relative bg-gray-950 min-h-screen text-white`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-gray-950/80" />

      <div className="relative z-10 p-4 pb-8 max-w-7xl mx-auto">
        {/* Hero Banner */}
        <Section className="mt-4">
          <motion.div
            className="relative bg-gradient-to-r from-gray-600 via-gray-800 to-gray-600 rounded-2xl p-4 shadow-2xl border border-amber-300/30 overflow-hidden"
            whileHover={{ scale: 1.01, rotateX: 3, rotateY: -3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-amber-200 text-center animate-glowText">
              Start NameFrame in Style 🎉
            </h2>
            <p className="text-gray-300 font-light text-center mt-2 animate-floatText">
              Unleash your creativity with exclusive modes, free templates, and futuristic features. Join the revolution now!
            </p>
            <motion.button
              className="mt-4 mx-auto block bg-amber-300 cursor-pointer text-gray-900 rounded-lg px-6 py-2 font-semibold text-sm border border-amber-300/50 transition-all duration-200 hover:bg-amber-400 hover:shadow-lg"
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
            <div className="absolute inset-0 pointer-events-none">
              <svg className="absolute top-0 left-0 w-full h-screen opacity-30">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M10,10 L90,10 L90,90 L10,90 Z"
                  stroke="url(#amberGradient)"
                  strokeWidth="0"
                  fill="none"
                  filter="url(#glow)"
                  className=""
                />
                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
                </linearGradient>
              </svg>
            </div>
          </motion.div>
        </Section>

        {/* Creation Section */}
        <Section className="mt-12 px-5 ">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Create an Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 rounded-md bg-neutral-700 p-4 lg:grid-cols-5 gap-6">
            <Link href="/create">
              <motion.div
                className="relative bg-gradient-to-bl from-teal-100/80 via-teal-600/50 to-teal-300/50 rounded-2xl h-[160px] p-4 flex flex-col  items-center justify-center cursor-pointer border border-amber-300/20"
                whileHover={{ scale: 1.1, rotate: 1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  className=""
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <Image src={add} width={40} className="" height={40} alt="add icon" />
                </motion.div>
                <h3 className="mt-2 font-semibold text-amber-50">Add New Event</h3>
                <div className="absolute inset-0 border-2 border-amber-700 bg-amber-300/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </motion.div>
            </Link>
            {[
              { src: example1, href: "https://www.canva.com/design/DAGkWil_Vyg/wiNDtxxM_xKlQq7UWqlBgw/edit" },
              { src: example2, href: "https://www.canva.com/design/DAGkWmb6UAk/JynLF__USGjcxEUqybwxFQ/edit" },
              { src: example3, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example4, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
            ].map((template, index) => (
              <Link key={index} href={template.href} target="_blank">
                <motion.div
                  className="relative rounded-2xl overflow-hidden  border-2 border-amber-700/50 "
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={template.src}
                    alt="template"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute inset-0 border-2 border-amber-300/50 opacity-0"
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
            {/* <Link href="https://www.canva.com/certificates/templates/" target="_blank">
              <motion.div
                className="relative bg-amber-200 text-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-semibold text-lg">Browse All Templates</h3>
                <motion.svg
                  className="mt-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 50 50"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 12.317 37.683 2 25 2 z M 25 4 C 36.579 4 46 13.421 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 z M 27.570312 10.042969 C 19.819312 10.042969 12.931641 17.229875 12.931641 27.171875 C 12.931641 34.867875 17.326422 39.953125 24.107422 39.953125 C 31.304422 39.953125 35.466797 32.79275 35.466797 30.46875 C 35.466797 29.95475 35.203688 29.71875 34.929688 29.71875 C 34.739688 29.71875 34.572437 29.878516 34.398438 30.228516 C 32.435437 34.208516 29.045094 37.025391 25.121094 37.025391 C 20.584094 37.025391 17.775391 32.929484 17.775391 27.271484 C 17.775391 17.688484 23.114688 12.148438 27.804688 12.148438 C 29.996688 12.148438 31.335938 13.524797 31.335938 15.716797 C 31.335938 18.317797 29.857422 19.695281 29.857422 20.613281 C 29.857422 21.025281 30.113094 21.273438 30.621094 21.273438 C 32.662094 21.273438 35.056641 18.928234 35.056641 15.615234 C 35.056641 12.403234 32.260312 10.042969 27.570312 10.042969 z" />
                </motion.svg>
                <div className="absolute inset-0 bg-cyan-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </motion.div>
            </Link> */}
          </div>
        </Section>

        {/* Recent Events Timeline */}
        <Section className="mt-12 text-white ml-2">
          <div className="flex items-center gap-x-2 mb-4 ">
            <h2 className="text-2xl font-bold text-gray-200">Recent Events</h2>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 50 50"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            >
              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24.984375 6.9863281 A 1.0001 1.0001 0 0 0 24 8 L 24 22.173828 A 3 3 0 0 0 22 25 A 3 3 0 0 0 22.294922 26.291016 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 23.708984 27.705078 A 3 3 0 0 0 25 28 A 3 3 0 0 0 28 25 A 3 3 0 0 0 26 22.175781 L 26 8 A 1.0001 1.0001 0 0 0 24.984375 6.9863281 z" />
            </motion.svg>
          </div>
          <motion.div
            className="grid grid-cols-1  rounded-md bg-neutral-700 p-4 lg:grid-cols-5 gap-6 ml-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {[
              { src: example4, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example2, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example3, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example1, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example4, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example3, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example4, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
              { src: example1, href: "https://www.canva.com/design/DAGkWqAHtkI/_huCVRAQHIrRmUaOTR337g/edit" },
            ].map((event, index) => (
              <Link key={index} href={event.href} target="_blank">
                <motion.div
                  className="relative rounded-2xl overflow-hidden border underline-offset-4 border-gray-800/50"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotateY: 10, boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
                >
                  <Image
                    src={event.src}
                    alt="event"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400/50 opacity-0"
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
