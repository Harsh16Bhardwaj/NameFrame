import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get all participants for the user's events
    const participants = await prisma.participant.findMany({
      where: {
        event: {
          userId: userId
        }
      },
      include: {
        event: {
          select: {
            title: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Prepare data for Excel
    const excelData = participants.map(participant => ({
      'Name': participant.name,
      'Email': participant.email,
      'Event': participant.event.title,
      'Event Date': new Date(participant.event.createdAt).toLocaleDateString(),
      'Certificate Status': participant.certificateStatus,
      'Email Status': participant.emailStatus,
      'Created At': new Date(participant.createdAt).toLocaleString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Create response with Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="participants.xlsx"'
      }
    });

  } catch (error) {
    console.error("Error exporting participants:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 