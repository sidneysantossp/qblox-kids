-- Adicionar método de pagamento em dinheiro
INSERT INTO payment_methods (name, code, description, icon, is_active, display_order) VALUES
  ('Dinheiro', 'cash', 'Pagamento em dinheiro na entrega', 'banknote', true, 5)
ON CONFLICT (code) DO NOTHING;