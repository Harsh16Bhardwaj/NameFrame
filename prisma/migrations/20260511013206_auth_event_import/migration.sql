-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "emailContentText" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CertificateIssue" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "role" "CertificateTemplateRole" NOT NULL DEFAULT 'DEFAULT',
    "certificateUrl" TEXT,
    "qrCodeUrl" TEXT,
    "verificationCode" TEXT NOT NULL,
    "certificateHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateIssue_verificationCode_key" ON "CertificateIssue"("verificationCode");

-- CreateIndex
CREATE INDEX "CertificateIssue_participantId_createdAt_idx" ON "CertificateIssue"("participantId", "createdAt");

-- CreateIndex
CREATE INDEX "CertificateIssue_eventId_role_idx" ON "CertificateIssue"("eventId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateIssue_eventId_participantId_role_key" ON "CertificateIssue"("eventId", "participantId", "role");

-- AddForeignKey
ALTER TABLE "CertificateIssue" ADD CONSTRAINT "CertificateIssue_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateIssue" ADD CONSTRAINT "CertificateIssue_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateIssue" ADD CONSTRAINT "CertificateIssue_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CertificateTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
