-- Create mini_banners table
CREATE TABLE IF NOT EXISTS mini_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on display_order and is_active
CREATE INDEX IF NOT EXISTS idx_mini_banners_order ON mini_banners(display_order, is_active);

-- Enable RLS
ALTER TABLE mini_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mini_banners
DROP POLICY IF EXISTS "Anyone can view active mini banners" ON mini_banners;
CREATE POLICY "Anyone can view active mini banners" ON mini_banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage mini banners" ON mini_banners;
CREATE POLICY "Admins can manage mini banners" ON mini_banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_mini_banners_updated_at ON mini_banners;
CREATE TRIGGER update_mini_banners_updated_at
  BEFORE UPDATE ON mini_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();