/*
  Warnings:

  - You are about to drop the column `page_id` on the `Visitors` table. All the data in the column will be lost.
  - Added the required column `personal_id` to the `Visitors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Visitors" DROP CONSTRAINT "Visitors_page_id_fkey";

-- AlterTable
ALTER TABLE "Visitors" DROP COLUMN "page_id",
ADD COLUMN     "personal_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
