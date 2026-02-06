/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Drop existing foreign key and unique constraint
ALTER TABLE "Product" DROP CONSTRAINT "Product_storeId_fkey";
DROP INDEX "Product_storeId_slug_key";

-- Step 2: Add workspaceId column as nullable first
ALTER TABLE "Product" ADD COLUMN "workspaceId" TEXT;

-- Step 3: Backfill workspaceId from existing store relationships
UPDATE "Product" p
SET "workspaceId" = s."workspaceId"
FROM "Store" s
WHERE p."storeId" = s.id;

-- Step 4: Make workspaceId NOT NULL now that it's populated
ALTER TABLE "Product" ALTER COLUMN "workspaceId" SET NOT NULL;

-- Step 5: Make storeId nullable
ALTER TABLE "Product" ALTER COLUMN "storeId" DROP NOT NULL;

-- Step 6: Create indexes
CREATE INDEX "Product_workspaceId_idx" ON "Product"("workspaceId");
CREATE UNIQUE INDEX "Product_workspaceId_slug_key" ON "Product"("workspaceId", "slug");

-- Step 7: Add foreign keys
ALTER TABLE "Product" ADD CONSTRAINT "Product_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
