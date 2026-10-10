/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `productCount` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PROCESSING', 'CANSELLED', 'DELIVERED');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "productCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "orderId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordered_products" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderTimePrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ordered_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ordered_products_orderId_productId_key" ON "ordered_products"("orderId", "productId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
