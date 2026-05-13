ALTER TABLE mini_banners ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE mini_banners ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE mini_banners ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'promo_mini';

INSERT INTO mini_banners (title, subtitle, image_url, link_url, button_text, display_order, is_active, placement)
VALUES
  ('Aventura na Selva', 'Exploradores, mapas, tesouros e animais', '', '/categoria/aventura', 'Explorar', 1, true, 'thematic_collection'),
  ('Missão Espacial', 'Astronautas, robôs e galáxias distantes', '', '/categoria/espaco', 'Explorar', 2, true, 'thematic_collection'),
  ('Cidade em Ação', 'Bombeiros, policiais e construtores', '', '/categoria/cidade', 'Ver coleção', 3, true, 'thematic_collection'),
  ('Piratas dos Blocos', 'Navios, capitães e tesouros escondidos', '', '/categoria/piratas', 'Ver coleção', 4, true, 'thematic_collection'),
  ('Colecionáveis Raros', 'Peças especiais para fãs exigentes', '', '/categoria/colecionaveis', 'Ver coleção', 5, true, 'thematic_collection')
ON CONFLICT DO NOTHING;
