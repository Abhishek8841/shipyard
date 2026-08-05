-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_userId_fkey";

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "deploymenId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_deploymenId_idx" ON "Log"("deploymenId");

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_deploymenId_fkey" FOREIGN KEY ("deploymenId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
