-- Add multilingual fields to categories
ALTER TABLE "categories" 
ADD COLUMN IF NOT EXISTS "name_uk" TEXT,
ADD COLUMN IF NOT EXISTS "name_ru" TEXT,
ADD COLUMN IF NOT EXISTS "name_en" TEXT,
ADD COLUMN IF NOT EXISTS "description_uk" TEXT,
ADD COLUMN IF NOT EXISTS "description_ru" TEXT,
ADD COLUMN IF NOT EXISTS "description_en" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_uk" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_ru" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_en" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_uk" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_ru" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_en" TEXT;

-- Add multilingual fields to products
ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "title_uk" TEXT,
ADD COLUMN IF NOT EXISTS "title_ru" TEXT,
ADD COLUMN IF NOT EXISTS "title_en" TEXT,
ADD COLUMN IF NOT EXISTS "description_uk" TEXT,
ADD COLUMN IF NOT EXISTS "description_ru" TEXT,
ADD COLUMN IF NOT EXISTS "description_en" TEXT,
ADD COLUMN IF NOT EXISTS "short_description_uk" TEXT,
ADD COLUMN IF NOT EXISTS "short_description_ru" TEXT,
ADD COLUMN IF NOT EXISTS "short_description_en" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_uk" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_ru" TEXT,
ADD COLUMN IF NOT EXISTS "meta_title_en" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_uk" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_ru" TEXT,
ADD COLUMN IF NOT EXISTS "meta_description_en" TEXT;

