import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes NameFrame different from other certificate platforms?",
    answer:
      "Unlike simple PDF generators, NameFrame integrates AI-powered insights to help you understand your audience and optimize future events. Our platform automates the entire process from creation to distribution, saving you significant time and effort."
  },
  {
    question: "How secure is my data on NameFrame?",
    answer:
      "We prioritize your data security with end-to-end encryption and robust access controls. Your event data and recipient information are handled with the utmost confidentiality, ensuring a safe and secure experience."
  },
  {
    question: "Can I use my own certificate designs?",
    answer:
      "Yes, you can! NameFrame allows you to upload your own design templates. Our platform seamlessly integrates your custom designs, enabling you to maintain your brand's unique identity while leveraging our automation features."
  },
  {
    question: "What kind of events is NameFrame best for?",
    answer:
      "NameFrame is versatile and can be used for a wide range of events, including professional workshops, online courses, corporate training sessions, and virtual conferences. Our platform adapts to your needs, regardless of event size or type."
  },
  {
    question: "Do you offer a free trial or a free tier?",
    answer:
      "Yes, we offer a free tier that allows you to create and send a limited number of certificates to explore the platform's core features. This is a great way to test NameFrame before committing to a premium plan."
  },
  {
    question: "What if I need help getting started?",
    answer:
      "Our dedicated support team is here to help! We offer comprehensive documentation, video tutorials, and direct support to ensure a smooth onboarding process. You can reach out to us at any time via the 'Contact Support' button below."
  }
];

export const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index:any) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <motion.section
      className="py-16 sm:py-24 bg-gradient-to-b from-[#111] via-[#141414] to-[#111] text-[#D3D3D3] font-sans relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 🔹 Subtle Accent Shape */}
      <motion.div
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-r from-[#4eb3a3] to-[#4C72B0] opacity-5 blur-3xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* 🔹 Content container */}
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#FFFFFF] relative inline-block">
            <span className="relative z-10">Frequently Asked Questions</span>
            <motion.span
              className="absolute bottom-1 left-0 h-3 w-full bg-gradient-to-r from-[#4eb3a3]/20 to-[#4C72B0]/20 -z-10 rounded-lg"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h2>
          <motion.p
            className="text-[#A9A9A9] text-md md:text-lg mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Everything you need to know about NameFrame.
          </motion.p>
        </motion.div>

        {/* 🔹 FAQ list */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`relative rounded-xl border-2 ${
                expandedFaq === index ? "border-[#4eb3a3]" : "border-transparent"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(31, 31, 31, 0.85) 0%, rgba(42, 42, 42, 0.85) 100%)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: expandedFaq === index ? 1.02 : 1,
                boxShadow:
                  expandedFaq === index
                    ? "0 8px 30px rgba(78, 179, 163, 0.15)"
                    : "0 2px 8px rgba(0, 0, 0, 0.2)"
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                delay: index * 0.05
              }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
            >
              <button
                className="w-full p-6 flex justify-between items-start text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <motion.span
                  className={`font-semibold text-sm md:text-md mr-4 ${
                    expandedFaq === index ? "text-[#4eb3a3]" : ""
                  }`}
                  animate={{
                    color: expandedFaq === index ? "#4eb3a3" : ""
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.question}
                </motion.span>
                <motion.div
                  initial={false}
                  animate={{
                    rotate: expandedFaq === index ? 180 : 0,
                    scale: expandedFaq === index ? 1.1 : 1
                  }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  {expandedFaq === index ? (
                    <ChevronUp className="flex-shrink-0 h-5 w-5 text-[#4eb3a3]" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 h-5 w-5 text-[#A9A9A9]" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: {
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98]
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.15
                        }
                      }
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: {
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98]
                        },
                        opacity: { duration: 0.25 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-6 pt-0 text-xs md:text-sm text-[#D3D3D3] border-t border-[#2A2A2A]"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* 🔹 Contact section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-[#FFFFFF]">
            Still have questions?
          </h3>
          <p className="text-[#A9A9A9] mb-6">
            Can't find the answer you're looking for? Feel free to reach out to
            our team.
          </p>
          <a href="/contact">
            <motion.button
              className="px-6 py-3 bg-transparent border-2 border-[#4eb3a3] text-[#4eb3a3] rounded-xl font-medium hover:bg-[#4eb3a3] hover:text-[#1F1F1F] transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(78, 179, 163, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
            </motion.button>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FAQ;
