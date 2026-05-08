# Guia de Solução de Problemas - Configurações de Frete

## Problema: Chave API não está salvando

### Diagnóstico

A página de configurações agora exibe informações de debug no topo:
- **Usuário**: Seu email de login
- **Função**: Seu nível de acesso (deve ser "admin")

### Soluções

#### 1. Verificar Permissão de Administrador

**Sintoma**: A função exibida não é "admin" ou o card de debug mostra "Você precisa ser administrador"

**Solução**: Consulte o guia completo em **SETUP_ADMIN.md** para configurar seu usuário como administrador.

**Solução Rápida**:
```sql
-- Execute no SQL Editor do Supabase
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

Substitua `seu-email@exemplo.com` pelo seu email de login.

**IMPORTANTE**: Após executar o SQL, faça logout, limpe o cache do navegador e faça login novamente.

#### 2. Verificar Console do Navegador

Abra o Console do Navegador (F12) e procure por mensagens de log:
- `Current user:` - Mostra seu usuário e role
- `Salvando como usuário:` - Confirma tentativa de salvamento
- `API Key salva com sucesso:` - Confirma sucesso
- Mensagens de erro em vermelho - Indicam o problema

#### 3. Verificar Políticas RLS

Execute no SQL Editor do Supabase:

```sql
-- Verificar se as políticas existem
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'settings';
```

Deve retornar 4 políticas:
- Admin can read settings
- Admin can insert settings
- Admin can update settings
- Admin can delete settings

#### 4. Testar Manualmente no SQL Editor

```sql
-- Testar se você consegue atualizar diretamente
UPDATE settings 
SET value = 'teste123' 
WHERE key = 'correios_api_key';

-- Verificar se salvou
SELECT * FROM settings WHERE key = 'correios_api_key';
```

Se funcionar no SQL Editor mas não na interface, o problema é de autenticação/permissão.

#### 5. Recriar Políticas RLS

Se as políticas estiverem incorretas, execute:

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Admin can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can update settings" ON settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON settings;

-- Recriar políticas
CREATE POLICY "Admin can read settings"
  ON settings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can insert settings"
  ON settings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can update settings"
  ON settings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can delete settings"
  ON settings FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

#### 6. Verificar Sessão

Às vezes a sessão pode estar desatualizada:

1. Faça logout da aplicação
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Faça login novamente
4. Tente salvar as configurações

#### 7. Verificar Dados Salvos

Para confirmar se os dados foram salvos:

```sql
SELECT key, value, description, updated_at 
FROM settings 
WHERE key IN ('correios_api_key', 'correios_cep_origem');
```

### Logs Detalhados

A página agora registra logs detalhados no console:

**Ao carregar a página**:
```
Current user: seu-email@exemplo.com Role: admin
Settings carregadas: [{key: "correios_api_key", value: "..."}, ...]
```

**Ao salvar**:
```
Salvando como usuário: seu-email@exemplo.com Role: admin
Salvando API Key: ***
Salvando CEP Origem: 12345-678
API Key salva com sucesso: [...]
CEP Origem salvo com sucesso: [...]
```

**Em caso de erro**:
```
Erro ao salvar API key: {message: "...", code: "..."}
```

### Códigos de Erro Comuns

- **42501**: Permissão negada - Você não é admin ou as políticas RLS estão incorretas
- **23505**: Violação de constraint único - Improvável com upsert
- **PGRST116**: JWT expirado - Faça logout e login novamente

### Contato para Suporte

Se nenhuma solução funcionar:

1. Copie todas as mensagens do console
2. Execute: `SELECT * FROM auth.users WHERE email = 'seu-email';`
3. Execute: `SELECT * FROM pg_policies WHERE tablename = 'settings';`
4. Envie os resultados para análise

## Melhorias Implementadas

1. **Upsert em vez de Update**: Garante que os dados sejam criados se não existirem
2. **Logs detalhados**: Facilita identificar onde o problema ocorre
3. **Informações de debug**: Mostra role do usuário na interface
4. **Políticas RLS corrigidas**: Suporte completo para INSERT, UPDATE, SELECT e DELETE
5. **Validação melhorada**: CEP validado antes de salvar
6. **Feedback visual**: Toast de sucesso/erro mais claro
