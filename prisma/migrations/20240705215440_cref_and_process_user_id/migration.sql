/*
  Warnings:

  - Added the required column `user_id` to the `Cref` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cref" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cref" ADD CONSTRAINT "Cref_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
