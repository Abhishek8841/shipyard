-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "env" JSONB,
ALTER COLUMN "directory" SET DEFAULT '.';
