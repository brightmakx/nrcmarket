/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ordered_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ordered_products" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "Agrent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Agrent_pkey" PRIMARY KEY ("id")
);
