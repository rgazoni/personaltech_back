/*
  Warnings:

  - You are about to drop the column `scheduledDate` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `sessionDetails` on the `Classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "scheduledDate",
DROP COLUMN "sessionDetails";
