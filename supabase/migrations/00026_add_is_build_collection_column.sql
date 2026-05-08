-- Add is_build_collection column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_build_collection BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_is_build_collection ON products(is_build_collection) WHERE is_build_collection = TRUE;

-- Update existing products that have "Monte sua Coleção" in categories
UPDATE products
SET is_build_collection = TRUE
WHERE 'Monte sua Coleção' = ANY(categories);

-- Add comment
COMMENT ON COLUMN products.is_build_collection IS 'Indica se o produto faz parte da seção Monte sua Coleção';