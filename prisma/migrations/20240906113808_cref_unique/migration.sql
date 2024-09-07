/*
  Warnings:

  - A unique constraint covering the columns `[cref]` on the table `Personal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Personal_cref_key" ON "Personal"("cref");
