/*
  Warnings:

  - You are about to drop the column `comments_order` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "comments_order",
ADD COLUMN     "comments_sort" TEXT NOT NULL DEFAULT 'time_desc';
