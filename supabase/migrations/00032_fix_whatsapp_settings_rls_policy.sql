
-- Drop existing policies
DROP POLICY IF EXISTS "Apenas admins podem modificar configurações do WhatsApp" ON whatsapp_settings;
DROP POLICY IF EXISTS "Permitir leitura pública de configurações do WhatsApp" ON whatsapp_settings;

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check role in user_metadata
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check role in app_metadata
  IF (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check direct role claim
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies with the helper function
CREATE POLICY "Permitir leitura pública de configurações do WhatsApp"
  ON whatsapp_settings
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins podem modificar configurações do WhatsApp"
  ON whatsapp_settings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
