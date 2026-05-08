
-- Add rich description and SEO fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS rich_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS age_recommendation TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS whats_included TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material TEXT DEFAULT 'Plástico ABS';

-- Add comments
COMMENT ON COLUMN products.rich_description IS 'Descrição rica do produto (200-300 palavras) para SEO';
COMMENT ON COLUMN products.age_recommendation IS 'Idade recomendada (ex: 6+, 8+, 10+)';
COMMENT ON COLUMN products.whats_included IS 'O que está incluído no kit';
COMMENT ON COLUMN products.material IS 'Material do produto (padrão: Plástico ABS)';

-- Update existing products with default rich descriptions based on name and category
UPDATE products 
SET rich_description = 
  CASE 
    WHEN rich_description IS NULL THEN
      'Boneco de montar ' || name || ' da categoria ' || category || '. ' ||
      'Produto compatível com blocos de montar tipo LEGO, fabricado em plástico ABS de alta qualidade. ' ||
      'Ideal para crianças que adoram montar e criar suas próprias histórias. ' ||
      'Desenvolve criatividade, coordenação motora e raciocínio lógico. ' ||
      'Peças resistentes e duráveis que se encaixam perfeitamente. ' ||
      'Compatível com outras marcas de blocos de construção. ' ||
      'Produto seguro, testado e aprovado para uso infantil. ' ||
      'Fácil de montar e desmontar, permitindo infinitas possibilidades de criação. ' ||
      'Perfeito para presentear ou para adicionar à sua coleção de bonecos de montar.'
    ELSE rich_description
  END
WHERE rich_description IS NULL OR rich_description = '';

-- Set default age recommendation
UPDATE products 
SET age_recommendation = '6+'
WHERE age_recommendation IS NULL;

-- Set default material
UPDATE products 
SET material = 'Plástico ABS'
WHERE material IS NULL;
