-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('FREELANCE', 'PERSONAL', 'RESEARCH', 'GAME');

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "category" "ProjectCategory" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN     "client" TEXT,
ADD COLUMN     "impact" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "statusText" TEXT;

-- CreateIndex
CREATE INDEX "Experience_sortOrder_idx" ON "Experience"("sortOrder");

-- CreateIndex
CREATE INDEX "Project_category_published_sortOrder_idx" ON "Project"("category", "published", "sortOrder");

-- CreateIndex
CREATE INDEX "Project_published_sortOrder_idx" ON "Project"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Skill_category_sortOrder_idx" ON "Skill"("category", "sortOrder");
