// app/api/user-sync/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(): Promise<NextResponse> {
  try {
    // Get the current user from Clerk
    const user = await currentUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      console.log(`User already exists: ${user.id}`);
      return NextResponse.json({ success: true, user: existingUser });
    }

    // If the user doesn't exist, create the user
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: fullName,
      },
    });

    console.log(`User created: ${user.id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user", success: false },
      { status: 500 }
    );
  } finally {
    // Always disconnect the Prisma client
    await prisma.$disconnect();
  }
}
