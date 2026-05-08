-- Drop the old admin policy
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- Create a new, simpler admin policy using a function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new admin policy using the function
CREATE POLICY "Admins can view all orders v2"
ON orders
FOR SELECT
TO public
USING (is_admin());

-- Also update the admin update policy
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

CREATE POLICY "Admins can update orders v2"
ON orders
FOR UPDATE
TO public
USING (is_admin());