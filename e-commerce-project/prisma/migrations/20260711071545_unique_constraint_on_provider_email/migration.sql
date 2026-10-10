/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ServiceProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_email_key" ON "ServiceProvider"("email");
