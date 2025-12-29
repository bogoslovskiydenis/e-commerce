-- AlterTable
ALTER TABLE "categories" ADD COLUMN "show_on_homepage" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "categories_show_on_homepage_idx" ON "categories"("show_on_homepage");


