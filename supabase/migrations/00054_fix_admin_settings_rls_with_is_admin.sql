CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  IF (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  IF (auth.jwt() ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can read all settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON site_settings;

CREATE POLICY "Admins can read all settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can update settings" ON settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON settings;

CREATE POLICY "Admin can read settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete settings"
  ON settings
  FOR DELETE
  TO authenticated
  USING (is_admin());
