import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const certificateStatus = searchParams.get('certificateStatus');
    const emailStatus = searchParams.get('emailStatus');
    const dateRange = searchParams.get('dateRange');

    // Build where clause
    const where: any = {
      event: {
        userId: userId
      }
    };

    // Add search conditions
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { event: { title: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add status filters
    if (certificateStatus && certificateStatus !== 'all') {
      where.certificateStatus = certificateStatus;
    }

    if (emailStatus && emailStatus !== 'all') {
      where.emailStatus = emailStatus;
    }

    // Add date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      where.createdAt = {
        gte: startDate
      };
    }

    // Get all participants for the user's events
    const participants = await prisma.participant.findMany({
      where,
      include: {
        event: {
          select: {
            title: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.participant.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        participants,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 