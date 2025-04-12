/*
  Warnings:

  - Added the required column `updatedAt` to the `CertificateTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CertificateTemplate" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
