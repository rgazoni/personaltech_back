/*
  Warnings:

  - Added the required column `type` to the `Visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visitors" ADD COLUMN     "type" TEXT NOT NULL;
