/*
  Warnings:

  - The primary key for the `Ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Ratings_personal_id_key";

-- DropIndex
DROP INDEX "Ratings_trainee_id_key";

-- DropIndex
DROP INDEX "Ratings_trainee_id_personal_id_key";

-- AlterTable
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_pkey",
ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY ("trainee_id", "personal_id");
