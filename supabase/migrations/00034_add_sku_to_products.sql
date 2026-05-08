-- Adicionar campo SKU à tabela products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Criar índice único para SKU
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Comentário para documentação
COMMENT ON COLUMN products.sku IS 'Código SKU único do produto (ex: QB-01)';