"use client";
import React, { useRef, useState, useEffect } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";
import NameHeading from "@/../public/NameFrame.png";
import NameLogo from "@/../public/nameframelogo.png";
import { Style_Script } from "next/font/google";
const styleScript = Style_Script({ subsets: ["latin"], weight: "400" });

interface FormData {
  name: string;
}

//Improvments:
//Add a add your own event now button
//Improve the event displaying details
//fix the layout thing


interface EventData {
  eventTitle: string;
  templateUrl: string;
  participants: string[];
  eventDate: string;
  organizer: string;
  description: string;
}

const MOCK_EVENT: EventData = {
  eventTitle: "Web Development Bootcamp 2024",
  templateUrl:
    "https://res.cloudinary.com/dikc4f9ip/image/upload/v1744622095/Blue_Minimalist_Certificate_Of_Achievement_1_o5clcd.png",
  participants: [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Williams",
    "Charlie Brown",
    "Emma Watson",
    "Michael Scott",
    "Sarah Connor",
    "Peter Parker",
    "Bruce Wayne",
  ],
  eventDate: "March 15-17, 2024",
  organizer: "Tech Academy International",
  description:
    "An intensive 3-day bootcamp covering modern web development technologies.",
};

const DownloadPage: React.FC = () => {
  const [eventData] = useState<EventData>(MOCK_EVENT);
  const [errorMessage, setErrorMessage] = useState("");
  const [certificateReady, setCertificateReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [fontSize, setFontSize] = useState(48);
  const [participantName, setParticipantName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const renderCertificate = (name: string, size: number = fontSize) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "Anonymous";
    console.log(eventData.templateUrl)
    image.src = eventData.templateUrl;
    
    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      console.log("Image loaded!");

      // Configure text styling
      ctx.font = `bold ${size}px 'Arial'`;
      ctx.fillStyle = "#2c3e50"; 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate position - adjust these values based on your template
      const textX = canvas.width / 2;
      const textY = canvas.height * 0.6; // 60% from top
      ctx.fillText(name, textX, textY);
      setCertificateReady(true);

      // Create download URL
      setDownloadUrl(canvas.toDataURL("image/png"));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x:0.5 } });
    };

    image.onerror = () => {
      console.error("Image failed to load", image.src);
    };
  };

  const onSubmit = (data: FormData) => {
    const cleanName = data.name.trim();
    const isParticipant = eventData.participants.some(
      (name) => name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!isParticipant) {
      setErrorMessage("Name not found in participants, use exact same Name.");
      return;
    }

    setParticipantName(cleanName);
    setShowForm(false);
    setErrorMessage("");
    renderCertificate(cleanName);
  };

  const adjustFontSize = (adjustment: number) => {
    const newSize = Math.min(200, Math.max(24, fontSize + adjustment));
    setFontSize(newSize);
    renderCertificate(participantName, newSize);
  };

  const downloadCertificate = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${participantName.replace(/\s+/g, "_")}_certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6 py-8 z-50">
      {/* Loading State - Show while certificate is rendering */}
      {showForm && !certificateReady && (
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
          <div className="space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-spin"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-1">Loading Certificate</h2>
              <p className="text-sm text-zinc-400">Preparing your personalized certificate...</p>
            </div>
          </div>
        </div>
      )}

      {/* Name Input Dialog */}
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 z-50 overflow-hidden">
          {/* Animated gradient or background effect */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-cyan-500/5 to-transparent animate-pulse-slow blur-3xl"></div>
          </div>

          <div className="relative z-10 bg-zinc-900/80 backdrop-blur-md rounded-3xl p-8 px-10 max-w-lg w-full shadow-xl border border-zinc-800 overflow-hidden">
            {/* Inner glow bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 rounded-3xl pointer-events-none z-0 blur-lg"></div>

            <div className="relative z-10">
              <h1
                className={`${styleScript.className} text-4xl font-bold text-center mb-3 text-teal-300 drop-shadow-lg`}
              >
                <span className="underline underline-offset-4 decoration-2">
                  NameFrame
                </span>{" "}
                ✨
              </h1>
              <p className="text-center text-zinc-400 mb-6 text-sm">
                Craft your name into a personalized certificate
              </p>

              <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                Enter Your Name:
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
                    placeholder="Your full name as registered"
                  />
                  {errors.name && (
                    <p className="text-rose-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-rose-400 text-sm">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-teal-500/50 active:scale-95"
                >
                  Generate Certificate
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col justify-center items-center mb-8">
            <NextImage alt="logo" className="w-3/4 max-w-xs" src={NameHeading}></NextImage>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Certificate Preview */}
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group transition duration-500 hover:border-teal-500/30">
              {/* Floating Color Accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition duration-500" />

              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                  🎓 Certificate Preview
                </h2>

                {certificateReady && (
                  <div className="flex items-center gap-2 border border-zinc-700 bg-zinc-800 rounded-full px-3 py-1 shadow-sm">
                    <button
                      onClick={() => adjustFontSize(-2)}
                      className="text-sm px-2 py-1 bg-zinc-700 text-zinc-100 rounded-full hover:bg-zinc-600 transition"
                      disabled={!certificateReady}
                    >
                      –
                    </button>
                    <span className="text-sm font-semibold text-teal-300 px-3">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => adjustFontSize(2)}
                      className="text-sm px-2 py-1 bg-zinc-700 text-zinc-100 rounded-full hover:bg-zinc-600 transition"
                      disabled={!certificateReady}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden shadow-inner bg-zinc-800/50">
                {certificateReady ? (
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-zinc-500 gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-2 border-zinc-700"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Generating certificate...</p>
                      <p className="text-xs text-zinc-600">This may take a moment</p>
                    </div>
                  </div>
                )}
              </div>

              {certificateReady && (
                <div className="mt-6 text-center">
                  <button
                    onClick={downloadCertificate}
                    className="bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-teal-500/50 transition duration-300 active:scale-95"
                  >
                    ⬇️ Download Certificate
                  </button>
                </div>
              )}
            </div>

            {/* Event Information */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group transition duration-500 hover:border-teal-500/30">
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition duration-500" />

              <h2 className="text-xl font-semibold text-zinc-100 mb-6">
                📅 Event Details
              </h2>
              <div className="space-y-4 text-zinc-400">
                <div>
                  <h3 className="font-medium text-zinc-300 mb-1">Date</h3>
                  <p className="text-sm">{eventData.eventDate}</p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-300 mb-1">Organized by</h3>
                  <p className="text-sm">{eventData.organizer}</p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-300 mb-1">Description</h3>
                  <p className="text-sm">{eventData.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-300 mb-2">Valid Names</h3>
                  <ul className="list-disc pl-5 text-xs text-zinc-500 space-y-1">
                    {eventData.participants.slice(0, 5).map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                    {eventData.participants.length > 5 && (
                      <li>+{eventData.participants.length - 5} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
