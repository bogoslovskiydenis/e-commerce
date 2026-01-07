-- AlterTable
ALTER TABLE "customers" ADD COLUMN "password_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "customers_phone_key" ON "customers"("phone");



