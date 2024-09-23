/*
  Warnings:

  - You are about to drop the column `hours_taken` on the `Classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "hours_taken",
ADD COLUMN     "elapsed_time" INTEGER NOT NULL DEFAULT 0;
