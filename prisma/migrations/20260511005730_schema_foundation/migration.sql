-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CertificateTemplateRole" AS ENUM ('DEFAULT', 'FIRST', 'SECOND', 'THIRD');

-- CreateEnum
CREATE TYPE "AwardPosition" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('NODEMAILER', 'RESEND', 'SENDGRID');

-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('SINGLE', 'BATCH', 'ALL', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "DeliveryJobStatus" AS ENUM ('PENDING', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DeliveryAttemptStatus" AS ENUM ('SENT', 'FAILED', 'BOUNCED', 'DEFERRED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('PRO_MONTHLY', 'PRO_ANNUAL');

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_eventId_fkey";

-- AlterTable
ALTER TABLE "CertificateTemplate" ADD COLUMN "editorConfigJson" JSONB;

UPDATE "CertificateTemplate"
SET "editorConfigJson" = jsonb_build_object(
    'textPosition', jsonb_build_object(
        'x', "textPositionX",
        'y', "textPositionY",
        'width', "textWidth",
        'height', "textHeight"
    ),
    'font', jsonb_build_object(
        'family', "fontFamily",
        'size', "fontSize",
        'color', "fontColor"
    )
);

ALTER TABLE "CertificateTemplate" ALTER COLUMN "editorConfigJson" SET NOT NULL;

ALTER TABLE "CertificateTemplate" DROP COLUMN "fontColor",
DROP COLUMN "fontFamily",
DROP COLUMN "fontSize",
DROP COLUMN "textHeight",
DROP COLUMN "textPositionX",
DROP COLUMN "textPositionY",
DROP COLUMN "textWidth";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "certificateTitle" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "emailTemplateId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "organizationLogoUrl" TEXT,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "scheduledSendAt" TIMESTAMP(3),
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "emailAttempts",
DROP COLUMN "emailError",
DROP COLUMN "emailStatus",
DROP COLUMN "isVerified",
DROP COLUMN "lastEmailAttempt",
DROP COLUMN "verifiedAt",
ADD COLUMN     "participated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qrCodeUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "groqApiKeyEncrypted" TEXT,
ADD COLUMN     "isPro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "razorpayCustomerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "EventCertificateTemplate" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "role" "CertificateTemplateRole" NOT NULL DEFAULT 'DEFAULT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCertificateTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAwardAssignment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "position" "AwardPosition" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAwardAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "bodyText" TEXT,
    "variablesJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryJob" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL,
    "mode" "DeliveryMode" NOT NULL,
    "status" "DeliveryJobStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "batchSize" INTEGER NOT NULL DEFAULT 50,
    "lastCursor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAttempt" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL,
    "status" "DeliveryAttemptStatus" NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "providerMessageId" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'RAZORPAY',
    "providerPaymentId" TEXT NOT NULL,
    "providerSubscriptionId" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "plan" "PlanCode" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightSnapshot" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "totalParticipants" INTEGER NOT NULL,
    "participatedCount" INTEGER NOT NULL,
    "sentCount" INTEGER NOT NULL,
    "failedCount" INTEGER NOT NULL,
    "deliveryRate" DOUBLE PRECISION NOT NULL,
    "participationRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsightSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventCertificateTemplate_templateId_idx" ON "EventCertificateTemplate"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCertificateTemplate_eventId_role_key" ON "EventCertificateTemplate"("eventId", "role");

-- CreateIndex
CREATE INDEX "EventAwardAssignment_eventId_position_idx" ON "EventAwardAssignment"("eventId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "EventAwardAssignment_eventId_participantId_key" ON "EventAwardAssignment"("eventId", "participantId");

-- CreateIndex
CREATE INDEX "DeliveryJob_eventId_createdAt_idx" ON "DeliveryJob"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "DeliveryJob_status_scheduledFor_idx" ON "DeliveryJob"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "DeliveryAttempt_participantId_attemptNo_idx" ON "DeliveryAttempt"("participantId", "attemptNo");

-- CreateIndex
CREATE INDEX "DeliveryAttempt_jobId_status_idx" ON "DeliveryAttempt"("jobId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_providerPaymentId_key" ON "PaymentRecord"("providerPaymentId");

-- CreateIndex
CREATE INDEX "PaymentRecord_userId_createdAt_idx" ON "PaymentRecord"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InsightSnapshot_eventId_key" ON "InsightSnapshot"("eventId");

-- CreateIndex
CREATE INDEX "Event_userId_createdAt_idx" ON "Event"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Participant_eventId_createdAt_idx" ON "Participant"("eventId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_eventId_email_key" ON "Participant"("eventId", "email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "EmailTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCertificateTemplate" ADD CONSTRAINT "EventCertificateTemplate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCertificateTemplate" ADD CONSTRAINT "EventCertificateTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CertificateTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAwardAssignment" ADD CONSTRAINT "EventAwardAssignment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAwardAssignment" ADD CONSTRAINT "EventAwardAssignment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryJob" ADD CONSTRAINT "DeliveryJob_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "DeliveryJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightSnapshot" ADD CONSTRAINT "InsightSnapshot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
