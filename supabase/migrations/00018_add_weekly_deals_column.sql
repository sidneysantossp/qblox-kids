-- Adicionar coluna is_weekly_deal à tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_weekly_deal BOOLEAN DEFAULT false;

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_products_is_weekly_deal ON products(is_weekly_deal) WHERE is_weekly_deal = true;

-- Atualizar alguns produtos para serem novidades da semana (produtos com desconto)
UPDATE products 
SET is_weekly_deal = true 
WHERE original_price > price 
  AND id IN (
    SELECT id FROM products 
    WHERE original_price > price 
    ORDER BY created_at DESC 
    LIMIT 8
  );