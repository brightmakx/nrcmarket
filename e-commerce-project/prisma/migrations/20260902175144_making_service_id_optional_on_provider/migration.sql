/*
  Warnings:

  - You are about to drop the `Agrent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceProvider" DROP CONSTRAINT "ServiceProvider_serviceId_fkey";

-- AlterTable
ALTER TABLE "ServiceProvider" ALTER COLUMN "serviceId" DROP NOT NULL;

-- DropTable
DROP TABLE "Agrent";

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
