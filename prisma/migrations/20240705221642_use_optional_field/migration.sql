/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Cref` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cref_user_id_key" ON "Cref"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Page_user_id_key" ON "Page"("user_id");
