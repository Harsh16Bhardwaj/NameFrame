"use client";
import React, { useState, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import ParticipantImport from "@/components/ParticipantImport";
import axios from "axios";

interface FormData {
  title: string;
  certificateTemplate: FileList;
}

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

  const certificateFile = watch("certificateTemplate");

  useEffect(() => {
    if (certificateFile && certificateFile[0]) {
      const file = certificateFile[0];
      const fileType = file.type;
      if (fileType === "image/png" || fileType === "image/jpeg") {
        const previewUrl = URL.createObjectURL(file);
        setTemplatePreview(previewUrl);

        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      } else {
        setTemplatePreview(null);
      }
    }
  }, [certificateFile]);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "PolyScribe");
    setIsUploading(true);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dikc4f9ip/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setIsUploading(false);
    return data.secure_url;
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const files = certificateFile;
    if (files && files[0]) {
      const url = await uploadImageToCloudinary(files[0]);
      setUploadedTemplateUrl(url);
      console.log("Uploaded image URL:", url);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!uploadedTemplateUrl) {
      alert("Please upload the certificate template before submitting.");
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
    <div className="z-30 -mt-16 fixed w-full bg-gray-300 h-[770px] rounded-2xl">
      <div className="bg-black w-full min-h-screen rounded-2xl">
        <div className="max-w-8xl px-32 p-8">
          <h2 className="text-4xl font-bold mb-6 ml-10 text-teal-600 underline underline-offset-8 decoration-1">
            Create a New Certificate Session
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <div className="space-y-8 ml-20">
              <div>
                <label className="block text-gray-300 mb-2 ml-1" htmlFor="title">
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your event title"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-200"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-md text-gray-300 mb-2" htmlFor="certificateTemplate">
                  Certificate Template (PNG/JPG)
                </label>
                <div className="flex gap-x-1">
                  <input
                    id="certificateTemplate"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="w-full border border-gray-300 h-10 cursor-pointer text-gray-400 text-sm p-2 rounded-lg"
                    {...register("certificateTemplate", {
                      required: "Certificate template is required",
                      validate: {
                        fileType: (files) => {
                          if (files && files[0]) {
                            const acceptedTypes = ["image/png", "image/jpeg"];
                            return (
                              acceptedTypes.includes(files[0].type) ||
                              "Only PNG or JPG files are allowed"
                            );
                          }
                          return true;
                        },
                      },
                    })}
                  />
                  <button
                    onClick={handleUpload}
                    className="p-3 cursor-pointer border border-white bg-teal-600 rounded-full"
                  >
                    <FaCloudUploadAlt />
                  </button>
                </div>
                {errors.certificateTemplate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.certificateTemplate.message}
                  </p>
                )}
              </div>

              {eventId && (
                <ParticipantImport
                  eventId={eventId}
                  onSuccess={(data) => console.log("Participants imported:", data)}
                />
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 font-semibold cursor-pointer text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                >
                  {isSubmitting ? "Submitting..." : "Create Event"}
                </button>
              </div>
            </div>

            <div className="border p-4 rounded-md flex flex-col items-center gap-y-2 justify-center">
              {isUploading ? (
                <div className="h-60 w-full rounded-xl border border-gray-200 flex flex-col justify-center items-center">
                  <div className="w-8 h-8 border-4 border-t-4 border-teal-600 rounded-full animate-spin"></div>
                  <span className="text-teal-600 mt-2">Uploading...</span>
                </div>
              ) : templatePreview ? (
                <img
                  src={templatePreview}
                  alt="Certificate Template Preview"
                  className="max-w-full h-auto rounded border border-gray-200"
                />
              ) : (
                <div className="h-60 w-full rounded-xl border border-gray-200 flex flex-col justify-center items-center">
                  <p className="text-gray-500 text-center">
                    Your Template Preview <br />
                    <span className="text-xl flex justify-center items-center gap-x-1">
                      <MdErrorOutline />
                      Nothing to show here
                    </span>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm;
