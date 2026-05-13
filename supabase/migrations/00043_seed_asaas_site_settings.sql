INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_secret)
VALUES
  ('asaas_api_key', '', 'text', 'Chave de API do Asaas para processar pagamentos', true),
  ('asaas_environment', 'sandbox', 'text', 'Ambiente do Asaas: sandbox ou production', false)
ON CONFLICT (setting_key) DO NOTHING;
