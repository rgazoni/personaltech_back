/*
  Warnings:

  - The values [rating] on the enum `ClassesStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClassesStatus_new" AS ENUM ('pending', 'accepted', 'rejected', 'finished', 'done');
ALTER TABLE "Classes" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Classes" ALTER COLUMN "status" TYPE "ClassesStatus_new" USING ("status"::text::"ClassesStatus_new");
ALTER TYPE "ClassesStatus" RENAME TO "ClassesStatus_old";
ALTER TYPE "ClassesStatus_new" RENAME TO "ClassesStatus";
DROP TYPE "ClassesStatus_old";
ALTER TABLE "Classes" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
