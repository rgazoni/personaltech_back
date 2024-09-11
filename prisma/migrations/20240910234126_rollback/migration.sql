/*
  Warnings:

  - You are about to drop the column `personal_id` on the `Visitors` table. All the data in the column will be lost.
  - Added the required column `page_id` to the `Visitors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Visitors" DROP CONSTRAINT "Visitors_personal_id_fkey";

-- AlterTable
ALTER TABLE "Visitors" DROP COLUMN "personal_id",
ADD COLUMN     "page_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
