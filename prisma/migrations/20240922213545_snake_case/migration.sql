/*
  Warnings:

  - You are about to drop the column `personalId` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `traineeId` on the `Classes` table. All the data in the column will be lost.
  - Added the required column `personal_id` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainee_id` to the `Classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_personalId_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_traineeId_fkey";

-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "personalId",
DROP COLUMN "traineeId",
ADD COLUMN     "personal_id" TEXT NOT NULL,
ADD COLUMN     "trainee_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "Trainee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
