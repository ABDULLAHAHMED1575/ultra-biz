/*
  Warnings:

  - You are about to drop the column `status` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "status",
ADD COLUMN     "vendor" BOOLEAN NOT NULL DEFAULT false;
