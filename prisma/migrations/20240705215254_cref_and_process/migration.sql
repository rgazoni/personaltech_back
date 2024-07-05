/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The `is_cref_verified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TypesCref" AS ENUM ('juridical', 'natural');

-- CreateEnum
CREATE TYPE "CrefOpts" AS ENUM ('valid', 'invalid', 'already_registered', 'pending');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "is_cref_verified",
ADD COLUMN     "is_cref_verified" "CrefOpts" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Cref" (
    "cref" TEXT NOT NULL,
    "type" "TypesCref" NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Cref_pkey" PRIMARY KEY ("cref")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cref_cref_key" ON "Cref"("cref");
