-- Remover política de admin antiga
DROP POLICY IF EXISTS "Apenas admins podem modificar configurações do WhatsApp" ON whatsapp_settings;

-- Criar política de modificação para admins usando múltiplas fontes
CREATE POLICY "Apenas admins podem modificar configurações do WhatsApp"
ON whatsapp_settings
FOR ALL
TO authenticated
USING (
  -- Verificar role em user_metadata ou app_metadata ou JWT
  COALESCE(
    (auth.jwt()->>'role')::text,
    (auth.jwt()->'user_metadata'->>'role')::text,
    (auth.jwt()->'app_metadata'->>'role')::text
  ) = 'admin'
)
WITH CHECK (
  COALESCE(
    (auth.jwt()->>'role')::text,
    (auth.jwt()->'user_metadata'->>'role')::text,
    (auth.jwt()->'app_metadata'->>'role')::text
  ) = 'admin'
);