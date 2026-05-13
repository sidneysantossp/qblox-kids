ALTER TABLE homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_section_type_check;

ALTER TABLE homepage_sections
ADD CONSTRAINT homepage_sections_section_type_check
CHECK (
  section_type IN (
    'promotional_cards',
    'category_carousel',
    'featured_products',
    'best_sellers',
    'on_sale',
    'special_highlight'
  )
);

INSERT INTO homepage_sections (section_type, title, subtitle, is_active, display_order, config)
VALUES (
  'special_highlight',
  'Destaque Especial',
  'Os bonecos mais desejados pelos colecionadores esta semana',
  true,
  6,
  '{
    "badge_text": "EDIÇÃO LIMITADA",
    "headline": "Coleção Guardiões Galácticos",
    "description": "Uma seleção exclusiva de minifiguras inspiradas em aventuras espaciais, perfeita para colecionadores que buscam peças únicas.",
    "features": ["6 personagens exclusivos", "Acessórios especiais inclusos", "Embalagem colecionável"],
    "image_url": "",
    "price_prefix": "A partir de",
    "price_value": "R$ 149,90",
    "primary_cta_text": "Comprar agora",
    "primary_cta_url": "/produto/colecao-guardioes-galacticos",
    "secondary_cta_text": "Ver detalhes",
    "secondary_cta_url": "/produto/colecao-guardioes-galacticos"
  }'::jsonb
)
ON CONFLICT DO NOTHING;
