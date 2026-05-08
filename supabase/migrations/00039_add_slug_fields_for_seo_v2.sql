
-- Enable unaccent extension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add slug field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add slug field to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          unaccent(text_input),
          '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate slugs for existing products (if name exists)
UPDATE products 
SET slug = generate_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Generate slugs for existing categories (if name exists)
UPDATE categories 
SET slug = generate_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Create trigger to auto-generate slug on insert/update for products
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_product_slug ON products;
CREATE TRIGGER trigger_auto_generate_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_product_slug();

-- Create trigger to auto-generate slug on insert/update for categories
CREATE OR REPLACE FUNCTION auto_generate_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_category_slug ON categories;
CREATE TRIGGER trigger_auto_generate_category_slug
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_category_slug();

-- Add comment
COMMENT ON COLUMN products.slug IS 'URL-friendly slug gerado automaticamente a partir do nome';
COMMENT ON COLUMN categories.slug IS 'URL-friendly slug gerado automaticamente a partir do nome';
