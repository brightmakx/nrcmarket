-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "parentOrderId" INTEGER,
ADD COLUMN     "sellerId" TEXT;

-- CreateTable
CREATE TABLE "ParentOrder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ParentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParentOrder_userId_idx" ON "ParentOrder"("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_parentOrderId_fkey" FOREIGN KEY ("parentOrderId") REFERENCES "ParentOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentOrder" ADD CONSTRAINT "ParentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
