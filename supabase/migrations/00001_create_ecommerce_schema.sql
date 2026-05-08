-- Criar tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de carrinho
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_sale ON products(is_on_sale);
CREATE INDEX idx_cart_session ON cart_items(session_id);

-- Inserir produtos de exemplo
INSERT INTO products (name, description, price, original_price, category, image_url, stock, is_featured, is_bestseller, is_on_sale, rating, reviews_count) VALUES
-- Super Heróis
('Set Super Heróis Marvel 16 Figuras', 'Coleção completa com 16 mini figuras de super heróis Marvel incluindo Homem de Ferro, Capitão América, Thor, Hulk e mais!', 89.90, 129.90, 'Super Heróis', 'placeholder-marvel-heroes.jpg', 50, true, true, true, 4.8, 127),
('Set Vingadores Ultimato', 'Conjunto com 8 figuras dos Vingadores em suas versões do filme Ultimato', 69.90, 99.90, 'Super Heróis', 'placeholder-avengers.jpg', 35, true, false, true, 4.7, 89),
('Batman e Liga da Justiça', 'Set com 12 figuras da DC incluindo Batman, Superman, Mulher Maravilha e mais', 79.90, 0, 'Super Heróis', 'placeholder-justice-league.jpg', 42, false, true, false, 4.6, 65),
('Homem-Aranha Multiverso', 'Coleção com diferentes versões do Homem-Aranha', 59.90, 0, 'Super Heróis', 'placeholder-spiderman.jpg', 28, false, false, false, 4.5, 43),

-- Roblox
('Roblox Mystery Box 12 Figuras', 'Caixa misteriosa com 12 personagens aleatórios do Roblox', 64.90, 89.90, 'Roblox', 'placeholder-roblox-mystery.jpg', 60, true, true, true, 4.9, 156),
('Roblox Aventureiros', 'Set com 8 personagens aventureiros do Roblox', 54.90, 0, 'Roblox', 'placeholder-roblox-adventure.jpg', 45, false, true, false, 4.7, 92),
('Roblox Profissões', 'Conjunto com personagens de diferentes profissões', 49.90, 0, 'Roblox', 'placeholder-roblox-jobs.jpg', 38, false, false, false, 4.6, 71),

-- Séries da TV
('Stranger Things Gang', 'Personagens principais de Stranger Things', 74.90, 0, 'Séries da TV', 'placeholder-stranger-things.jpg', 32, false, true, false, 4.8, 104),
('The Mandalorian e Baby Yoda', 'Set com personagens de The Mandalorian', 69.90, 94.90, 'Séries da TV', 'placeholder-mandalorian.jpg', 25, true, false, true, 4.9, 178),
('Pokémon Iniciais', 'Coleção com Pikachu e pokémons iniciais', 59.90, 0, 'Séries da TV', 'placeholder-pokemon.jpg', 55, false, true, false, 4.7, 134),

-- Aventura
('Piratas do Caribe', 'Set de aventura pirata com 10 figuras', 64.90, 0, 'Aventura', 'placeholder-pirates.jpg', 40, false, false, false, 4.5, 67),
('Exploradores da Selva', 'Aventureiros e animais selvagens', 54.90, 0, 'Aventura', 'placeholder-jungle.jpg', 33, false, false, false, 4.4, 52),
('Cavaleiros Medievais', 'Conjunto de cavaleiros e dragões', 69.90, 0, 'Aventura', 'placeholder-knights.jpg', 28, false, true, false, 4.6, 78),

-- Temáticos
('Bombeiros em Ação', 'Set temático de bombeiros com veículos', 74.90, 0, 'Temáticos', 'placeholder-firefighters.jpg', 36, false, false, false, 4.7, 85),
('Polícia e Resgate', 'Conjunto de policiais e veículos de resgate', 69.90, 0, 'Temáticos', 'placeholder-police.jpg', 42, false, false, false, 4.5, 63),
('Astronautas Espaciais', 'Exploração espacial com astronautas e nave', 79.90, 0, 'Temáticos', 'placeholder-space.jpg', 30, true, false, false, 4.8, 96),

-- Lançamentos
('Guardiões da Galáxia Vol. 3', 'Novos personagens do filme mais recente', 84.90, 0, 'Lançamentos', 'placeholder-guardians.jpg', 20, true, false, false, 4.9, 45),
('Super Mario Bros Movie', 'Personagens do filme do Super Mario', 79.90, 0, 'Lançamentos', 'placeholder-mario.jpg', 18, true, true, false, 4.8, 67),
('Barbie Dreamhouse', 'Coleção inspirada no filme da Barbie', 74.90, 0, 'Lançamentos', 'placeholder-barbie.jpg', 22, true, false, false, 4.7, 54),
('Sonic 2 O Filme', 'Sonic, Tails e Knuckles do filme', 69.90, 0, 'Lançamentos', 'placeholder-sonic.jpg', 25, false, false, false, 4.6, 38);