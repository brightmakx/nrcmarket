-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "message" TEXT,
    "fee" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_providerId_idx" ON "Booking"("providerId");

-- CreateIndex
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
