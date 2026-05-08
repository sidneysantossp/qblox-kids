
-- Add rich content fields to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS faq JSONB;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add comments
COMMENT ON COLUMN categories.description IS 'Descrição curta da categoria';
COMMENT ON COLUMN categories.long_description IS 'Descrição longa (300-500 palavras) para SEO';
COMMENT ON COLUMN categories.faq IS 'FAQ da categoria em formato JSON [{question, answer}]';
COMMENT ON COLUMN categories.keywords IS 'Keywords principais da categoria';
COMMENT ON COLUMN categories.meta_title IS 'Título SEO customizado';
COMMENT ON COLUMN categories.meta_description IS 'Descrição SEO customizada';

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'QBLOX',
  category TEXT,
  tags TEXT[],
  keywords TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- em minutos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Add RLS policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Update categories with rich content
UPDATE categories SET 
  long_description = CASE name
    WHEN 'Super Heróis' THEN 
      'Descubra nossa incrível coleção de bonecos de montar de Super-Heróis! Aqui você encontra os personagens mais icônicos da Marvel e DC Comics em formato de blocos de montar compatíveis com LEGO. Nossa linha inclui heróis como Homem-Aranha, Batman, Superman, Homem de Ferro, Capitão América e muitos outros.

Cada boneco é cuidadosamente projetado com detalhes autênticos dos personagens originais, incluindo trajes, acessórios e armas características. Fabricados em plástico ABS de alta qualidade, nossos bonecos são duráveis e seguros para crianças a partir de 6 anos.

Os bonecos de montar de Super-Heróis são perfeitos para:
• Recriar cenas épicas dos filmes e quadrinhos
• Desenvolver criatividade e imaginação
• Colecionar seus heróis favoritos
• Presentear fãs de todas as idades
• Combinar com outros sets de blocos de montar

Todos os produtos são 100% compatíveis com blocos tipo LEGO, permitindo que você expanda sua coleção e crie aventuras ainda mais incríveis. Aproveite nosso frete grátis para compras acima de R$99 e garanta já seus heróis favoritos!'
    
    WHEN 'Roblox' THEN
      'Entre no universo Roblox com nossa coleção exclusiva de bonecos de montar! Traga seus personagens favoritos do jogo para o mundo real com minifiguras detalhadas e compatíveis com blocos tipo LEGO.

Nossa linha Roblox inclui os avatares mais populares, skins exclusivas e personagens icônicos da plataforma. Cada boneco é projetado para capturar a essência blocky característica do Roblox, mantendo a qualidade e durabilidade que você espera.

Características dos nossos bonecos Roblox:
• Design fiel aos personagens do jogo
• Peças intercambiáveis e customizáveis
• Compatibilidade total com blocos LEGO
• Material resistente (Plástico ABS)
• Ideal para crianças a partir de 6 anos

Perfeito para fãs de Roblox que querem:
• Colecionar seus avatares favoritos
• Criar cenários do jogo no mundo real
• Combinar com outros sets de construção
• Presentear outros jogadores
• Desenvolver criatividade offline

Monte, customize e crie suas próprias aventuras Roblox! Todos os produtos com garantia de qualidade e frete grátis acima de R$99.'
    
    WHEN 'Séries TV' THEN
      'Reviva seus momentos favoritos das séries de TV com nossa coleção de bonecos de montar! Encontre personagens de Stranger Things, The Walking Dead, Game of Thrones e outras séries populares em formato de blocos compatíveis com LEGO.

Nossa seleção inclui os protagonistas, vilões e personagens secundários mais amados das séries que marcaram época. Cada boneco é produzido com atenção aos detalhes, capturando as características únicas de cada personagem.

Destaques da coleção:
• Personagens de Stranger Things (Eleven, Mike, Dustin, etc.)
• Figuras de séries de ação e aventura
• Detalhes autênticos de figurinos e acessórios
• Qualidade premium em plástico ABS
• Compatível com todos os blocos tipo LEGO

Ideal para:
• Fãs de séries que querem colecionar
• Recriar cenas memoráveis
• Decorar estantes e escritórios
• Presentear outros fãs
• Combinar com cenários de blocos de montar

Cada produto vem com garantia de qualidade e é testado para segurança. Aproveite frete grátis em compras acima de R$99 e comece sua coleção hoje!'
    
    ELSE long_description
  END,
  keywords = CASE name
    WHEN 'Super Heróis' THEN ARRAY['boneco de montar super herói', 'minifiguras marvel blocos', 'boneco de montar vingadores', 'super herói lego', 'marvel blocos de montar']
    WHEN 'Roblox' THEN ARRAY['boneco de montar roblox', 'roblox blocos de montar', 'minifiguras roblox', 'roblox brinquedo', 'avatar roblox blocos']
    WHEN 'Séries TV' THEN ARRAY['boneco de montar stranger things', 'séries tv blocos', 'personagens séries montar', 'stranger things lego']
    WHEN 'Aventura' THEN ARRAY['bonecos aventura montar', 'blocos aventura', 'minifiguras aventura']
    WHEN 'Temáticos' THEN ARRAY['bonecos temáticos montar', 'blocos temáticos', 'coleção temática']
    WHEN 'Lançamentos' THEN ARRAY['lançamentos blocos montar', 'novos bonecos montar', 'últimos lançamentos lego']
    WHEN 'Acessórios' THEN ARRAY['acessórios blocos montar', 'peças avulsas lego', 'acessórios minifiguras']
    ELSE keywords
  END,
  faq = CASE name
    WHEN 'Super Heróis' THEN 
      '[
        {"question": "Os bonecos de Super-Heróis são compatíveis com LEGO?", "answer": "Sim! Todos os nossos bonecos de Super-Heróis são 100% compatíveis com blocos LEGO e outras marcas de blocos de construção."},
        {"question": "Qual a idade recomendada?", "answer": "Nossos bonecos são recomendados para crianças a partir de 6 anos, mas também são perfeitos para colecionadores adultos."},
        {"question": "Os bonecos vêm montados?", "answer": "Não, os bonecos vêm desmontados para você ter a experiência de montagem. É muito fácil e divertido!"},
        {"question": "Posso comprar apenas um boneco?", "answer": "Sim! Você pode comprar bonecos individuais ou kits completos, conforme sua preferência."}
      ]'::jsonb
    WHEN 'Roblox' THEN
      '[
        {"question": "São personagens oficiais do Roblox?", "answer": "Nossos bonecos são inspirados no universo Roblox e compatíveis com blocos tipo LEGO, perfeitos para fãs do jogo."},
        {"question": "Posso customizar os bonecos?", "answer": "Sim! As peças são intercambiáveis, permitindo criar combinações únicas, assim como no jogo."},
        {"question": "São compatíveis com LEGO?", "answer": "Sim, todos os nossos bonecos Roblox são 100% compatíveis com blocos LEGO."},
        {"question": "Qual o tamanho dos bonecos?", "answer": "Os bonecos têm tamanho padrão de minifiguras LEGO, aproximadamente 4-5cm de altura."}
      ]'::jsonb
    ELSE faq
  END
WHERE name IN ('Super Heróis', 'Roblox', 'Séries TV', 'Aventura', 'Temáticos', 'Lançamentos', 'Acessórios');
