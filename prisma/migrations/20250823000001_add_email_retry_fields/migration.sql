-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "emailAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "lastEmailAttempt" TIMESTAMP(3),
ADD COLUMN     "emailError" TEXT;
