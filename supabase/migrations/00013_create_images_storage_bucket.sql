-- Criar bucket de imagens para banners e produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Política para permitir upload de imagens (apenas admins)
CREATE POLICY "Admins podem fazer upload de imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Política para permitir leitura pública de imagens
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Política para permitir atualização de imagens (apenas admins)
CREATE POLICY "Admins podem atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Política para permitir exclusão de imagens (apenas admins)
CREATE POLICY "Admins podem excluir imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);