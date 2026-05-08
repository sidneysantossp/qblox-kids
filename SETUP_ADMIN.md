# Configuração Inicial - Criar Administrador

## Problema
Após criar sua conta, você não consegue acessar as funcionalidades administrativas porque seu usuário não tem a role "admin".

## Solução Rápida

### Passo 1: Acessar o SQL Editor do Supabase
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Tornar seu usuário Administrador

Cole e execute o seguinte SQL (substitua o email pelo seu):

```sql
-- Tornar usuário administrador
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

**Exemplo:**
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'sidneysantosseo@gmail.com';
```

### Passo 3: Verificar se funcionou

Execute este SQL para confirmar:

```sql
SELECT email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'seu-email@exemplo.com';
```

Deve retornar:
```
email                      | role
---------------------------|-------
seu-email@exemplo.com      | admin
```

### Passo 4: Fazer Logout e Login Novamente

1. Faça logout da aplicação
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Faça login novamente
4. Acesse `/admin/configuracoes`
5. Verifique se o card de debug mostra "Função: admin"

## Tornar Todos os Usuários Administradores

Se você quiser tornar TODOS os usuários existentes administradores:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
);
```

## Verificar Todos os Usuários

Para ver todos os usuários e suas roles:

```sql
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;
```

## Remover Permissão de Admin

Se precisar remover a permissão de admin de alguém:

```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'
)
WHERE email = 'usuario@exemplo.com';
```

## Criar Novo Usuário Admin via SQL

Se você quiser criar um novo usuário diretamente como admin (não recomendado, use o signup normal):

```sql
-- Primeiro, o usuário deve se registrar normalmente pela interface
-- Depois, execute:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'novo-admin@exemplo.com';
```

## Troubleshooting

### Ainda não funciona após executar o SQL?

1. **Limpe o cache completamente**
   - Chrome: Ctrl+Shift+Delete → Selecione "Todo o período" → Marque "Cookies" e "Cache"
   - Firefox: Ctrl+Shift+Delete → Selecione "Tudo" → Marque "Cookies" e "Cache"

2. **Verifique se o SQL foi executado**
   ```sql
   SELECT email, raw_user_meta_data 
   FROM auth.users 
   WHERE email = 'seu-email@exemplo.com';
   ```
   
   O campo `raw_user_meta_data` deve conter: `{"role": "admin"}`

3. **Tente em uma janela anônima**
   - Abra uma janela anônima/privada
   - Faça login
   - Teste as funcionalidades admin

4. **Verifique o console do navegador**
   - Abra o Console (F12)
   - Procure por "Current user:" e "Role:"
   - Deve mostrar "Role: admin"

### O card de debug não aparece?

Se o card de debug não aparecer na página de configurações:
1. Verifique se você está logado
2. Recarregue a página (Ctrl+R)
3. Verifique o console por erros

### Erro "permission denied"?

Se você receber erro de permissão mesmo sendo admin:
1. Verifique as políticas RLS:
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'settings';
   ```

2. Se não houver 4 políticas (SELECT, INSERT, UPDATE, DELETE), execute a migration de correção (veja TROUBLESHOOTING_SETTINGS.md)

## Usuários Configurados

✅ **sidneysantosseo@gmail.com** - Admin  
✅ **sid.websp@gmail.com** - Admin

Ambos os usuários já foram configurados como administradores e podem acessar todas as funcionalidades administrativas.

## Próximos Passos

Após configurar seu usuário como admin:

1. ✅ Faça logout e login novamente
2. ✅ Acesse `/admin/configuracoes`
3. ✅ Verifique se aparece "Função: admin" no card de debug
4. ✅ Configure a chave API dos Correios
5. ✅ Configure o CEP de origem
6. ✅ Salve as configurações
7. ✅ Verifique o console (F12) para confirmar sucesso

## Segurança

⚠️ **IMPORTANTE**: 
- Não compartilhe acesso admin com usuários não confiáveis
- Administradores têm acesso total ao sistema
- Podem gerenciar produtos, pedidos, e configurações
- Podem ver informações de todos os clientes

Para um sistema em produção, considere:
- Criar roles diferentes (admin, moderador, vendedor)
- Implementar logs de auditoria
- Adicionar autenticação de dois fatores
- Limitar tentativas de login
