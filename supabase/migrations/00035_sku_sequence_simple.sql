-- Criar sequência para SKU
CREATE SEQUENCE IF NOT EXISTS product_sku_seq START 1;

-- Função simples para gerar SKU usando sequência
CREATE OR REPLACE FUNCTION generate_sku_from_sequence()
RETURNS TEXT AS $$
BEGIN
  RETURN 'QB-' || LPAD(nextval('product_sku_seq')::TEXT, 2, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger function para gerar SKU automaticamente
CREATE OR REPLACE FUNCTION auto_set_product_sku()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL OR NEW.sku = '' THEN
    NEW.sku := generate_sku_from_sequence();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS trigger_set_product_sku ON products;

-- Criar novo trigger
CREATE TRIGGER trigger_auto_set_product_sku
  BEFORE INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_product_sku();