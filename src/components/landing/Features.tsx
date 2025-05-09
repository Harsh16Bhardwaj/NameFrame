"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Award, Mail } from "lucide-react";
import { MorphingText } from "@/components/magicui/morphing-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Cookie, Josefin_Sans, Dancing_Script, Pacifico, Merienda, Leckerli_One, Just_Another_Hand, Titan_One, Delius } from "next/font/google";

export const cookieFont = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export const josefinFont = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-josefin",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dancing-script",
});

export const delius = Delius({
  weight: "400",
  subsets: ["latin"],
});

export const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const merienda = Merienda({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-merienda",
});

export const leckerliOne = Leckerli_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-leckerli-one",
});

export const justAnotherHand = Just_Another_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-just-another-hand",
});

export const Features: React.FC = () => {
  return (
    <motion.section
      className="py-16 sm:py-24 darkOnyx"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container mx-auto px-4 max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h4
            className={`${justAnotherHand.className} text-2xl sm:text-3xl md:text-4xl text-gray-200 font-bold mt-8 sm:mt-10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MorphingText
              texts={[
                "Powerful Features",
                "Simple Interface",
                "Fully Automated",
              ]}
            />
          </motion.h4>
          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Everything you need to create, manage, and distribute professional certificates for any events.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Feature 1 */}
          <AnimatePresence>
            <CardSpotlight className="hover:scale-103 mx-4 md:mx-0 ease-in-out duration-300 hover:ease-in-out hover:duration-300">
              <motion.div
                className="bg-transparent cursor-pointer relative z-30 p-6 h-72 md:h-80 rounded-xl border border-gray-700 hover:border-violet-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)",
                }}
              >
                <motion.div
                  className="w-full flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
                    <Upload className="text-violet-400" />
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl sm:text-2xl text-center font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Bulk Upload
                </motion.h3>
                <motion.p
                  className="text-sm sm:text-base text-gray-400 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  Upload hundreds of participant names at once via CSV or Excel. No more creating each certificate manually.
                </motion.p>
                <motion.p
                  className={`absolute text-sm sm:text-base bottom-4 text-teal-600 text-center ${delius.className}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  Ensure Proper formats Please :D
                </motion.p>
              </motion.div>
            </CardSpotlight>
          </AnimatePresence>

          {/* Feature 2 */}
          <AnimatePresence>
            <CardSpotlight className="hover:scale-103 mx-4 md:mx-0 ease-in-out duration-300 hover:ease-in-out hover:duration-300">
              <motion.div
                className="bg-transparent cursor-pointer relative z-30 p-6 h-72 md:h-80 rounded-xl border border-gray-700 hover:border-violet-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)",
                }}
              >
                <motion.div
                  className="w-full flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
                    <Award className="text-violet-400" />
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl sm:text-2xl font-bold text-center mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  Visual Designer
                </motion.h3>
                <motion.p
                  className="text-sm sm:text-base text-gray-400 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  Drag-and-drop interface to position names perfectly on your certificates. No design skills required. Fast AF
                </motion.p>
                <motion.p
                  className={`absolute text-sm sm:text-base bottom-4 text-pink-700 text-center ${delius.className}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Be Creative With Canva Though...
                </motion.p>
              </motion.div>
            </CardSpotlight>
          </AnimatePresence>

          {/* Feature 3 */}
          <AnimatePresence>
            <CardSpotlight className="hover:scale-103 md:mx-0 mx-4 ease-in-out duration-300 hover:ease-in-out hover:duration-300">
              <motion.div
                className="bg-transparent cursor-pointer relative z-30 p-6 h-72 md:h-80 rounded-xl border border-gray-700 hover:border-violet-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -15px rgba(124, 58, 237, 0.3)",
                }}
              >
                <motion.div
                  className="w-full flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
                    <Mail className="text-violet-400" />
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl sm:text-2xl font-bold text-center mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  Automated Delivery
                </motion.h3>
                <motion.p
                  className="text-sm sm:text-base text-gray-400 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  Send certificates directly to participants via email with customized messages and monitor each mail with 'One' Click.
                </motion.p>
                <motion.p
                  className={`absolute text-sm sm:text-base bottom-4 text-yellow-600 text-center ${delius.className}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  Click the Send buttons only once :)
                </motion.p>
              </motion.div>
            </CardSpotlight>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Features;