-- Criar tabela para configurações do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  welcome_message TEXT NOT NULL DEFAULT 'Olá! Como posso ajudar você?',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO whatsapp_settings (phone_number, welcome_message, is_active)
VALUES ('5511996384376', 'Olá! Bem-vindo à QBLOX KIDS! Como posso ajudar você hoje? 😊', true)
ON CONFLICT DO NOTHING;

-- Políticas de segurança
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública de configurações do WhatsApp"
  ON whatsapp_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Apenas admins podem modificar
CREATE POLICY "Apenas admins podem modificar configurações do WhatsApp"
  ON whatsapp_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );