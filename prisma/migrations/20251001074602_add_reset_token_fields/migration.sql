-- AlterTable
ALTER TABLE "members" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "members" ADD COLUMN "resetTokenExpiry" DATETIME;
