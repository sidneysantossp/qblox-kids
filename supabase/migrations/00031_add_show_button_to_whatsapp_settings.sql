-- Adicionar campo show_button para controlar visibilidade do botão no frontend
ALTER TABLE whatsapp_settings
ADD COLUMN IF NOT EXISTS show_button BOOLEAN DEFAULT true;

-- Atualizar registros existentes para mostrar o botão por padrão
UPDATE whatsapp_settings
SET show_button = true
WHERE show_button IS NULL;