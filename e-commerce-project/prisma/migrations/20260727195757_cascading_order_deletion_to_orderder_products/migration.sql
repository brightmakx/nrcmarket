-- DropForeignKey
ALTER TABLE "ordered_products" DROP CONSTRAINT "ordered_products_orderId_fkey";

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
