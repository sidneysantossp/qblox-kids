# 🚨 ERRO AO SALVAR? SIGA ESTE GUIA! 🚨

## 🎉 ATUALIZAÇÃO: Erro "permission denied for table users" CORRIGIDO!

**O que foi corrigido:**
- ✅ Políticas RLS atualizadas para não acessar `auth.users` diretamente
- ✅ Criada função `is_admin()` segura com SECURITY DEFINER
- ✅ Teste de conexão melhorado
- ✅ Logs mais detalhados

**Agora você pode:**
1. Recarregar a página
2. Clicar em "Testar Conexão"
3. Salvar as configurações normalmente

---

## 🎯 Solução Rápida em 30 Segundos

```
1. Pressione F12 (abre o Console)
2. Clique em "Testar Conexão"
3. Leia a mensagem que aparece
4. Vá para a seção correspondente abaixo
```

---

## ✅ Mensagem: "Conexão testada com sucesso"

**Você está pronto!**

```
1. Preencha a Chave API dos Correios
2. Preencha o CEP de Origem
3. Clique em "Salvar Configurações"
4. Pronto! ✅
```

---

## ❌ Mensagem: "Usuário não autenticado"

**Sua sessão expirou**

```
1. Clique em "Sair"
2. Faça login novamente
3. Volte para /admin/configuracoes
4. Tente novamente
```

---

## ❌ Mensagem: "Você precisa ser administrador"

**Você não é admin**

```
1. Abra o Supabase Dashboard
2. Vá para SQL Editor
3. Cole e execute:

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';

4. Faça logout
5. Limpe o cache (Ctrl+Shift+Delete)
6. Faça login novamente
7. Tente novamente
```

---

## ❌ Mensagem: "new row violates row-level security policy"
## ❌ Mensagem: "permission denied for table users"

**✅ AMBOS OS PROBLEMAS JÁ FORAM CORRIGIDOS!**

### Problema 1: "permission denied for table users" ✅ RESOLVIDO
As políticas RLS foram atualizadas para usar uma função `is_admin()` segura.

### Problema 2: "new row violates row-level security policy" ⚠️ REQUER AÇÃO

**Causa:** Seu JWT (token de autenticação) está desatualizado e não contém a role 'admin'

**✅ SOLUÇÃO RÁPIDA (3 minutos):**

```
1. Faça LOGOUT
2. Pressione Ctrl+Shift+Delete
3. Marque "Cookies" e "Cache"
4. Clique em "Limpar dados"
5. Feche o navegador COMPLETAMENTE
6. Abra o navegador novamente
7. Faça LOGIN
8. Tente salvar novamente
```

**Por que isso funciona?**
- Quando você faz login, um novo JWT é gerado
- O novo JWT contém suas permissões de admin atualizadas
- Sem fazer logout/login, o JWT antigo não tem essas permissões

**📖 Guia Completo:** Veja [SOLUCAO_RLS_POLICY.md](./SOLUCAO_RLS_POLICY.md)

**🐛 Ferramenta de Debug:**
- Acesse /admin/configuracoes
- Clique no botão "Debug" (ao lado de "Testar Conexão")
- Abra o console (F12)
- Verifique se `is_admin()` retorna `true`

**Se ainda não funcionar:**

```sql
-- Execute no SQL Editor do Supabase
-- Substitua 'seu-email@exemplo.com' pelo seu email

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'seu-email@exemplo.com';
```

Depois: Logout + Limpar cache + Login novamente

---

## ❌ Mensagem: "CEP Inválido"

**CEP está no formato errado**

```
✅ Formato correto: 12345-678
✅ Ou apenas: 12345678
❌ Formato errado: 1234-567 (faltam dígitos)
❌ Formato errado: 123456789 (dígitos demais)

O CEP deve ter exatamente 8 dígitos.
```

---

## ❌ Mensagem: "Failed to fetch" ou "Network error"

**Problema de conexão**

```
1. Verifique sua internet
2. Verifique se o Supabase está online
3. Verifique o arquivo .env:
   VITE_SUPABASE_URL=sua-url
   VITE_SUPABASE_ANON_KEY=sua-chave
4. Reinicie o servidor (Ctrl+C e npm run dev)
```

---

## 🔍 Ainda Não Funciona?

### Passo 1: Capture Informações

```
1. Pressione F12
2. Clique em "Testar Conexão"
3. Copie TODAS as mensagens do console
4. Clique em "Salvar Configurações"
5. Copie TODAS as mensagens de erro
```

### Passo 2: Verifique seu Usuário

```sql
-- Execute no SQL Editor do Supabase
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'seu-email@exemplo.com';
```

**Resultado esperado:**
```
email                    | role  
-------------------------|-------
seu-email@exemplo.com    | admin
```

**Se não mostrar "admin":**
- Execute o SQL da seção "Você precisa ser administrador" acima

### Passo 3: Verifique as Políticas

```sql
-- Execute no SQL Editor do Supabase
SELECT policyname, cmd
FROM pg_policies 
WHERE tablename = 'settings';
```

**Resultado esperado (4 políticas):**
```
policyname                      | cmd
--------------------------------|--------
Admin can read settings         | SELECT
Admin can insert settings       | INSERT
Admin can update settings       | UPDATE
Admin can delete settings       | DELETE
```

**Se faltar alguma política:**
- Execute o SQL da seção "new row violates row-level security policy" acima

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **[ERRO_SALVAR_CONFIGURACOES.md](./ERRO_SALVAR_CONFIGURACOES.md)** - Guia completo
- **[SETUP_ADMIN.md](./SETUP_ADMIN.md)** - Como configurar admin
- **[COMECE_AQUI.md](./COMECE_AQUI.md)** - Guia de início rápido

---

## 🎯 Checklist de Verificação

Antes de pedir ajuda, verifique:

- [ ] Fiz logout e login novamente
- [ ] Limpei o cache do navegador (Ctrl+Shift+Delete)
- [ ] O card mostra "Função: admin" em verde
- [ ] Cliquei em "Testar Conexão"
- [ ] Li a mensagem de erro no console (F12)
- [ ] Procurei o erro neste guia
- [ ] Executei o SQL correspondente
- [ ] Tentei novamente após cada correção

---

## 💡 Dica Pro

**Sempre que fizer mudanças no banco de dados:**
1. Faça logout
2. Limpe o cache (Ctrl+Shift+Delete)
3. Feche o navegador completamente
4. Abra novamente
5. Faça login
6. Tente novamente

Isso garante que sua sessão está atualizada com as novas permissões.

---

## 🆘 Última Opção

Se NADA funcionar:

1. Capture os logs completos (F12 → Console → copie tudo)
2. Execute todas as queries SQL de verificação
3. Copie os resultados
4. Consulte ERRO_SALVAR_CONFIGURACOES.md seção "Se Nada Funcionar"
5. Siga as instruções para capturar informações para suporte

---

**Lembre-se: O botão "Testar Conexão" é seu melhor amigo! 🧪**

Use-o sempre que tiver dúvidas sobre suas permissões.

---

**Kids Block Store** 🧱  
E-commerce de Bonecos de Montar
