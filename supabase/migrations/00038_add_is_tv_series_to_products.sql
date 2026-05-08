-- Adicionar campo is_tv_series à tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_tv_series BOOLEAN DEFAULT false;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_products_is_tv_series ON products(is_tv_series) WHERE is_tv_series = true;