ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS show_in_navbar BOOLEAN DEFAULT true;

UPDATE categories
SET show_in_navbar = true
WHERE show_in_navbar IS NULL;
