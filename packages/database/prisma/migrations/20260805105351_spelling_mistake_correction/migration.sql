/*
  Warnings:

  - You are about to drop the column `deploymenId` on the `Log` table. All the data in the column will be lost.
  - Added the required column `deploymentId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_deploymenId_fkey";

-- DropIndex
DROP INDEX "Log_deploymenId_idx";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "deploymenId",
ADD COLUMN     "deploymentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Log_deploymentId_idx" ON "Log"("deploymentId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
