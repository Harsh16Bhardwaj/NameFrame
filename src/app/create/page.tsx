"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Manrope } from "next/font/google";
import ParticipantImport from "@/components/ParticipantImport";
import axios from "axios";
import Tilt from "react-parallax-tilt";

interface FormData {
  title: string;
  certificateTemplate: FileList;
}

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const CertificateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();

  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [uploadedTemplateUrl, setUploadedTemplateUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [imgUploaded, setImageUploaded] = useState<boolean>(false);
  const [error1, setError1] = useState<boolean>(false);

  const certificateFile = watch("certificateTemplate");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation logic
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
    const particleCount = 100;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.draw();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => particle.update());
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (certificateFile && certificateFile[0]) {
      const file = certificateFile[0];
      const fileType = file.type;
      if (fileType === "image/png" || fileType === "image/jpeg") {
        const previewUrl = URL.createObjectURL(file);
        setTemplatePreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
      } else {
        setTemplatePreview(null);
      }
    }
  }, [certificateFile]);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Upload failed");
      if (data.url) setImageUploaded(true);
      return data.url;
    } catch (error) {
      console.error("Error uploading template:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const files = certificateFile;
    if (files && files[0]) {
      try {
        const url = await uploadImageToCloudinary(files[0]);
        setUploadedTemplateUrl(url);
        console.log("Uploaded image URL:", url);
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!uploadedTemplateUrl) {
      setError1(true);
      return;
    }
    try {
      const response = await axios.post("/api/events", {
        title: data.title,
        templateUrl: uploadedTemplateUrl,
      });
      const createdEvent = response.data.data;
      setEventId(createdEvent.id);
      console.log("Event created successfully:", createdEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className={`${manrope.variable} font-sans min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 animate-holo-shift" />
      <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.3} glareColor="#ffffff">
        <div className="relative z-10 w-full max-w-6xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 mb-10 tracking-tight animate-glow">
            Craft a Certificate Session
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-blue-200 mb-2 font-semibold" htmlFor="title">
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your event title"
                  className="w-full p-3 bg-black/50 border border-blue-500/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-gray-500 animate-pulse-border"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-pink-400 text-sm mt-1 animate-fadeIn">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-blue-200 mb-2 font-semibold" htmlFor="certificateTemplate">
                  Certificate Template (PNG/JPG)
                </label>
                <div className="flex gap-x-4 items-center">
                  <input
                    id="certificateTemplate"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    {...register("certificateTemplate", {
                      required: "Certificate template is required",
                      validate: {
                        fileType: (files) =>
                          files && files[0]
                            ? ["image/png", "image/jpeg"].includes(files[0].type) ||
                              "Only PNG or JPG files are allowed"
                            : true,
                      },
                    })}
                  />
                  <label
                    htmlFor="certificateTemplate"
                    className="flex-1 p-3 bg-black/50 border border-blue-500/50 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-blue-900/30 hover:border-blue-400 truncate"
                  >
                    {certificateFile && certificateFile[0]
                      ? certificateFile[0].name
                      : "Select Template"}
                  </label>
                  <button
                    onClick={handleUpload}
                    className="p-3 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full text-white transition-all duration-300 hover:from-blue-700 hover:to-pink-700 hover:scale-110 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUploading}
                  >
                    <FaCloudUploadAlt className="text-xl" />
                  </button>
                </div>
                {errors.certificateTemplate && (
                  <p className="text-pink-400 text-sm mt-1 animate-fadeIn">
                    {errors.certificateTemplate.message}
                  </p>
                )}
                {isUploading && (
                  <p className="text-blue-400 text-sm mt-1 animate-pulse">
                    Uploading template...
                  </p>
                )}
                {uploadedTemplateUrl && !isUploading && (
                  <p className="text-green-400 text-sm mt-1 animate-fadeIn">
                    ✓ Template uploaded successfully
                  </p>
                )}
              </div>

              {eventId && (
                <div className="mt-6 animate-slideIn">
                  <ParticipantImport
                    eventId={eventId}
                    onSuccess={(data) => console.log("Participants imported:", data)}
                  />
                </div>
              )}

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || isUploading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-pink-700 hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Event..." : "Launch Event"}
                </button>
              </div>
            </div>

            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <div className="bg-black/50 backdrop-blur-lg p-6 rounded-xl border border-blue-500/30 transition-all duration-300 hover:shadow-glow">
                {isUploading ? (
                  <div className="h-64 w-full rounded-lg border border-blue-500/50 flex flex-col justify-center items-center animate-pulse">
                    <div className="w-8 h-8 border-4 border-t-4 border-blue-400 rounded-full animate-spin" />
                    <span className="text-blue-200 mt-2">Uploading...</span>
                  </div>
                ) : templatePreview ? (
                  <img
                    src={templatePreview}
                    alt="Certificate Template Preview"
                    className="max-w-full h-auto rounded-lg border border-blue-500/50 transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="h-64 w-full rounded-lg border border-blue-500/50 flex flex-col justify-center items-center bg-black/30">
                    <p className="text-blue-300 text-center">
                      Template Preview <br />
                      <span className="text-lg flex justify-center items-center gap-x-1">
                        <MdErrorOutline />
                        No template selected
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Tilt>
          </div>
        </div>
      </Tilt>

      {error1 && (
        <div className="fixed z-50 inset-0 flex justify-center items-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl p-6 rounded-lg shadow-2xl border border-blue-500/30">
              <div className="flex items-center mb-4 border-b border-blue-500/50">
                <AiOutlineExclamationCircle className="text-pink-500 text-3xl mr-3" />
                <h2 className="text-xl text-white font-semibold">
                  Template Required
                </h2>
              </div>
              <p className="text-blue-200 mb-4">
                Please upload a certificate template before proceeding.
              </p>
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-md transition-all duration-300 hover:from-blue-700 hover:to-pink-700 hover:scale-105 hover:shadow-glow"
                  onClick={() => setError1(false)}
                >
                  Understood
                </button>
              </div>
            </div>
          </Tilt>
        </div>
      )}
    </div>
  );
};

export default CertificateForm;

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes glow {
    0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
    50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(59, 130, 246, 0.5); }
    100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  }
  @keyframes holoShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes pulseBorder {
    0% { border-color: rgba(59, 130, 246, 0.5); }
    50% { border-color: rgba(59, 130, 246, 1); }
    100% { border-color: rgba(59, 130, 246, 0.5); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  .animate-slideIn {
    animation: slideIn 0.6s ease-out;
  }
  .animate-glow {
    animation: glow 3s infinite ease-in-out;
  }
  .animate-holo-shift {
    background-size: 200% 200%;
    animation: holoShift 10s ease-in-out infinite;
  }
  .animate-pulse-border {
    animation: pulseBorder 2s infinite ease-in-out;
  }
  .shadow-glow {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
  }
  .hover\:shadow-glow:hover {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
  }
`}</style>