# 🔧 Guia de Solução: Erro ao Salvar Configurações dos Correios

## ✅ Melhorias Implementadas

Acabei de implementar várias melhorias na página de configurações para ajudar a diagnosticar e resolver o problema:

### 1. **Logs Detalhados**
- Agora o console mostra cada etapa do processo de salvamento
- Mensagens de erro incluem detalhes completos (message, hint, code)
- Logs com emojis para fácil identificação (✅ sucesso, ❌ erro)

### 2. **Botão "Testar Conexão"**
- Novo botão para testar se você tem permissão de salvar
- Testa leitura e escrita no banco de dados
- Mostra resultado imediatamente

### 3. **Card de Debug Melhorado**
- Mostra seu email e função (role)
- Cor verde se você é admin, amarelo se não é
- Botão de teste de conexão integrado

### 4. **Validações Aprimoradas**
- Verifica se você está autenticado antes de salvar
- Verifica se você é admin antes de tentar salvar
- Valida formato do CEP
- Retorna erros específicos para cada problema

### 5. **Botão "Ver Debug"**
- Imprime informações no console
- Ajuda a verificar o estado atual

---

## 🚀 Como Usar Agora

### Passo 1: Recarregue a Página
```
1. Pressione Ctrl+R ou F5
2. Acesse /admin/configuracoes novamente
```

### Passo 2: Verifique o Card de Debug
```
Você deve ver:
- Usuário: seu-email@exemplo.com
- Função: admin (em verde)
- ✓ Você tem permissão de administrador
```

**Se não mostrar "admin":**
1. Faça logout
2. Limpe o cache (Ctrl+Shift+Delete)
3. Faça login novamente

### Passo 3: Teste a Conexão
```
1. Clique no botão "Testar Conexão"
2. Aguarde o resultado
3. Se aparecer "✓ Conexão testada com sucesso!" → Vá para o Passo 4
4. Se aparecer erro → Veja a seção "Diagnóstico de Erros" abaixo
```

### Passo 4: Salve as Configurações
```
1. Preencha a "Chave de API dos Correios"
2. Preencha o "CEP de Origem" (formato: 12345-678)
3. Clique em "Salvar Configurações"
4. Aguarde a mensagem de sucesso
```

### Passo 5: Verifique os Logs (Importante!)
```
1. Pressione F12 para abrir o Console
2. Procure por:
   === SALVANDO CONFIGURAÇÕES ===
   ✅ API Key salva com sucesso
   ✅ CEP Origem salvo com sucesso
   === CONFIGURAÇÕES SALVAS COM SUCESSO ===
```

---

## 🔍 Diagnóstico de Erros

### Erro: "Usuário não autenticado"

**Causa:** Sua sessão expirou

**Solução:**
1. Faça logout
2. Faça login novamente
3. Tente salvar novamente

---

### Erro: "Você precisa ser administrador"

**Causa:** Seu usuário não tem role "admin"

**Solução:**
1. Acesse o SQL Editor do Supabase
2. Execute:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```
3. Faça logout e login novamente
4. Limpe o cache do navegador

---

### Erro: "new row violates row-level security policy"

**Causa:** As políticas RLS não estão reconhecendo você como admin

**Diagnóstico:**
```sql
-- Verifique seu usuário
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'seu-email@exemplo.com';
```

**Deve retornar:**
```
email                    | role  | raw_user_meta_data
-------------------------|-------|--------------------
seu-email@exemplo.com    | admin | {"role": "admin", ...}
```

**Se o role não for "admin":**
- Execute o SQL da seção anterior para tornar-se admin
- Faça logout e login novamente

**Se o role for "admin" mas ainda dá erro:**
```sql
-- Verifique as políticas RLS
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'settings';
```

**Deve retornar 4 políticas:**
- Admin can read settings (SELECT)
- Admin can insert settings (INSERT)
- Admin can update settings (UPDATE)
- Admin can delete settings (DELETE)

**Se faltar alguma política, execute:**
```sql
-- Recriar políticas
DROP POLICY IF EXISTS "Admin can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON settings;
DROP POLICY IF EXISTS "Admin can update settings" ON settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON settings;

CREATE POLICY "Admin can read settings" ON settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can insert settings" ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can update settings" ON settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can delete settings" ON settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

---

### Erro: "CEP Inválido"

**Causa:** CEP não tem 8 dígitos

**Solução:**
- Use o formato: 12345-678
- Ou apenas: 12345678
- O sistema aceita ambos e formata automaticamente

---

### Erro: "Failed to fetch" ou "Network error"

**Causa:** Problema de conexão com o Supabase

**Solução:**
1. Verifique sua conexão com a internet
2. Verifique se o Supabase está online
3. Verifique as variáveis de ambiente (.env):
   ```
   VITE_SUPABASE_URL=sua-url
   VITE_SUPABASE_ANON_KEY=sua-chave
   ```
4. Reinicie o servidor de desenvolvimento

---

## 📊 Verificação Manual no Banco de Dados

### Verificar se as configurações foram salvas:

```sql
SELECT 
  key, 
  value, 
  description,
  updated_at 
FROM settings 
WHERE key IN ('correios_api_key', 'correios_cep_origem')
ORDER BY key;
```

**Resultado esperado:**
```
key                    | value           | description                          | updated_at
-----------------------|-----------------|--------------------------------------|------------------
correios_api_key       | sua-chave-aqui  | Chave de API dos Correios...        | 2026-01-30 ...
correios_cep_origem    | 12345-678       | CEP de origem para cálculo...       | 2026-01-30 ...
```

### Testar salvamento manual:

```sql
-- Teste de INSERT
INSERT INTO settings (key, value, description)
VALUES ('test_manual', 'test_value', 'Teste manual')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verificar
SELECT * FROM settings WHERE key = 'test_manual';

-- Limpar
DELETE FROM settings WHERE key = 'test_manual';
```

**Se o INSERT manual funcionar mas o frontend não:**
- O problema está na autenticação/sessão do frontend
- Faça logout e login novamente
- Limpe o cache do navegador completamente

---

## 🎯 Checklist de Diagnóstico

Marque conforme for testando:

- [ ] Recarreguei a página de configurações
- [ ] O card mostra "Função: admin" em verde
- [ ] Cliquei em "Testar Conexão"
- [ ] O teste retornou "✓ Conexão testada com sucesso!"
- [ ] Preenchi a chave API dos Correios
- [ ] Preenchi o CEP de origem (formato correto)
- [ ] Cliquei em "Salvar Configurações"
- [ ] Abri o Console (F12)
- [ ] Vi os logs de sucesso no console
- [ ] Recebi a mensagem "Configurações salvas com sucesso"
- [ ] Verifiquei no SQL que os dados foram salvos

---

## 🆘 Se Nada Funcionar

### 1. Capture os Logs Completos

```
1. Pressione F12
2. Vá para a aba "Console"
3. Clique em "Testar Conexão"
4. Copie TODAS as mensagens que aparecerem
5. Clique em "Salvar Configurações"
6. Copie TODAS as mensagens de erro
```

### 2. Verifique o Estado do Usuário

```sql
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at,
  last_sign_in_at,
  updated_at
FROM auth.users 
WHERE email = 'seu-email@exemplo.com';
```

Copie o resultado completo.

### 3. Verifique as Políticas

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'settings';
```

Copie o resultado completo.

### 4. Teste Direto no SQL

```sql
-- Como seu usuário (substitua o ID)
SET LOCAL "request.jwt.claims" = '{"sub": "seu-user-id-aqui", "role": "authenticated"}';

-- Tente inserir
INSERT INTO settings (key, value, description)
VALUES ('test_rls', 'test', 'Teste RLS')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

Se der erro, copie a mensagem completa.

---

## 📝 Informações para Suporte

Se precisar de ajuda, forneça:

1. **Logs do Console** (F12 → Console → copie tudo)
2. **Resultado do SQL de verificação do usuário**
3. **Resultado do SQL de verificação das políticas**
4. **Mensagem de erro exata** que aparece no toast
5. **Screenshot** do card de debug mostrando seu email e role

---

## ✅ Resumo das Melhorias

| Melhoria | Benefício |
|----------|-----------|
| Logs detalhados | Identifica exatamente onde falha |
| Botão "Testar Conexão" | Verifica permissões antes de salvar |
| Card de debug melhorado | Mostra status visual claro |
| Validações aprimoradas | Previne erros comuns |
| Mensagens de erro específicas | Facilita diagnóstico |
| Botão "Ver Debug" | Acesso rápido às informações |

---

**Agora tente novamente e me avise o que aparece no console!** 🚀

Pressione F12, clique em "Testar Conexão" e depois em "Salvar Configurações". 
Copie as mensagens que aparecerem no console.
