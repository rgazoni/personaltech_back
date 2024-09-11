/*
  Warnings:

  - You are about to drop the column `has_visitor_type` on the `Visitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Visitors" DROP COLUMN "has_visitor_type",
ADD COLUMN     "visitor_type" TEXT;
