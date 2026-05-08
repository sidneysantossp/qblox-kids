-- Adicionar campos SEO à tabela products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Criar índice para melhor performance em buscas
CREATE INDEX IF NOT EXISTS idx_products_meta_title ON products(meta_title);

-- Comentários para documentação
COMMENT ON COLUMN products.meta_title IS 'Título SEO para meta tag title';
COMMENT ON COLUMN products.meta_description IS 'Descrição SEO para meta tag description';