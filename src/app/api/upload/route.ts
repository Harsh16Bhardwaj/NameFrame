import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with server environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get form data with the file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const acceptedTypes = ["image/png", "image/jpeg"];
    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PNG or JPG files are allowed" },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a base64 string from the buffer
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "certificate_templates",
      resource_type: "image",
    });

    // Return the Cloudinary URL
    return NextResponse.json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while uploading the file" },
      { status: 500 }
    );
  }
}