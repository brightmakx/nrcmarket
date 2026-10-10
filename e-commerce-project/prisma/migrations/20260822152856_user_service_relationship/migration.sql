-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
