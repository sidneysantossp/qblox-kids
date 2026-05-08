-- Alterar image_url para ser opcional
ALTER TABLE hero_banners ALTER COLUMN image_url DROP NOT NULL;

-- Inserir banner de exemplo
INSERT INTO hero_banners (
  title,
  subtitle,
  image_url,
  link_url,
  button_text,
  display_order,
  is_active
) VALUES (
  'COLECIONE. MONTE. AVENTURE-SE!',
  'MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!',
  NULL,
  '/categoria/lancamentos',
  'VER LANÇAMENTOS',
  0,
  true
);
