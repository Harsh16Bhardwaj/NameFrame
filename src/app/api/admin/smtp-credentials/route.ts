import { NextResponse } from "next/server";
import { requireCurrentUser, isProUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";
import { encryptText } from "@/lib/security/crypto";

type CredentialInput = {
  label: string;
  host: string;
  port: number;
  username: string;
  password: string;
  secure?: boolean;
  sendLimit?: number;
  active?: boolean;
};

export async function POST(req: Request) {
  try {
    const user = await requireCurrentUser();
    if (!isProUser(user)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { credentials } = (await req.json()) as { credentials?: CredentialInput[] };
    if (!Array.isArray(credentials) || credentials.length === 0) {
      return NextResponse.json(
        { success: false, error: "credentials array required" },
        { status: 400 }
      );
    }
    if (credentials.length > 5) {
      return NextResponse.json(
        { success: false, error: "Maximum 5 credentials allowed at once" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.smtpCredentialPool.updateMany({
        data: { active: false },
      });

      for (const item of credentials) {
        await tx.smtpCredentialPool.create({
          data: {
            label: item.label,
            host: item.host,
            port: item.port,
            username: item.username,
            passwordEncrypted: encryptText(item.password),
            secure: item.secure ?? true,
            active: item.active ?? true,
            sendLimit: item.sendLimit ?? 400,
            sendCount: 0,
            createdById: user.id,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save smtp credentials",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await requireCurrentUser();
    if (!isProUser(user)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const credentials = await prisma.smtpCredentialPool.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        label: true,
        host: true,
        port: true,
        username: true,
        secure: true,
        active: true,
        sendCount: true,
        sendLimit: true,
        createdAt: true,
      },
      take: 5,
    });

    return NextResponse.json({ success: true, data: credentials });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch smtp credentials",
      },
      { status: 500 }
    );
  }
}
