/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AGENT', 'BASIC');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_key" ON "Agent"("userId");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
