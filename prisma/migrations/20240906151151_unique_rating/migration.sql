/*
  Warnings:

  - A unique constraint covering the columns `[trainee_id]` on the table `Ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ratings" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_trainee_id_key" ON "Ratings"("trainee_id");
