/*
  Warnings:

  - You are about to drop the column `youtube` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "youtube",
ADD COLUMN     "tiktok" TEXT NOT NULL DEFAULT '';
