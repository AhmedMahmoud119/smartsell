/*
  Warnings:

  - You are about to drop the column `shortDescription` on the `Product` table. All the data in the column will be lost.
  - Added the required column `value` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('COLOR', 'SIZE', 'TEXT');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shortDescription",
ADD COLUMN     "discountType" "DiscountType",
ADD COLUMN     "discountValue" INTEGER;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "colorCode" TEXT,
ADD COLUMN     "type" "VariantType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "value" TEXT NOT NULL;
