-- AlterTable
ALTER TABLE "CertificateTemplate" ADD COLUMN     "textHeight" DOUBLE PRECISION NOT NULL DEFAULT 15,
ADD COLUMN     "textPositionX" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN     "textPositionY" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN     "textWidth" DOUBLE PRECISION NOT NULL DEFAULT 80;
