/*
  Warnings:

  - Changed the type of `meta` on the `Log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "meta",
ADD COLUMN     "meta" JSONB NOT NULL;
