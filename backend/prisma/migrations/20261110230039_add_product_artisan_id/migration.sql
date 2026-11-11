-- AlterTable
ALTER TABLE "products" ADD COLUMN     "artisanId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
