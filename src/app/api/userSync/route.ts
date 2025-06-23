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

    const userEmail = user.emailAddresses[0].emailAddress;

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      await prisma.user.create({
        data: {
          id: user.id,
          email: userEmail,
          name: fullName,
        },
      });

      console.log(`User created: ${user.id}`);
      return NextResponse.json({ success: true });
    } else {
      console.log(`User with email ${userEmail} already exists.`);
      return NextResponse.json({ success: true, user: existingUser });
    }
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
