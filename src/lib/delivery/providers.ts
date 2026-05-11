import { Resend } from "resend";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { decryptText } from "@/lib/security/crypto";
import { EmailProvider } from "@/generated/prisma/enums";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; contentBase64: string }>;
};

export type SendEmailResult = {
  ok: boolean;
  provider: EmailProvider;
  providerMessageId?: string;
  errorMessage?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWithResend(input: SendEmailInput): Promise<SendEmailResult> {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || `NameFrame <noreply@${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      attachments: (input.attachments || []).map((a) => ({
        filename: a.filename,
        content: a.contentBase64,
      })),
    });

    if (result.error) {
      return {
        ok: false,
        provider: EmailProvider.RESEND,
        errorMessage: result.error.message || "Resend send failed",
      };
    }

    return {
      ok: true,
      provider: EmailProvider.RESEND,
      providerMessageId: typeof result.data?.id === "string" ? result.data.id : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      provider: EmailProvider.RESEND,
      errorMessage: error instanceof Error ? error.message : "Resend send exception",
    };
  }
}

async function pickRandomActiveSmtpCredential() {
  const available = await prisma.smtpCredentialPool.findMany({
    where: { active: true },
    orderBy: { updatedAt: "asc" },
    take: 5,
  });
  const filtered = available.filter((item) => item.sendCount < item.sendLimit);

  if (!filtered.length) return null;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index] ?? null;
}

export async function sendWithNodemailerPool(input: SendEmailInput): Promise<SendEmailResult> {
  const credential = await pickRandomActiveSmtpCredential();
  if (!credential) {
    return {
      ok: false,
      provider: EmailProvider.NODEMAILER,
      errorMessage: "No active SMTP credential available",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: credential.host,
      port: credential.port,
      secure: credential.secure,
      auth: {
        user: credential.username,
        pass: decryptText(credential.passwordEncrypted),
      },
    });

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_FROM || credential.username,
      to: input.to,
      subject: input.subject,
      html: input.html,
      attachments: (input.attachments || []).map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.contentBase64, "base64"),
      })),
    });

    const newCount = credential.sendCount + 1;
    await prisma.smtpCredentialPool.update({
      where: { id: credential.id },
      data: {
        sendCount: newCount,
        active: newCount < credential.sendLimit,
      },
    });

    return {
      ok: true,
      provider: EmailProvider.NODEMAILER,
      providerMessageId: info.messageId,
    };
  } catch (error) {
    return {
      ok: false,
      provider: EmailProvider.NODEMAILER,
      errorMessage: error instanceof Error ? error.message : "Nodemailer send failed",
    };
  }
}

export async function sendWithProviderFallback(input: SendEmailInput): Promise<SendEmailResult> {
  const resendResult = await sendWithResend(input);
  if (resendResult.ok) return resendResult;
  return sendWithNodemailerPool(input);
}
