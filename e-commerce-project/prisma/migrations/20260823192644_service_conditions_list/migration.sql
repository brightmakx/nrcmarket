/*
  Warnings:

  - The `conditions` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_providerId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "conditions",
ADD COLUMN     "conditions" TEXT[],
ALTER COLUMN "providerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
