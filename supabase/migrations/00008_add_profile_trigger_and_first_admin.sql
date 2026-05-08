-- Função para criar profile automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Contar quantos usuários já existem
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Inserir novo profile
  -- Se for o primeiro usuário, definir como admin
  INSERT INTO public.profiles (id, role, created_at, updated_at)
  VALUES (
    NEW.id,
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Atualizar usuários existentes que não têm profile
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT 
  au.id,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin')
    THEN 'admin'
    ELSE 'user'
  END,
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Se não houver nenhum admin, promover o primeiro usuário
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Verificar se há algum admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    -- Pegar o primeiro usuário (mais antigo)
    SELECT id INTO first_user_id
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;
    
    -- Promover para admin se encontrou um usuário
    IF first_user_id IS NOT NULL THEN
      UPDATE public.profiles
      SET role = 'admin'
      WHERE id = first_user_id;
    END IF;
  END IF;
END $$;
