-- CreateEnum
CREATE TYPE "category_type" AS ENUM ('PRODUCTS', 'BALLOONS', 'GIFTS', 'EVENTS', 'COLORS', 'MATERIALS', 'OCCASIONS');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "banner_url" TEXT,
ADD COLUMN     "filters" JSONB,
ADD COLUMN     "meta_keywords" TEXT,
ADD COLUMN     "show_in_navigation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "category_type" NOT NULL DEFAULT 'PRODUCTS';

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "categories"("type");

-- CreateIndex
CREATE INDEX "categories_is_active_idx" ON "categories"("is_active");

-- CreateIndex
CREATE INDEX "categories_show_in_navigation_idx" ON "categories"("show_in_navigation");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");
