/*
  Warnings:

  - You are about to alter the column `rating` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal(3,2)`.
  - You are about to alter the column `rating` on the `ServiceProvider` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(3,2)`.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2);

-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,2);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReview" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductReview_productId_idx" ON "ProductReview"("productId");

-- CreateIndex
CREATE INDEX "ProductReview_userId_idx" ON "ProductReview"("userId");

-- CreateIndex
CREATE INDEX "ProductReview_orderId_idx" ON "ProductReview"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_userId_productId_key" ON "ProductReview"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceReview_bookingId_key" ON "ServiceReview"("bookingId");

-- CreateIndex
CREATE INDEX "ServiceReview_userId_idx" ON "ServiceReview"("userId");

-- CreateIndex
CREATE INDEX "ServiceReview_serviceId_idx" ON "ServiceReview"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceReview_providerId_idx" ON "ServiceReview"("providerId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "ordered_products_productId_idx" ON "ordered_products"("productId");

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReview" ADD CONSTRAINT "ServiceReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
