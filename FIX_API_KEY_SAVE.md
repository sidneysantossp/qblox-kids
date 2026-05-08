# Correção: Problema ao Salvar Chave API

## ✅ PROBLEMA RESOLVIDO

### Causa Raiz
O usuário não tinha a role "admin" configurada, impedindo o salvamento das configurações devido às políticas RLS (Row Level Security).

### Usuários Configurados
✅ **sidneysantosseo@gmail.com** - Agora é Admin  
✅ **sid.websp@gmail.com** - Agora é Admin

Ambos os usuários foram configurados como administradores e podem acessar todas as funcionalidades administrativas.

---

## Soluções Implementadas

### 1. Usuários Configurados como Admin
```sql
-- Executado com sucesso
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email IN ('sidneysantosseo@gmail.com', 'sid.websp@gmail.com');
```

### 2. Alterado de UPDATE para UPSERT
```typescript
// ANTES (não funcionava se registro não existisse)
await supabase.from('settings').update({ value }).eq('key', 'correios_api_key');

// DEPOIS (cria ou atualiza)
await supabase.from('settings').upsert(
  { key: 'correios_api_key', value, description },
  { onConflict: 'key', ignoreDuplicates: false }
).select();
```

### 3. Adicionados Logs Detalhados
- Log do usuário atual e role ao carregar
- Log dos valores sendo salvos
- Log de sucesso/erro em cada operação
- Console mostra exatamente onde falha

### 4. Informações de Debug na Interface
Adicionado card no topo da página mostrando:
- Email do usuário logado
- Role/função (deve ser "admin")
- Indicador visual se tem permissão

### 5. Políticas RLS Reforçadas
Recriadas todas as políticas com suporte completo:
- SELECT (leitura)
- INSERT (criação)
- UPDATE (atualização)
- DELETE (exclusão)

### 6. Melhor Tratamento de Erros
- Validação de CEP antes de salvar
- Mensagens de erro mais descritivas
- Toast com feedback claro

---

## 🚀 Próximos Passos

### Para Você (Usuário):

1. **Faça Logout e Login Novamente**
   - Clique em "Sair" na aplicação
   - Limpe o cache do navegador (Ctrl+Shift+Delete)
   - Faça login novamente com seu email

2. **Acesse as Configurações**
   - Vá para `/admin/configuracoes`
   - Verifique se o card de debug mostra "Função: admin" ✅

3. **Configure a Chave API**
   - Preencha a chave API dos Correios
   - Preencha o CEP de origem (formato: 12345-678)
   - Clique em "Salvar Configurações"

4. **Verifique o Console**
   - Abra o Console do navegador (F12)
   - Procure por mensagens de sucesso:
     - "Salvando como usuário: seu-email@exemplo.com Role: admin"
     - "API Key salva com sucesso:"
     - "CEP Origem salvo com sucesso:"

---

## 📚 Documentação Criada

1. **[SETUP_ADMIN.md](./SETUP_ADMIN.md)** 
   - Guia completo para configurar usuários como administradores
   - Como tornar novos usuários admin
   - Como verificar e remover permissões

2. **[TROUBLESHOOTING_SETTINGS.md](./TROUBLESHOOTING_SETTINGS.md)** 
   - Guia completo de solução de problemas
   - Queries SQL para diagnóstico
   - Códigos de erro comuns

3. **[README_SETUP.md](./README_SETUP.md)** 
   - Guia de configuração inicial completo
   - Checklist de primeiros passos
   - Visão geral das funcionalidades

4. **Este arquivo (FIX_API_KEY_SAVE.md)** 
   - Resumo das correções implementadas
   - Status da resolução

---

## 🔍 Como Usar Agora

### Passo 1: Logout e Login
```
1. Clique em "Sair"
2. Ctrl+Shift+Delete (limpar cache)
3. Faça login novamente
```

### Passo 2: Verificar Status Admin
```
1. Acesse /admin/configuracoes
2. Veja o card de debug no topo
3. Deve mostrar: "Função: admin" ✅
```

### Passo 3: Configurar Correios
```
1. Preencha "Chave de API dos Correios"
2. Preencha "CEP de Origem" (ex: 12345-678)
3. Clique em "Salvar Configurações"
4. Aguarde mensagem de sucesso
```

### Passo 4: Verificar Logs (Opcional)
```
1. Pressione F12 (abrir Console)
2. Procure por:
   - "Current user: seu-email Role: admin"
   - "API Key salva com sucesso"
   - "CEP Origem salvo com sucesso"
```

---

## ✅ Verificação Final

Execute no SQL Editor do Supabase para confirmar:

```sql
-- Verificar usuários admin
SELECT email, raw_user_meta_data->>'role' as role 
FROM auth.users;

-- Verificar configurações salvas
SELECT key, value, updated_at 
FROM settings 
WHERE key IN ('correios_api_key', 'correios_cep_origem');

-- Verificar políticas RLS
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'settings';
```

**Resultados Esperados:**
- ✅ Ambos os emails devem mostrar role = "admin"
- ✅ Settings devem ter os valores que você salvou
- ✅ Deve haver 4 políticas (SELECT, INSERT, UPDATE, DELETE)

---

## 🎯 Status da Resolução

| Item | Status | Detalhes |
|------|--------|----------|
| Usuários configurados como admin | ✅ Concluído | sidneysantosseo@gmail.com e sid.websp@gmail.com |
| Código alterado para UPSERT | ✅ Concluído | Garante criação ou atualização |
| Logs detalhados adicionados | ✅ Concluído | Console mostra todo o fluxo |
| Interface de debug criada | ✅ Concluído | Card mostra email e role |
| Políticas RLS corrigidas | ✅ Concluído | Suporte completo para CRUD |
| Validação de CEP | ✅ Concluído | Formato verificado antes de salvar |
| Documentação criada | ✅ Concluído | 4 arquivos de guia |
| Lint verificado | ✅ Concluído | Sem erros |

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se você fez logout e login**
   - Isso é ESSENCIAL para atualizar a sessão

2. **Limpe o cache completamente**
   - Ctrl+Shift+Delete
   - Selecione "Todo o período"
   - Marque "Cookies" e "Cache"

3. **Tente em janela anônima**
   - Abra janela anônima/privada
   - Faça login
   - Teste novamente

4. **Verifique o console por erros**
   - F12 → Console
   - Procure por mensagens em vermelho
   - Copie e analise os erros

5. **Consulte a documentação**
   - [SETUP_ADMIN.md](./SETUP_ADMIN.md) - Configuração de admin
   - [TROUBLESHOOTING_SETTINGS.md](./TROUBLESHOOTING_SETTINGS.md) - Solução de problemas

---

## 📞 Informações Técnicas

### Arquivos Modificados

1. **src/pages/admin/AdminSettings.tsx**
   - Alterado UPDATE para UPSERT
   - Adicionados logs detalhados
   - Adicionado card de debug com info do usuário
   - Melhor tratamento de erros

2. **Migrations**
   - Recriadas políticas RLS com suporte completo
   - Garantido que INSERT, UPDATE, SELECT e DELETE funcionam

3. **Banco de Dados**
   - Usuários configurados como admin
   - Políticas RLS verificadas e corrigidas

### Testes Realizados
✅ Lint passou sem erros  
✅ Políticas RLS verificadas  
✅ UPSERT testado  
✅ Logs implementados  
✅ Interface de debug adicionada  
✅ Usuários configurados como admin  

---

**Problema Resolvido! 🎉**

Agora você pode:
- ✅ Acessar o painel administrativo
- ✅ Salvar configurações dos Correios
- ✅ Gerenciar produtos
- ✅ Gerenciar pedidos
- ✅ Acessar todas as funcionalidades admin

**Lembre-se**: Faça logout e login novamente para que as mudanças tenham efeito!
