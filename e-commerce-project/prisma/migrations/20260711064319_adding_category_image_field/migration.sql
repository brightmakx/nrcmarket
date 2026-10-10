/*
  Warnings:

  - Added the required column `imageUrl` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ordered_products" ALTER COLUMN "quantity" SET DEFAULT 1;
