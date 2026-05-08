
-- Update blog_posts table structure
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER;

-- Rename views to views_count if needed
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='views') THEN
    ALTER TABLE blog_posts RENAME COLUMN views TO views_count;
  END IF;
END $$;

-- Add views_count if it doesn't exist
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Change author_id to author (text) if needed
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'QBLOX';

-- Add comments
COMMENT ON COLUMN blog_posts.keywords IS 'Keywords para SEO';
COMMENT ON COLUMN blog_posts.meta_title IS 'Título SEO customizado';
COMMENT ON COLUMN blog_posts.meta_description IS 'Descrição SEO customizada';
COMMENT ON COLUMN blog_posts.reading_time IS 'Tempo de leitura em minutos';
