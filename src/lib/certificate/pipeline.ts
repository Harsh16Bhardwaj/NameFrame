import { CertificateTemplateRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";
import { toLegacyTemplateConfig } from "@/lib/certificate/editor-config";
import { resolveTemplateUrlByRole } from "@/lib/certificate/render-input";
import { generateCertificateHash, generateVerificationCode } from "@/lib/verification";
import {
  buildQrImageUrl,
  buildVerifyUrl,
  encodeForCloudinaryFetch,
} from "@/lib/verification/qr";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type BuildCertificateInput = {
  userId: string;
  eventId: string;
  participantId: string;
};

type BuiltCertificate = {
  certificateUrl: string;
  verifyUrl: string;
  qrCodeUrl: string;
  verificationCode: string;
  certificateHash: string;
  participant: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
  };
};

function roleFromPosition(position: string): CertificateTemplateRole {
  if (position === "FIRST") return CertificateTemplateRole.FIRST;
  if (position === "SECOND") return CertificateTemplateRole.SECOND;
  if (position === "THIRD") return CertificateTemplateRole.THIRD;
  return CertificateTemplateRole.DEFAULT;
}

function toResponseRoleKey(role: CertificateTemplateRole) {
  return role.toLowerCase() as Lowercase<CertificateTemplateRole>;
}

export async function buildParticipantCertificate(
  input: BuildCertificateInput
): Promise<BuiltCertificate> {
  const event = await prisma.event.findFirst({
    where: { id: input.eventId, userId: input.userId },
    include: {
      template: true,
      templateBindings: { include: { template: true } },
      awardAssignments: true,
      participants: {
        where: { id: input.participantId },
        take: 1,
      },
    },
  });

  if (!event) {
    throw new Error("Event not found or unauthorized");
  }

  const participant = event.participants[0];
  if (!participant) {
    throw new Error("Participant not found");
  }

  const assignment = event.awardAssignments.find(
    (item) => item.participantId === participant.id
  );
  const role = assignment
    ? roleFromPosition(assignment.position)
    : CertificateTemplateRole.DEFAULT;

  const roleTemplates = event.templateBindings.reduce<
    Partial<Record<Lowercase<CertificateTemplateRole>, { backgroundUrl: string }>>
  >((acc, binding) => {
    acc[toResponseRoleKey(binding.role)] = {
      backgroundUrl: binding.template.backgroundUrl,
    };
    return acc;
  }, {});

  const templateUrl = resolveTemplateUrlByRole({
    role,
    roleTemplates,
    fallbackTemplateUrl: event.template?.backgroundUrl,
  });

  const templateForRole =
    event.templateBindings.find((binding) => binding.role === role)?.template ??
    event.template;

  if (!templateForRole) {
    throw new Error("Template config missing");
  }

  const templateConfig = toLegacyTemplateConfig(templateForRole.editorConfigJson);
  const publicId = extractPublicId(templateUrl);
  if (!publicId) {
    throw new Error("Invalid template URL");
  }

  let verificationCode = participant.verificationCode;
  if (!verificationCode) {
    verificationCode = generateVerificationCode();
    await prisma.participant.update({
      where: { id: participant.id },
      data: { verificationCode },
    });
  }

  const certificateHash = generateCertificateHash({
    recipientName: participant.name,
    eventTitle: event.title,
    issueDate: new Date().toISOString(),
    verificationCode,
  });
  const verifyUrl = buildVerifyUrl(verificationCode);
  const qrCodeUrl = buildQrImageUrl(verificationCode);
  const encodedQrFetch = encodeForCloudinaryFetch(qrCodeUrl);

  const certificateUrl = cloudinary.url(publicId, {
    transformation: [
      {
        overlay: {
          font_family: templateConfig.fontFamily,
          font_size: templateConfig.fontSize,
          font_weight: "bold",
          text: participant.name,
        },
        color: templateConfig.fontColor,
        width: templateConfig.textWidth * 11,
        height: templateConfig.textHeight * 9,
        gravity: "center",
        y: Math.round((templateConfig.textPositionY - 50) * 10),
        x: Math.round((templateConfig.textPositionX - 50) * 10),
      },
      {
        overlay: {
          font_family: "Arial",
          font_size: 16,
          font_weight: "normal",
          text: `Verification: ${verificationCode}`,
        },
        color: "#666666",
        gravity: "south_east",
        x: 150,
        y: 20,
      },
      {
        overlay: `fetch:${encodedQrFetch}`,
        width: 120,
        height: 120,
        crop: "fit",
        gravity: "south_east",
        x: 20,
        y: 20,
      },
    ],
    format: "png",
    quality: "auto:best",
  });

  await prisma.participant.update({
    where: { id: participant.id },
    data: {
      verificationCode,
      certificateHash,
      qrCodeUrl,
    },
  });

  return {
    certificateUrl,
    verifyUrl,
    qrCodeUrl,
    verificationCode,
    certificateHash,
    participant: {
      id: participant.id,
      name: participant.name,
      email: participant.email,
    },
    event: {
      id: event.id,
      title: event.title,
    },
  };
}
