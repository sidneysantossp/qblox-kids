-- Adicionar campos para integração com Asaas
ALTER TABLE orders ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS asaas_invoice_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS asaas_bank_slip_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS asaas_pix_qr_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS asaas_pix_copy_paste TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'stripe';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_type TEXT;

-- Criar índice para busca rápida por payment_id do Asaas
CREATE INDEX IF NOT EXISTS idx_orders_asaas_payment_id ON orders(asaas_payment_id);

-- Comentários para documentação
COMMENT ON COLUMN orders.asaas_payment_id IS 'ID da cobrança no Asaas';
COMMENT ON COLUMN orders.asaas_invoice_url IS 'URL da fatura no Asaas';
COMMENT ON COLUMN orders.asaas_bank_slip_url IS 'URL do boleto bancário';
COMMENT ON COLUMN orders.asaas_pix_qr_code IS 'QR Code do Pix em base64';
COMMENT ON COLUMN orders.asaas_pix_copy_paste IS 'Código Pix copia e cola';
COMMENT ON COLUMN orders.payment_gateway IS 'Gateway de pagamento usado (stripe ou asaas)';
COMMENT ON COLUMN orders.payment_method_type IS 'Tipo de método de pagamento (pix, boleto, credit_card)';