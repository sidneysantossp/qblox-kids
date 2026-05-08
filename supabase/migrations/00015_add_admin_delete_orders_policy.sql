
-- Add policy for admins to delete orders
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

CREATE POLICY "Admins can delete orders"
ON orders
FOR DELETE
TO public
USING (is_admin());
