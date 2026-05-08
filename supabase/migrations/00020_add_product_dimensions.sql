-- Add shipping dimensions to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight INTEGER DEFAULT 500,
ADD COLUMN IF NOT EXISTS length INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 15;

-- Add comments for clarity
COMMENT ON COLUMN products.weight IS 'Peso do produto em gramas';
COMMENT ON COLUMN products.length IS 'Comprimento do produto em centímetros';
COMMENT ON COLUMN products.height IS 'Altura do produto em centímetros';
COMMENT ON COLUMN products.width IS 'Largura do produto em centímetros';