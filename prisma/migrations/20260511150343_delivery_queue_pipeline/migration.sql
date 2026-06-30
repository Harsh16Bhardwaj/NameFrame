-- CreateEnum
CREATE TYPE "DeliveryQueueTier" AS ENUM ('PREMIUM', 'REGULAR');

-- CreateEnum
CREATE TYPE "DeliveryQueueEventStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DeliveryQueueItemStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "DeliveryQueueEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "tier" "DeliveryQueueTier" NOT NULL,
    "status" "DeliveryQueueEventStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3),
    "subject" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "enqueuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryQueueEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryQueueItem" (
    "id" TEXT NOT NULL,
    "queueEventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "status" "DeliveryQueueItemStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "lastTriedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "provider" "EmailProvider",
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmtpCredentialPool" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "passwordEncrypted" TEXT NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "sendLimit" INTEGER NOT NULL DEFAULT 400,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmtpCredentialPool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryQueueEvent_status_tier_scheduledFor_enqueuedAt_idx" ON "DeliveryQueueEvent"("status", "tier", "scheduledFor", "enqueuedAt");

-- CreateIndex
CREATE INDEX "DeliveryQueueEvent_eventId_createdAt_idx" ON "DeliveryQueueEvent"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "DeliveryQueueItem_status_updatedAt_idx" ON "DeliveryQueueItem"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryQueueItem_queueEventId_participantId_key" ON "DeliveryQueueItem"("queueEventId", "participantId");

-- CreateIndex
CREATE INDEX "SmtpCredentialPool_active_sendCount_sendLimit_idx" ON "SmtpCredentialPool"("active", "sendCount", "sendLimit");

-- AddForeignKey
ALTER TABLE "DeliveryQueueEvent" ADD CONSTRAINT "DeliveryQueueEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryQueueEvent" ADD CONSTRAINT "DeliveryQueueEvent_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryQueueItem" ADD CONSTRAINT "DeliveryQueueItem_queueEventId_fkey" FOREIGN KEY ("queueEventId") REFERENCES "DeliveryQueueEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryQueueItem" ADD CONSTRAINT "DeliveryQueueItem_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmtpCredentialPool" ADD CONSTRAINT "SmtpCredentialPool_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
