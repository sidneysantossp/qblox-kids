-- Adicionar colunas de método de pagamento à tabela orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card' CHECK (payment_method IN ('card', 'cash', 'pix', 'boleto')),
ADD COLUMN IF NOT EXISTS payment_method_id TEXT;