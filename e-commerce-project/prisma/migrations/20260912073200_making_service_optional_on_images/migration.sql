-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_serviceId_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "serviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
