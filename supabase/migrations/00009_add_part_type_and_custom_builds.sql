-- Add part_type field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS part_type TEXT;

-- Create index for part_type
CREATE INDEX IF NOT EXISTS idx_products_part_type ON products(part_type);

-- Create custom_builds table to store user's custom figure configurations
CREATE TABLE IF NOT EXISTS custom_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Minha Figura Personalizada',
  head_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  helmet_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  body_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  arms_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  legs_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  accessory_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for session_id
CREATE INDEX IF NOT EXISTS idx_custom_builds_session ON custom_builds(session_id);
CREATE INDEX IF NOT EXISTS idx_custom_builds_user ON custom_builds(user_id);

-- Insert sample part products for "Monte sua Coleção" category
INSERT INTO products (name, description, price, category, part_type, image_url, stock, rating, reviews_count) VALUES
-- Cabeças
('Cabeça Sorridente Clássica', 'Cabeça amarela com sorriso clássico', 4.90, 'Monte sua Coleção', 'head', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 100, 4.8, 45),
('Cabeça Aventureira', 'Cabeça com expressão aventureira e óculos', 5.90, 'Monte sua Coleção', 'head', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 80, 4.7, 32),
('Cabeça Super Herói', 'Cabeça com máscara de super herói', 6.90, 'Monte sua Coleção', 'head', 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=400&fit=crop', 75, 4.9, 58),
('Cabeça Pirata', 'Cabeça com tapa-olho e barba', 5.90, 'Monte sua Coleção', 'head', 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=400&h=400&fit=crop', 65, 4.6, 28),

-- Capacetes
('Capacete de Astronauta', 'Capacete espacial transparente', 7.90, 'Monte sua Coleção', 'helmet', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop', 90, 4.9, 67),
('Capacete Medieval', 'Capacete de cavaleiro com viseira', 6.90, 'Monte sua Coleção', 'helmet', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', 70, 4.7, 41),
('Capacete de Bombeiro', 'Capacete vermelho de bombeiro', 5.90, 'Monte sua Coleção', 'helmet', 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=400&fit=crop', 85, 4.8, 52),
('Capacete de Piloto', 'Capacete de corrida com detalhes', 6.90, 'Monte sua Coleção', 'helmet', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 60, 4.6, 35),

-- Corpos
('Corpo Super Herói Azul', 'Torso com uniforme de super herói azul', 8.90, 'Monte sua Coleção', 'body', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop', 95, 4.9, 73),
('Corpo Astronauta', 'Torso com traje espacial branco', 9.90, 'Monte sua Coleção', 'body', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop', 80, 4.8, 61),
('Corpo Pirata', 'Torso com camisa listrada de pirata', 7.90, 'Monte sua Coleção', 'body', 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=400&h=400&fit=crop', 75, 4.7, 48),
('Corpo Cavaleiro', 'Torso com armadura medieval', 8.90, 'Monte sua Coleção', 'body', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', 70, 4.8, 55),

-- Braços
('Braços Amarelos Clássicos', 'Par de braços amarelos padrão', 3.90, 'Monte sua Coleção', 'arms', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 120, 4.7, 89),
('Braços com Luvas Espaciais', 'Braços com luvas de astronauta', 4.90, 'Monte sua Coleção', 'arms', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop', 85, 4.8, 64),
('Braços de Super Herói', 'Braços musculosos de herói', 5.90, 'Monte sua Coleção', 'arms', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop', 90, 4.9, 71),
('Braços de Cavaleiro', 'Braços com proteção de armadura', 4.90, 'Monte sua Coleção', 'arms', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', 75, 4.6, 42),

-- Pernas
('Pernas Azuis Clássicas', 'Par de pernas azuis padrão', 4.90, 'Monte sua Coleção', 'legs', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 110, 4.7, 76),
('Pernas de Astronauta', 'Pernas com traje espacial', 5.90, 'Monte sua Coleção', 'legs', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop', 80, 4.8, 58),
('Pernas de Super Herói', 'Pernas com uniforme de herói', 6.90, 'Monte sua Coleção', 'legs', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop', 85, 4.9, 69),
('Pernas de Pirata', 'Pernas com calça de pirata', 5.90, 'Monte sua Coleção', 'legs', 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=400&h=400&fit=crop', 70, 4.6, 44),

-- Acessórios
('Espada Laser Azul', 'Espada de luz azul brilhante', 6.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&h=400&fit=crop', 100, 4.9, 92),
('Espada Medieval', 'Espada de cavaleiro prateada', 5.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', 90, 4.8, 67),
('Pistola Espacial', 'Arma futurista de raios', 6.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop', 85, 4.7, 54),
('Machado de Batalha', 'Machado duplo de guerreiro', 7.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=400&fit=crop', 75, 4.8, 61),
('Escudo Capitão', 'Escudo redondo com estrela', 8.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=400&fit=crop', 80, 4.9, 88),
('Picareta de Diamante', 'Picareta azul brilhante', 6.90, 'Monte sua Coleção', 'accessory', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 95, 4.8, 73);