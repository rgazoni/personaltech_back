/*
  Warnings:

  - You are about to drop the column `user_id` on the `Cref` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[personal_id]` on the table `Cref` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personal_id]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personal_id` to the `Cref` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personal_id` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('personal', 'trainee');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ongoing', 'pending', 'accepted', 'rejected');

-- DropForeignKey
ALTER TABLE "Cref" DROP CONSTRAINT "Cref_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_user_id_fkey";

-- DropIndex
DROP INDEX "Cref_cref_key";

-- DropIndex
DROP INDEX "Cref_user_id_key";

-- DropIndex
DROP INDEX "Page_user_id_idx";

-- DropIndex
DROP INDEX "Page_user_id_key";

-- AlterTable
ALTER TABLE "Cref" DROP COLUMN "user_id",
ADD COLUMN     "personal_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "user_id",
ADD COLUMN     "about_you" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "background_color" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "expertises" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "instagram" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personal_id" TEXT NOT NULL,
ADD COLUMN     "presentation_video" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profession" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "service_value" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsapp" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "youtube" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Personal" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_cref_verified" "CrefOpts" NOT NULL DEFAULT 'pending',
    "birthdate" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'personal',
    "uid_chat" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'trainee',
    "full_name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "uid_chat" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Trainee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratings" (
    "id" TEXT NOT NULL,
    "request" "RequestStatus" NOT NULL DEFAULT 'ongoing',
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userResponseAt" TIMESTAMP(3),
    "personal_id" TEXT NOT NULL,
    "trainee_id" TEXT NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personal_email_key" ON "Personal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainee_email_key" ON "Trainee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_personal_id_key" ON "Ratings"("personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_trainee_id_personal_id_key" ON "Ratings"("trainee_id", "personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cref_personal_id_key" ON "Cref"("personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "Page_personal_id_key" ON "Page"("personal_id");

-- CreateIndex
CREATE INDEX "Page_personal_id_idx" ON "Page"("personal_id");

-- AddForeignKey
ALTER TABLE "Cref" ADD CONSTRAINT "Cref_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "Trainee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
