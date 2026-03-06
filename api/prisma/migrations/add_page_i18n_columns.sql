-- Добавляет колонки локализации для страниц (uk/ru/en). Не трогает customers.
-- Из папки api выполнить: psql -U postgres -d balloonshop -f prisma/migrations/add_page_i18n_columns.sql
-- Если пользователь БД другой — подставь его вместо postgres (например -U denis).

ALTER TABLE pages ADD COLUMN IF NOT EXISTS title_uk TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS title_ru TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_uk TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_ru TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS excerpt_uk TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS excerpt_ru TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS excerpt_en TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_title_uk TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_title_ru TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_title_en TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description_uk TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description_ru TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description_en TEXT;
