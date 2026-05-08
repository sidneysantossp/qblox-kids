
-- Add admin role to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create hero_banners table
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on display_order and is_active
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON hero_banners(display_order, is_active);

-- Create homepage_sections table
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL CHECK (section_type IN ('promotional_cards', 'category_carousel', 'featured_products', 'best_sellers', 'on_sale')),
  title TEXT NOT NULL,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on section_type and display_order
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections(display_order, is_active);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on payment methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active, display_order);

-- Add categories table if not exists (for menu management)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, display_order);

-- Enable RLS on all tables
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hero_banners
DROP POLICY IF EXISTS "Anyone can view active hero banners" ON hero_banners;
CREATE POLICY "Anyone can view active hero banners" ON hero_banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage hero banners" ON hero_banners;
CREATE POLICY "Admins can manage hero banners" ON hero_banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for homepage_sections
DROP POLICY IF EXISTS "Anyone can view active sections" ON homepage_sections;
CREATE POLICY "Anyone can view active sections" ON homepage_sections
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage sections" ON homepage_sections;
CREATE POLICY "Admins can manage sections" ON homepage_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for blog_posts
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
CREATE POLICY "Anyone can view published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for payment_methods
DROP POLICY IF EXISTS "Anyone can view active payment methods" ON payment_methods;
CREATE POLICY "Anyone can view active payment methods" ON payment_methods
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage payment methods" ON payment_methods;
CREATE POLICY "Admins can manage payment methods" ON payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update products table RLS for admin access
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update orders table RLS for admin access
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default payment methods
INSERT INTO payment_methods (name, code, description, icon, is_active, display_order) VALUES
  ('Cartão de Crédito', 'credit_card', 'Pague com cartão de crédito em até 12x', 'credit-card', true, 1),
  ('Cartão de Débito', 'debit_card', 'Pague com cartão de débito', 'credit-card', true, 2),
  ('PIX', 'pix', 'Pagamento instantâneo via PIX', 'smartphone', true, 3),
  ('Boleto Bancário', 'boleto', 'Pague com boleto bancário', 'file-text', true, 4)
ON CONFLICT (code) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
  ('Super Heróis', 'super-herois', 'Bonecos de super heróis da Marvel e DC', 1, true),
  ('Roblox', 'roblox', 'Personagens do universo Roblox', 2, true),
  ('Séries da TV', 'series-tv', 'Personagens de séries de televisão', 3, true),
  ('Aventura', 'aventura', 'Bonecos temáticos de aventura', 4, true),
  ('Temáticos', 'tematicos', 'Coleções temáticas especiais', 5, true),
  ('Lançamentos', 'lancamentos', 'Últimos lançamentos e novidades', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default homepage sections
INSERT INTO homepage_sections (section_type, title, subtitle, is_active, display_order, config) VALUES
  ('promotional_cards', 'Vantagens', 'Confira nossas vantagens', true, 1, '{"cards": [{"title": "Promoções Especiais", "description": "Ofertas imperdíveis", "icon": "tag"}, {"title": "Frete Grátis", "description": "Acima de R$ 99,00", "icon": "truck"}, {"title": "Compra Segura", "description": "Ambiente 100% seguro", "icon": "shield"}]}'),
  ('category_carousel', 'Categorias', 'Explore nossas categorias', true, 2, '{}'),
  ('on_sale', 'Produtos em Oferta', 'Aproveite as ofertas por tempo limitado', true, 3, '{"limit": 6, "show_timer": true}'),
  ('best_sellers', 'Os Mais Vendidos', 'Produtos favoritos dos nossos clientes', true, 4, '{"limit": 8}'),
  ('featured_products', 'Produtos em Destaque', 'Seleção especial para você', true, 5, '{"limit": 8}')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_hero_banners_updated_at ON hero_banners;
CREATE TRIGGER update_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_sections_updated_at ON homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
