-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir leitura pública de configurações do WhatsApp" ON whatsapp_settings;
DROP POLICY IF EXISTS "Apenas admins podem modificar configurações do WhatsApp" ON whatsapp_settings;

-- Criar política de leitura pública simples
CREATE POLICY "Permitir leitura pública de configurações do WhatsApp"
ON whatsapp_settings
FOR SELECT
TO public
USING (is_active = true);

-- Criar política de modificação para admins usando auth.jwt()
CREATE POLICY "Apenas admins podem modificar configurações do WhatsApp"
ON whatsapp_settings
FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'role')::text = 'admin'
)
WITH CHECK (
  (auth.jwt()->>'role')::text = 'admin'
);