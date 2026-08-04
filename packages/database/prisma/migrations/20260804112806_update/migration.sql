/*
  Warnings:

  - A unique constraint covering the columns `[projectName]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deployment_projectName_key" ON "Deployment"("projectName");
