-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Currency_workspaceId_idx" ON "Currency"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_workspaceId_code_key" ON "Currency"("workspaceId", "code");

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
