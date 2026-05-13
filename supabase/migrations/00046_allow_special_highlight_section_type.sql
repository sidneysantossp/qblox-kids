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
