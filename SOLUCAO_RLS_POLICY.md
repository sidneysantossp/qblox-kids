# 🚨 SOLUÇÃO: "new row violates row-level security policy"

## ✅ O QUE FAZER AGORA (Solução Rápida)

### Passo 1: Fazer Logout e Login Novamente 🔄

**ESTE É O PASSO MAIS IMPORTANTE!**

```
1. Clique no botão de logout (canto superior direito)
2. Feche TODAS as abas do site
3. Limpe o cache:
   - Pressione Ctrl+Shift+Delete
   - Marque "Cookies e outros dados do site"
   - Marque "Imagens e arquivos em cache"
   - Clique em "Limpar dados"
4. Feche o navegador completamente
5. Abra o navegador novamente
6. Acesse o site
7. Faça login novamente
```

**Por que isso é necessário?**
- O JWT (token de autenticação) precisa ser atualizado
- O JWT contém suas permissões de admin
- Sem atualizar, o banco não reconhece você como admin

### Passo 2: Usar o Botão Debug 🐛

Depois de fazer login novamente:

```
1. Acesse /admin/configuracoes
2. Clique no botão "Debug" (ao lado de "Testar Conexão")
3. Abra o console (pressione F12)
4. Verifique as informações mostradas
```

**O que você deve ver:**

```
=== DEBUG: INFORMAÇÕES DO USUÁRIO ===
📧 Email: seu-email@exemplo.com
🆔 User ID: xxx-xxx-xxx
👤 User Metadata: {role: 'admin'}
🎭 Role (user_metadata): admin
🔍 Debug Info do Banco: [{...}]
✅ is_admin() retornou: true
=== FIM DEBUG ===
```

**Se `is_admin()` retornar `false`:**
- Você precisa configurar a role admin no banco
- Veja a seção "Configurar Role Admin" abaixo

### Passo 3: Testar Conexão ✅

```
1. Clique em "Testar Conexão"
2. Aguarde a mensagem de sucesso
3. Se passar, prossiga para salvar
```

**Logs esperados no console:**

```
=== TESTANDO CONEXÃO ===
✓ Usuário autenticado: seu-email@exemplo.com
✓ User ID: xxx-xxx-xxx
✓ Role (user_metadata): admin
✓ User Metadata completo: {role: 'admin'}
✓ Permissão de admin confirmada no frontend
✓ is_admin() retornou: true
✓ Permissão de admin confirmada no backend
✓ Leitura bem-sucedida
✓ Escrita bem-sucedida
✓ Limpeza bem-sucedida
=== TESTE CONCLUÍDO COM SUCESSO ===
```

### Passo 4: Salvar Configurações 💾

```
1. Preencha os campos
2. Clique em "Salvar Configurações"
3. Aguarde a mensagem de sucesso
```

---

## 🔧 Configurar Role Admin (Se Necessário)

Se o debug mostrar que você não é admin, execute este SQL no Supabase:

```sql
-- Substitua 'seu-email@exemplo.com' pelo seu email
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

Depois:
1. Faça logout
2. Limpe o cache (Ctrl+Shift+Delete)
3. Feche o navegador
4. Abra novamente
5. Faça login
6. Tente novamente

---

## 🔍 Entendendo o Problema

### O que é RLS (Row Level Security)?

RLS é um sistema de segurança do PostgreSQL que controla quem pode acessar cada linha de uma tabela.

### Por que o erro acontece?

```
Erro: "new row violates row-level security policy for table 'settings'"
```

Isso significa que:
1. Você está tentando inserir/atualizar dados na tabela `settings`
2. A política RLS está verificando se você é admin
3. A função `is_admin()` está retornando `false`
4. Por isso, a operação é bloqueada

### Por que `is_admin()` retorna `false`?

Possíveis causas:

1. **JWT desatualizado** (MAIS COMUM)
   - Você configurou a role admin no banco
   - Mas não fez logout/login
   - O JWT ainda tem as permissões antigas
   - **Solução:** Logout + Limpar cache + Login

2. **Role não configurada**
   - Você não tem `role: 'admin'` no `user_metadata`
   - **Solução:** Executar o SQL acima

3. **Sessão corrompida**
   - Cache do navegador com dados antigos
   - **Solução:** Limpar cache completamente

---

## 🛠️ Melhorias Implementadas

### 1. Função `is_admin()` Melhorada

A função agora:
- ✅ Tenta múltiplos caminhos no JWT:
  - `user_metadata.role`
  - `app_metadata.role`
  - `role` direto
- ✅ Tem fallback para o banco de dados
- ✅ Adiciona logs detalhados
- ✅ Trata erros graciosamente

### 2. Função `debug_user_info()` Criada

Nova função para debug que mostra:
- ID do usuário
- Email
- Role do banco de dados
- JWT completo
- Resultado de `is_admin()`

### 3. Botão Debug no Frontend

- ✅ Mostra todas as informações do usuário
- ✅ Chama `debug_user_info()` do banco
- ✅ Chama `is_admin()` diretamente
- ✅ Logs detalhados no console

### 4. Teste de Conexão Aprimorado

Agora verifica:
- ✅ Autenticação do usuário
- ✅ Role no frontend (user_metadata)
- ✅ Chama `is_admin()` no backend
- ✅ Testa leitura da tabela
- ✅ Testa escrita na tabela
- ✅ Limpa dados de teste
- ✅ Logs detalhados em cada etapa

---

## 📊 Diagnóstico por Sintoma

### Sintoma 1: Debug mostra `is_admin() retornou: false`

**Causa:** Role não configurada ou JWT desatualizado

**Solução:**
```sql
-- 1. Verificar se a role está configurada
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'seu-email@exemplo.com';

-- Se retornar NULL ou não for 'admin':
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

Depois: Logout + Limpar cache + Login

### Sintoma 2: Debug mostra `Role (user_metadata): undefined`

**Causa:** JWT não tem a role

**Solução:**
1. Verifique se a role está no banco (SQL acima)
2. Faça logout
3. Limpe o cache (Ctrl+Shift+Delete)
4. Feche o navegador completamente
5. Abra novamente e faça login

### Sintoma 3: Teste de conexão falha na escrita

**Causa:** Política RLS bloqueando

**Solução:**
```sql
-- Verificar se as políticas existem
SELECT policyname, cmd
FROM pg_policies 
WHERE tablename = 'settings'
ORDER BY cmd;

-- Deve retornar 4 políticas (SELECT, INSERT, UPDATE, DELETE)
-- Se não retornar, recrie as políticas (veja CORRECAO_PERMISSION_DENIED.md)
```

### Sintoma 4: Erro "permission denied for table users"

**Causa:** Problema diferente, já corrigido

**Solução:** Veja [CORRECAO_PERMISSION_DENIED.md](./CORRECAO_PERMISSION_DENIED.md)

---

## 🧪 Testes Manuais

### Teste 1: Verificar Role no Banco

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role_db,
  created_at
FROM auth.users
WHERE email = 'seu-email@exemplo.com';
```

**Resultado esperado:**
```
email                    | role_db | created_at
------------------------|---------|------------------
seu-email@exemplo.com   | admin   | 2026-01-07 ...
```

### Teste 2: Testar is_admin() Diretamente

**No frontend (console F12):**
```javascript
const { data, error } = await supabase.rpc('is_admin');
console.log('is_admin:', data); // Deve ser true
```

### Teste 3: Verificar JWT

**No frontend (console F12):**
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User metadata:', user.user_metadata);
console.log('Role:', user.user_metadata?.role); // Deve ser 'admin'
```

### Teste 4: Testar Escrita Direta

```sql
-- Execute como usuário autenticado (não service_role)
INSERT INTO settings (key, value, description)
VALUES ('test_manual', 'test_value', 'Teste manual')
ON CONFLICT (key) DO UPDATE SET value = 'test_value';

-- Se funcionar, a política está OK
-- Se falhar, há problema com is_admin()
```

---

## 🎯 Checklist de Solução

Marque conforme for completando:

- [ ] Fiz logout
- [ ] Limpei o cache (Ctrl+Shift+Delete)
- [ ] Fechei o navegador completamente
- [ ] Abri o navegador novamente
- [ ] Fiz login
- [ ] Cliquei em "Debug"
- [ ] Verifiquei que `is_admin()` retorna `true`
- [ ] Cliquei em "Testar Conexão"
- [ ] O teste passou
- [ ] Consegui salvar as configurações

---

## 🆘 Se Nada Funcionar

### Última Tentativa: Recriar Tudo

```sql
-- 1. Limpar tudo
DROP POLICY IF EXISTS "Admin can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON settings;
DROP POLICY IF EXISTS "Admin can update settings" ON settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON settings;
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.debug_user_info();

-- 2. Recriar função is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  BEGIN
    user_role := current_setting('request.jwt.claims', true)::json->'user_metadata'->>'role';
    
    IF user_role IS NULL THEN
      user_role := current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role';
    END IF;
    
    IF user_role IS NULL THEN
      user_role := current_setting('request.jwt.claims', true)::json->>'role';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      user_role := NULL;
  END;
  
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  BEGIN
    SELECT raw_user_meta_data->>'role' INTO user_role
    FROM auth.users
    WHERE id = user_id;
    
    IF user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  
  RETURN FALSE;
END;
$$;

-- 3. Recriar função debug
CREATE OR REPLACE FUNCTION public.debug_user_info()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  role_from_db TEXT,
  jwt_claims JSONB,
  is_admin_result BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.uid() as user_id,
    u.email as user_email,
    u.raw_user_meta_data->>'role' as role_from_db,
    current_setting('request.jwt.claims', true)::jsonb as jwt_claims,
    is_admin() as is_admin_result
  FROM auth.users u
  WHERE u.id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_user_info() TO authenticated;

-- 4. Recriar políticas
CREATE POLICY "Admin can read settings" ON settings
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admin can insert settings" ON settings
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin can update settings" ON settings
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin can delete settings" ON settings
  FOR DELETE TO authenticated USING (is_admin());

-- 5. Configurar role admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com'; -- SUBSTITUA PELO SEU EMAIL
```

Depois:
1. Logout
2. Limpar cache
3. Fechar navegador
4. Abrir novamente
5. Login
6. Testar

---

## 📚 Documentos Relacionados

- [CORRECAO_PERMISSION_DENIED.md](./CORRECAO_PERMISSION_DENIED.md) - Correção do erro anterior
- [LEIA_PRIMEIRO.md](./LEIA_PRIMEIRO.md) - Guia rápido geral
- [SOLUCAO_RAPIDA.md](./SOLUCAO_RAPIDA.md) - Soluções por tipo de erro
- [INDICE_DOCUMENTACAO.md](./INDICE_DOCUMENTACAO.md) - Índice completo

---

## 💡 Dicas Importantes

1. **Sempre faça logout/login após mudanças no banco**
   - Mudanças em `user_metadata` não atualizam o JWT automaticamente
   - É preciso fazer logout e login para pegar o novo JWT

2. **Limpe o cache regularmente**
   - Cache antigo pode causar problemas
   - Use Ctrl+Shift+Delete

3. **Use o botão Debug**
   - Ele mostra exatamente o que está acontecendo
   - Economiza tempo de diagnóstico

4. **Verifique os logs no console**
   - Pressione F12
   - Vá para a aba "Console"
   - Todos os passos são logados

---

**Kids Block Store** 🧱  
E-commerce de Bonecos de Montar

Desenvolvido com React, TypeScript, Tailwind CSS, shadcn/ui e Supabase
