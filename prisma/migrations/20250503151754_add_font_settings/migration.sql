-- AlterTable
ALTER TABLE "CertificateTemplate" ADD COLUMN     "fontColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "fontFamily" TEXT NOT NULL DEFAULT 'Arial',
ADD COLUMN     "fontSize" INTEGER NOT NULL DEFAULT 48;
