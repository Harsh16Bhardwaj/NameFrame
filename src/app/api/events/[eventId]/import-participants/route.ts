import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "papaparse"; // For CSV parsing
import * as XLSX from 'xlsx';

// This is the correct way to define params for Next.js App Router
type RouteParams = {
  params: {
    eventId: string
  }
}

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: RouteParams) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
 
    // Verify the event exists and belongs to the user
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
        userId,
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Process the uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
      return NextResponse.json(
        { success: false, error: "Unsupported file format. Please upload a CSV or Excel file" },
        { status: 400 }
      );
    }

    // Read the file content
    let parsedData;

    if (fileType === 'csv') {
      // Process CSV file
      const fileContent = await file.text();
      const { data, errors } = parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      
      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, error: "Error parsing CSV file", details: errors },
          { status: 400 }
        );
      }
      
      parsedData = data;
    } else {
      // Process Excel file
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedData = XLSX.utils.sheet_to_json(worksheet);
    }

    // Extract and validate required fields (name and email)
    const participants = [];
    const invalidRows = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const row of parsedData as Array<{ [key: string]: any }>) {
      // Try to find name and email fields (handling different possible column names)
      const name = row.name || row.Name || row.NAME || row["Student Name"] || row["STUDENT NAME"] || row.student_name || row["PARTICIPANT NAME"] || row["Participant Name"];
      const email = row.email || row.Email || row.EMAIL || row["Student Email"] || row["STUDENT EMAIL"] || row.student_email || row["PARTICIPANT EMAIL"] || row["Participant Email"];

      if (name && email && emailRegex.test(email)) {
        participants.push({
          name,
          email,
          eventId: params.eventId,
        });
      } else {
        invalidRows.push(row);
      }
    }

    if (participants.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No valid participant data found. Please ensure your file has 'name' and 'email' columns",
          invalidRows 
        },
        { status: 400 }
      );
    }

    // Store participants in database
    const result = await prisma.participant.createMany({
      data: participants,
      skipDuplicates: true, // Skip records with duplicate emails for the same event
    });

    return NextResponse.json({
      success: true,
      data: {
        imported: result.count,
        total: participants.length,
        invalidRows: invalidRows.length > 0 ? invalidRows : undefined,
      },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error importing participants:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}