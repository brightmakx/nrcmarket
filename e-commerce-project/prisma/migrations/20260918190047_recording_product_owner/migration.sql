-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
