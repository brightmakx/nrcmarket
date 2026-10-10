/*
  Warnings:

  - You are about to drop the column `orderId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_orderId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "orderId",
ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
