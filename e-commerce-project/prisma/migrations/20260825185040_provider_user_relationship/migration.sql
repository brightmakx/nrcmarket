/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ServiceProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ServiceProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceProvider" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_userId_key" ON "ServiceProvider"("userId");

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
