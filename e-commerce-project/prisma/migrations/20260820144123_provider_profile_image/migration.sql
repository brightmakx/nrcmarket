-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "serviceProviderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
