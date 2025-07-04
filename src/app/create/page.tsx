"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Manrope } from "next/font/google";
import { Calendar, Loader2, Move, Package } from "lucide-react";
import { SignIn } from "@clerk/nextjs";
import ParticipantImport from "@/components/ParticipantImport";
import TemplateModal from "@/components/TemplateModal";
import axios from "axios";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";
import ProtectedPage from "@/components/protectedPage";

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
  const { isLoaded, userId } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>();

  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [uploadedTemplateUrl, setUploadedTemplateUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [imgUploaded, setImageUploaded] = useState<boolean>(false);
  const [error1, setError1] = useState<boolean>(false);
  const [showUploadError, setShowUploadError] = useState<boolean>(false);
  const [eventCreated, setEventCreated] = useState<boolean>(false);
  const [participantsImported, setParticipantsImported] =
    useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 15,
  });
  const [templateSelectionMode, setTemplateSelectionMode] = useState<'upload' | 'library'>('upload');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const certificateFile = watch("certificateTemplate");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

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
    const particleCount = 10;

    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      opacity: number = 0;

      constructor() {
        if (!canvas) return;
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
        if (!canvas) return;
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
    if (!files || !files[0]) {
      setShowUploadError(true);
      return;
    }
    try {
      const url = await uploadImageToCloudinary(files[0]);
      setUploadedTemplateUrl(url);
      console.log("Uploaded image URL:", url);
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - textPosition.x,
      y: e.clientY - textPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current) return;

    const previewRect = previewRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - dragStart.x) / previewRect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - dragStart.y) / previewRect.height) * 100)
    );

    setTextPosition((prev) => ({
      ...prev,
      x,
      y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!uploadedTemplateUrl) {
      setError1(true);
      return;
    }
    try {
      const response = await axios.post("/api/events", {
        title: data.title,
        templateUrl: uploadedTemplateUrl,
        textPosition: {
          x: textPosition.x,
          y: textPosition.y,
          width: textPosition.width,
          height: textPosition.height,
        },
      });
      const createdEvent = response.data.data;
      setEventId(createdEvent.id);
      setEventCreated(true);
      console.log("Event created successfully:", createdEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };
  const handleGoToDashboard = () => {
    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  };
  const handleTemplateFromLibrary = (templateUrl: string) => {
    setUploadedTemplateUrl(templateUrl);
    setTemplatePreview(templateUrl);
    setImageUploaded(true);
    setError1(false);
    setTemplateSelectionMode('library');
  };

  return (
    <ProtectedPage>
      <>
        <div
          className={`${manrope.variable} font-sans min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6 pt-[10rem]`}
        >
          <canvas
            ref={canvasRef}
            className="absolute  inset-0 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bg-[var(--tealy)] via-purple-900/30 to-bg-[var(--tealy)] animate-holo-shift" />
          <div className="relative -mt-10 z-10 w-full max-w-6xl bg-gradient-to-br from-gray-900/20  to-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-400/60">
            <div className="w-full flex justify-between">
              <h2 className="text-4xl text-center underline-offset-8 unerline- decoration-white decoration-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-neutral-300 mb-10 tracking-tight animate-glow">
                Craft a Certificate Session
              </h2>
              <div className="flex flex-col gap-y-2">
                <h3 className="font-bold ">Download the Content for Quick Trial !</h3>
                <div className="flex gap-x-2 justify-end">

                <a href="https://res.cloudinary.com/dimoa9ymu/raw/upload/v1746895170/participants_2_k7owmj.xlsx"><button className="px-3 py-1 bg-[var(--love)] rounded-md cursor-pointer hover:scale-103 hover:bg-[var(--love-text)] font-semibold duration-200 ease-in-out">Excel File</button></a>
<button
  className="px-3 py-1 bg-[var(--pale)] rounded-md cursor-pointer hover:scale-103 hover:bg-[var(--pale)] text-black duration-200 font-semibold ease-in-out"
  onClick={async () => {
    const url = "https://res.cloudinary.com/dimoa9ymu/image/upload/v1746895169/certi_u38ffm.png";
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "certificate.png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again or check the image URL.");
    }
  }}
>
  Certificate
</button>                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label
                    className="flex gap-x-2 text-lg text-blue-200 mb-2 font-semibold"
                    htmlFor="title"
                  >
                    <Calendar></Calendar>
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
                </div>                <div>
                  <label className="text-blue-200 flex gap-x-2 mb-4 font-semibold">
                    <Package />
                    Certificate Template
                  </label>
                  
                  {/* Template Selection Options */}
                  <div className="flex mb-6 bg-black/30 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105"
                    >
                      📚 Browse Template Library
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateSelectionMode('upload')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ml-2 ${
                        templateSelectionMode === 'upload'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      ⬆️ Upload Custom
                    </button>
                  </div>

                  {/* Show selected template from library */}
                  {uploadedTemplateUrl && templateSelectionMode === 'library' && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 font-medium">Template selected from library</span>
                        <button
                          type="button"
                          onClick={() => setIsTemplateModalOpen(true)}
                          className="ml-auto text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          Change Template
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Custom Upload Section */}
                  {templateSelectionMode === 'upload' && (
                    <div className="flex gap-x-4 items-center">
                      <input
                        id="certificateTemplate"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        {...register("certificateTemplate", {
                          required: templateSelectionMode === 'upload' && !uploadedTemplateUrl ? "Certificate template is required" : false,
                          validate: {
                            fileType: (files) =>
                              files && files[0]
                                ? ["image/png", "image/jpeg"].includes(files[0].type) || "Only PNG or JPG files are allowed"
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
                          : "Select Template File"}
                      </label>
                      <button
                        type="button"
                        onClick={handleUpload}
                        className="p-3 bg-gradient-to-br from-blue-600 to-purple-900 rounded-full text-white transition-all duration-300 hover:from-blue-900 hover:to-purple-950 hover:scale-110 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUploading}
                      >
                        <FaCloudUploadAlt className="text-xl" />
                      </button>
                    </div>
                  )}
                  
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
                      ✓ Template ready for use
                    </p>
                  )}
                </div>

                {eventId && (
                  <div className="mt-6 animate-slideIn">
                    <ParticipantImport
                      eventId={eventId}
                      onSuccess={(data) => {
                        console.log("Participants imported:", data);
                        setParticipantsImported(true);
                      }}
                    />
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    onClick={
                      participantsImported
                        ? handleGoToDashboard
                        : handleSubmit(onSubmit)
                    }
                    disabled={isSubmitting || isUploading}
                    className="w-2/5 py-3 px-2 text-xs md:text-lg bg-gradient-to-r cursor-pointer from-[#136a8a]  to-blue-950 text-white rounded-lg font-semibold transition-all duration-300 hover:from-[#0c475c] hover:to-[#06202a] hover:scale-105 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {eventCreated
                      ? participantsImported
                        ? "Go to Event"
                        : "Import Participants"
                      : isSubmitting
                        ? "Creating Event..."
                        : "Create Event"}
                  </button>
                </div>
              </div>

              <div className="bg-[#1f1d36] rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Template Preview
                </h3>
                {templatePreview ? (
                  <div
                    ref={previewRef}
                    className="relative w-full aspect-[1.414/1] bg-white rounded-lg overflow-hidden"
                    onMouseMove={handleMouseMove}
                  >
                    <img
                      src={templatePreview}
                      alt="Certificate template"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[1.414/1] bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">
                      Upload a template to preview
                    </p>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-400">
                  <p>• Make sure the template is in the correct format 4:3</p>
                </div>
              </div>
            </div>
          </div>

          {error1 && (
            <div className="fixed z-50 inset-0 flex justify-center items-center bg-black/80 backdrop-blur-md animate-fadeIn">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
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

          {showUploadError && (
            <div className="fixed z-50 inset-0 flex justify-center items-center bg-black/80 backdrop-blur-md animate-fadeIn">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
                <div className="w-full max-w-md bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl p-6 rounded-lg shadow-2xl border border-blue-500/30">
                  <div className="flex items-center mb-4 border-b border-blue-500/50">
                    <AiOutlineExclamationCircle className="text-pink-500 text-3xl mr-3" />
                    <h2 className="text-xl text-white font-semibold">
                      No File Selected
                    </h2>
                  </div>
                  <p className="text-blue-200 mb-4">
                    Please select a certificate template file before uploading.
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-md transition-all duration-300 hover:from-blue-700 hover:to-pink-700 hover:scale-105 hover:shadow-glow"
                      onClick={() => setShowUploadError(false)}
                    >
                      Okay
                    </button>
                  </div>
                </div>
              </Tilt>
            </div>          )}
        </div>

        {/* Template Selection Modal */}
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onTemplateSelect={handleTemplateFromLibrary}
          selectedTemplate={uploadedTemplateUrl}
        />
      </>
    </ProtectedPage>
  );
};

export default CertificateForm;

<style jsx global>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes glow {
    0% {
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
    50% {
      text-shadow:
        0 0 20px rgba(255, 255, 255, 0.8),
        0 0 30px rgba(59, 130, 246, 0.5);
    }
    100% {
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  }
  @keyframes holoShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes pulseBorder {
    0% {
      border-color: rgba(59, 130, 246, 0.5);
    }
    50% {
      border-color: rgba(59, 130, 246, 1);
    }
    100% {
      border-color: rgba(59, 130, 246, 0.5);
    }
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
    box-shadow:
      0 0 15px rgba(59, 130, 246, 0.5),
      0 0 30px rgba(236, 72, 153, 0.3);
  }
  .hover\:shadow-glow:hover {
    box-shadow:
      0 0 15px rgba(59, 130, 246, 0.5),
      0 0 30px rgba(236, 72, 153, 0.3);
  }
`}</style>;
