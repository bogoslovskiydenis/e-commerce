/*
  Warnings:

  - You are about to drop the column `ip_address` on the `admin_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `admin_logs` table. All the data in the column will be lost.
  - The `level` column on the `admin_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `callbacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminMessage` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTime` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `processedById` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `callbacks` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `callbacks` table. All the data in the column will be lost.
  - The `status` column on the `callbacks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `callbacks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorAvatar` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `authorEmail` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `moderatedAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `moderatedById` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `moderatorMessage` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `comments` table. All the data in the column will be lost.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `payment_status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `ip` to the `admin_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_type` to the `admin_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `admin_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `callbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('SUPER_ADMIN', 'ADMINISTRATOR', 'MANAGER', 'CRM_MANAGER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('NEW', 'CONFIRMED', 'PROCESSING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "callback_status" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "callback_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "log_level" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "banner_position" AS ENUM ('MAIN', 'CATEGORY', 'SIDEBAR', 'FOOTER', 'POPUP');

-- CreateEnum
CREATE TYPE "promotion_type" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_ONE_GET_ONE');

-- DropForeignKey
ALTER TABLE "callbacks" DROP CONSTRAINT "callbacks_processedById_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_moderatedById_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_productId_fkey";

-- DropIndex
DROP INDEX "callbacks_createdAt_idx";

-- DropIndex
DROP INDEX "callbacks_processedAt_idx";

-- DropIndex
DROP INDEX "callbacks_status_idx";

-- DropIndex
DROP INDEX "comments_createdAt_idx";

-- DropIndex
DROP INDEX "comments_productId_idx";

-- DropIndex
DROP INDEX "comments_rating_idx";

-- DropIndex
DROP INDEX "comments_status_idx";

-- AlterTable
ALTER TABLE "admin_logs" DROP COLUMN "ip_address",
DROP COLUMN "resource",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "resource_type" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "log_level" NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "callbacks" DROP CONSTRAINT "callbacks_pkey",
DROP COLUMN "adminMessage",
DROP COLUMN "createdAt",
DROP COLUMN "ipAddress",
DROP COLUMN "preferredTime",
DROP COLUMN "processedAt",
DROP COLUMN "processedById",
DROP COLUMN "updatedAt",
DROP COLUMN "userAgent",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "manager_id" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "callback_status" NOT NULL DEFAULT 'NEW',
DROP COLUMN "priority",
ADD COLUMN     "priority" "callback_priority" NOT NULL DEFAULT 'MEDIUM',
ALTER COLUMN "source" SET DEFAULT 'website',
ADD CONSTRAINT "callbacks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "callbacks_id_seq";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT;

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
DROP COLUMN "authorAvatar",
DROP COLUMN "authorEmail",
DROP COLUMN "authorName",
DROP COLUMN "content",
DROP COLUMN "createdAt",
DROP COLUMN "ipAddress",
DROP COLUMN "isVerified",
DROP COLUMN "moderatedAt",
DROP COLUMN "moderatedById",
DROP COLUMN "moderatorMessage",
DROP COLUMN "productId",
DROP COLUMN "rating",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "userAgent",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "moderator_id" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "delivery_date" TIMESTAMP(3),
ADD COLUMN     "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shipping_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "order_status" NOT NULL DEFAULT 'NEW',
DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" "payment_status" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "source" SET DEFAULT 'website';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "weight" DECIMAL(8,3);

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "description" TEXT,
ADD COLUMN     "group" TEXT,
ALTER COLUMN "type" SET DEFAULT 'string';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "custom_permissions" TEXT[],
DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL;

-- DropEnum
DROP TYPE "CallbackPriority";

-- DropEnum
DROP TYPE "CallbackStatus";

-- DropEnum
DROP TYPE "CommentStatus";

-- DropEnum
DROP TYPE "LogLevel";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "order_status" NOT NULL,
    "comment" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "status" "review_status" NOT NULL DEFAULT 'PENDING',
    "moderator_id" TEXT,
    "moderated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "mobile_image_url" TEXT,
    "link" TEXT,
    "button_text" TEXT,
    "position" "banner_position" NOT NULL DEFAULT 'MAIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "template" TEXT DEFAULT 'default',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "type" "promotion_type" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "min_order_amount" DECIMAL(10,2),
    "max_usage" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_products" (
    "id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "promotion_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_index" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cache" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_products_promotion_id_product_id_key" ON "promotion_products"("promotion_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- CreateIndex
CREATE INDEX "search_index_type_entity_id_idx" ON "search_index"("type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "cache_key_key" ON "cache"("key");

-- CreateIndex
CREATE INDEX "cache_expires_at_idx" ON "cache"("expires_at");

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callbacks" ADD CONSTRAINT "callbacks_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callbacks" ADD CONSTRAINT "callbacks_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
