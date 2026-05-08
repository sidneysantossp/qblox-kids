-- Adicionar coluna categories (array) para suportar múltiplas categorias
ALTER TABLE products ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrar dados existentes da coluna category para categories
UPDATE products 
SET categories = ARRAY[category]
WHERE categories = ARRAY[]::TEXT[] AND category IS NOT NULL;

-- Criar índice para melhor performance em buscas por categoria
CREATE INDEX IF NOT EXISTS idx_products_categories ON products USING GIN(categories);

-- Manter a coluna category por compatibilidade (será a categoria principal)
-- Mas agora products.categories será o campo principal para múltiplas categorias