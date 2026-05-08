-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('blog', 'blog', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public read access
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Public read access for banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Public read access for blog"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

-- Create storage policies for admin upload/delete
CREATE POLICY "Admin upload products"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin delete products"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin delete banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin upload blog"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin delete blog"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);