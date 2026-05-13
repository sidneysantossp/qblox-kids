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
    'special_highlight',
    'thematic_collections'
  )
);

INSERT INTO homepage_sections (section_type, title, subtitle, is_active, display_order, config)
VALUES (
  'thematic_collections',
  'Coleções Temáticas',
  'Explore mundos diferentes e encontre seus personagens favoritos',
  true,
  7,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;
