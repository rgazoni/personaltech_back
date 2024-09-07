/*
  Warnings:

  - The primary key for the `Ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[trainee_id,personal_id]` on the table `Ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_trainee_id_personal_id_key" ON "Ratings"("trainee_id", "personal_id");
