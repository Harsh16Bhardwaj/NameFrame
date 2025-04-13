"use client";
import React, { useState, useEffect } from "react";
import {
  Controller,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { DatePickerWithPresets } from "@/components/datepicker";
import { MdErrorOutline } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import ParticipantImport from "@/components/ParticipantImport";

interface FormData {
  title: string;
  certificateTemplate: FileList;
  csvFile: FileList;
  sendDate: Date | null;
}
type ModeType = string;

const CertificateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();

  const certificateFile = watch("certificateTemplate");
  // Update the preview URL if file changes
  useEffect(() => {
    if (certificateFile && certificateFile[0]) {
      const file = certificateFile[0];
      const fileType = file.type;
      if (fileType === "image/png" || fileType === "image/jpeg") {
        const previewUrl = URL.createObjectURL(file);
        setTemplatePreview(previewUrl);

        // Clean up object URL on unmount
        return () => URL.revokeObjectURL(previewUrl);
      } else {
        setTemplatePreview(null);
      }
    }
  }, [certificateFile]);

  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);
  const [typeModle, setTypeModle] = useState<string>("");
  const [uploadedTemplateUrl, setUploadedTemplateUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false); // Loading state

  // Helper function for uploading to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "PolyScribe");
    setIsUploading(true); // Start uploading

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

  const modeSet = (e: ModeType) => {
    setTypeModle(e);
  };

  const handleUpload = async () => {
    const files = certificateFile;
    if (files && files[0]) {
      const url = await uploadImageToCloudinary(files[0]);
      setUploadedTemplateUrl(url);
      console.log("Uploaded image URL:", url);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!uploadedTemplateUrl) {
        alert("Please upload the certificate template before submitting.");
        return;
      }

      const fullFormData = {
        ...data,
        templateURL: uploadedTemplateUrl,
      };

      console.log("Final Form Data with Cloudinary URL:", fullFormData);

      // TODO: Send fullFormData to backend
      /*
    await fetch("/api/submit-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullFormData),
    });
    */
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return (
    <div className="z-30 -mt-16 fixed w-full bg-gray-300 h-[770px]   rounded-2xl">
      <div className="bg-black w-full min-h-screen rounded-2xl">
        <div className="max-w-8xl px-32 p-8">
          <h2 className="text-4xl font-bold mb-6 ml-10 text-teal-600 underline underline-offset-8 decoration-1">
            Create a New Certificate Session
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* Left side: Form inputs */}
            <div className="space-y-8 ml-20">
              {/* Title */}
              <div>
                <label
                  className="block text-gray-300 mb-2 ml-1"
                  htmlFor="title"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Certificate Template Upload */}
              <div className="">
                <label
                  className="block text-md text-gray-300 mb-2"
                  htmlFor="certificateTemplate"
                >
                  Certificate Template (PNG/JPG)
                </label>
                <div className="flex gap-x-1">
                  <input
                    id="certificateTemplate"
                    type="file"
                    placeholder=""
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
                  {errors.certificateTemplate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.certificateTemplate.message}
                    </p>
                  )}
                  <button
                    onClick={handleUpload}
                    className="p-3 cursor-pointer border border-white bg-teal-600 rounded-full"
                  >
                    <FaCloudUploadAlt />
                  </button>
                </div>
              </div>

              <div className="flex gap-x-2">
                <button
                  className={`px-4 py-2 border-gray-400 hover:border-gray-200 border-2 border-dashed rounded-xl text-gray-100 font-medium cursor-pointer hover:bg-gray-700 bg-neutral-700 hover:scale-103 hover:duration-200 duration-200 ease-in-out ${
                    typeModle == "direct"
                      ? "bg-red-500 text-white border-white border-solid  duration-200 hover:bg-red-500 font-semibold"
                      : ""
                  } `}
                  onClick={() => {
                    modeSet("direct");
                  }}
                >
                  Direct Mail
                </button>
                <button
                  className={`px-4 py-2 border-gray-400 hover:border-gray-200 border-2 border-dashed rounded-xl text-gray-100 font-medium cursor-pointer hover:bg-gray-700 bg-neutral-700 hover:scale-103 hover:duration-200 duration-200 ease-in-out ${
                    typeModle == "link"
                      ? "bg-red-500 text-white border-white border-solid  duration-200 hover:bg-red-500 font-semibold"
                      : ""
                  } `}
                  onClick={() => {
                    modeSet("link");
                  }}
                >
                  via Link
                </button>
                <button
                  className={`px-4 py-2 border-gray-400 hover:border-gray-200 border-2 border-dashed rounded-xl text-gray-100 font-medium cursor-pointer hover:bg-gray-700 bg-neutral-700 hover:scale-103 hover:duration-200 duration-200 ease-in-out ${
                    typeModle == "manual"
                      ? "bg-red-500  text-white border-white border-solid  duration-200 hover:bg-red-500 font-semibold"
                      : ""
                  } `}
                  onClick={() => {
                    modeSet("manual");
                  }}
                >
                  Manual Forward
                </button>
              </div>

              {/* CSV File Upload */}
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="csvFile">
                  CSV File (Participants)
                </label>
                <input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  className="w-full cursor-pointer border border-gray-300 rounded-md h-10 text-gray-400 p-2 "
                  {...register("csvFile", { required: "CSV file is required" })}
                />
                {errors.csvFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.csvFile.message}
                  </p>
                )}
              </div>

              <h3 className="text-gray-200 text-md mb-2">
                Choose a date to send the mails :
              </h3>
              {/* Date Picker with Presets */}
              <Controller
                name="sendDate"
                control={control}
                defaultValue={null}
                rules={{ required: "Please select a date" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePickerWithPresets
                    selected={field.value}
                    onChange={field.onChange}
                    error={error?.message}
                  />
                )}
              />

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 cursor-pointer font-semibold border hover:-translate-y-0.5 hover:duration-200 duration-200 ease-in-out text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                >
                  {isSubmitting ? "Submitting..." : "Create Session"}
                </button>
              </div>
            </div>

            {/* Right side: Preview area (for certificate template) */}
            <div className="border p-4 rounded-md flex flex-col items-center gap-y-2 justify-center">
              {isUploading ? (
                <div className="h-60 w-full rounded-xl border border-gray-200 flex flex-col justify-center items-center">
                  {/* Loading state (you can replace this with an actual spinner component) */}
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-t-4 border-teal-600 rounded-full animate-spin"></div>
                    <span className="text-teal-600">Uploading...</span>
                  </div>
                </div>
              ) : templatePreview ? (
                <div className="border border-gray-200 rounded-2xl p-2">
                  <img
                    src={templatePreview}
                    alt="Certificate Template Preview"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              ) : (
                <div className="h-60 rounded-xl w-full border border-gray-200 flex flex-col justify-center items-center">
                  <p className="text-gray-500 text-center">
                    Your Template Preview <br />
                    <span className="text-xl flex justify-center items-center gap-x-1">
                      <MdErrorOutline />
                      Nothing to show here
                    </span>
                  </p>
                </div>
              )}
              {csvPreview ? (
                <div className="h-60 rounded-xl w-full border border-gray-200"></div>
              ) : (
                <div className="h-60 rounded-xl w-full border border-gray-200 flex flex-col justify-center items-center">
                  <p className="text-gray-500 text-center">
                    Your csv Preview <br />
                    <span className="text-xl flex justify-center items-center gap-x-1">
                      <MdErrorOutline />
                      Upload your CSV to see results
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
