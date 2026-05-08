-- Adicionar política para permitir leitura pública de produtos
CREATE POLICY "Todos podem visualizar produtos"
ON products
FOR SELECT
TO public
USING (true);