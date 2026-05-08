-- Adicionar coluna de status de disponibilidade aos produtos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN availability_status TEXT DEFAULT 'in_stock' CHECK (availability_status IN ('in_stock', 'made_to_order', 'unavailable'));
    
    COMMENT ON COLUMN products.availability_status IS 'Status de disponibilidade: in_stock (Pronta Entrega), made_to_order (Sob Encomenda), unavailable (Indisponível)';
  END IF;
END $$;