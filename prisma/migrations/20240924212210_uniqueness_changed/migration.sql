/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ratings_trainee_id_personal_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_id_key" ON "Ratings"("id");
