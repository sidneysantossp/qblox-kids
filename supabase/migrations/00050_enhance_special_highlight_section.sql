UPDATE homepage_sections
SET display_order = 8
WHERE section_type = 'special_highlight';

UPDATE homepage_sections
SET config = COALESCE(config, '{}'::jsonb) || jsonb_build_object(
  'background_type', COALESCE(config->>'background_type', 'gradient'),
  'background_image_url', COALESCE(config->>'background_image_url', ''),
  'background_color', COALESCE(config->>'background_color', '#061A33'),
  'background_gradient_from', COALESCE(config->>'background_gradient_from', '#061A33'),
  'background_gradient_via', COALESCE(config->>'background_gradient_via', '#0057D9'),
  'background_gradient_to', COALESCE(config->>'background_gradient_to', '#003A99'),
  'background_overlay', COALESCE(config->>'background_overlay', 'rgba(0, 0, 0, 0)'),
  'background_image_position_y', COALESCE((config->>'background_image_position_y')::int, 50)
)
WHERE section_type = 'special_highlight';
