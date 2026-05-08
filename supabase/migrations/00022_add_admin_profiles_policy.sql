-- Adicionar política para admins visualizarem todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON profiles
FOR SELECT
TO public
USING (is_admin());