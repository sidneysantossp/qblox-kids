-- Add flash sale fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_flash_sale BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS flash_sale_end_time TIMESTAMP WITH TIME ZONE;

-- Create index for flash sale queries
CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON products(is_flash_sale, flash_sale_end_time) WHERE is_flash_sale = TRUE;

-- Add comment
COMMENT ON COLUMN products.is_flash_sale IS 'Indica se o produto está em oferta relâmpago';
COMMENT ON COLUMN products.flash_sale_end_time IS 'Data e hora de término da oferta relâmpago';