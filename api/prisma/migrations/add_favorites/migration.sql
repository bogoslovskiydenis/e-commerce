-- CreateTable
CREATE TABLE IF NOT EXISTS "favorites" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_customer_id_product_id_key" ON "favorites"("customer_id", "product_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_customer_id_idx" ON "favorites"("customer_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "favorites_product_id_idx" ON "favorites"("product_id");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

