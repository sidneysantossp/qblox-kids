# Guia de Debugging - Erro ao Adicionar ao Carrinho

## 🔍 Problema Reportado
Usuário recebeu mensagem de erro: "não foi possível adicionar ao carrinho"

## ✅ Verificações Realizadas

### 1. Estrutura do Banco de Dados
- ✅ Tabela `cart_items` existe
- ✅ Colunas corretas: id, session_id, product_id, quantity, created_at, updated_at
- ✅ RLS desabilitado (não há restrições de acesso)
- ✅ Teste de inserção direta funcionou corretamente

### 2. Configuração do Supabase
- ✅ Variáveis de ambiente configuradas (.env)
- ✅ VITE_SUPABASE_URL presente
- ✅ VITE_SUPABASE_ANON_KEY presente
- ✅ Cliente Supabase inicializado corretamente

### 3. Código da Aplicação
- ✅ CartContext implementado corretamente
- ✅ Função addToCart no api.ts funcional
- ✅ ProductCard usando useCart corretamente
- ✅ Session ID sendo gerado e armazenado no localStorage

## 🛠️ Melhorias Implementadas

### Logging Detalhado
Adicionado logs em múltiplos pontos para rastrear o fluxo:

#### No CartContext (`src/contexts/CartContext.tsx`):
```typescript
console.log('Tentando adicionar ao carrinho:', { sessionId, productId, quantity });
console.log('Resultado da adição:', result);
```

#### No API (`src/db/api.ts`):
```typescript
console.log('addToCart chamado:', { sessionId, productId, quantity });
console.log('Item existente:', existingItem);
console.log('Item atualizado:', data); // ou 'Novo item adicionado:', data
```

### Mensagens de Erro Melhoradas
- Mensagens de erro agora incluem detalhes específicos
- Toast mostra o erro exato que ocorreu
- Console.error registra o erro completo

## 🔧 Como Debugar

### Passo 1: Abrir Console do Navegador
1. Pressione F12 (ou Cmd+Option+I no Mac)
2. Vá para a aba "Console"

### Passo 2: Tentar Adicionar Produto
1. Navegue até a página inicial ou uma categoria
2. Clique no botão "Adicionar" em qualquer produto
3. Observe os logs no console

### Passo 3: Analisar os Logs

#### Logs Esperados (Sucesso):
```
Tentando adicionar ao carrinho: { sessionId: "session_...", productId: "uuid...", quantity: 1 }
addToCart chamado: { sessionId: "session_...", productId: "uuid...", quantity: 1 }
Item existente: null (ou objeto se já existir)
Novo item adicionado: { id: "uuid...", session_id: "...", product_id: "...", quantity: 1 }
Resultado da adição: { id: "uuid...", ... }
```

#### Logs de Erro (Problema):
```
Tentando adicionar ao carrinho: { ... }
addToCart chamado: { ... }
Erro ao verificar item existente: { message: "...", code: "..." }
// ou
Erro ao inserir novo item: { message: "...", code: "..." }
// ou
Erro geral em addToCart: { ... }
```

### Passo 4: Identificar o Problema

#### Erro de Conexão
Se aparecer erro de rede ou timeout:
- Verificar conexão com internet
- Verificar se o Supabase está acessível
- Verificar variáveis de ambiente

#### Erro de Permissão
Se aparecer erro "permission denied" ou "RLS":
- Verificar se RLS está desabilitado na tabela cart_items
- Verificar se o anon key está correto

#### Erro de Validação
Se aparecer erro de validação de dados:
- Verificar se product_id é um UUID válido
- Verificar se quantity é um número positivo
- Verificar se session_id não está vazio

## 🧪 Testes Manuais

### Teste 1: Verificar Session ID
Abra o console e digite:
```javascript
localStorage.getItem('cart_session_id')
```
Deve retornar algo como: `"session_1735428000000_abc123def"`

### Teste 2: Verificar Produtos
Abra o console e digite:
```javascript
fetch('https://zkccczvfbqrjllbpndgl.supabase.co/rest/v1/products?select=*&limit=1', {
  headers: {
    'apikey': 'SEU_ANON_KEY_AQUI',
    'Authorization': 'Bearer SEU_ANON_KEY_AQUI'
  }
}).then(r => r.json()).then(console.log)
```
Deve retornar um array com produtos.

### Teste 3: Inserção Manual
Abra o console e digite:
```javascript
const sessionId = localStorage.getItem('cart_session_id');
fetch('https://zkccczvfbqrjllbpndgl.supabase.co/rest/v1/cart_items', {
  method: 'POST',
  headers: {
    'apikey': 'SEU_ANON_KEY_AQUI',
    'Authorization': 'Bearer SEU_ANON_KEY_AQUI',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    session_id: sessionId,
    product_id: 'UUID_DE_UM_PRODUTO',
    quantity: 1
  })
}).then(r => r.json()).then(console.log)
```
Deve retornar o item criado.

## 📋 Checklist de Troubleshooting

- [ ] Console do navegador aberto
- [ ] Logs aparecem ao clicar em "Adicionar"
- [ ] Session ID existe no localStorage
- [ ] Produtos carregam na página inicial
- [ ] Erro específico identificado no console
- [ ] Variáveis de ambiente verificadas
- [ ] Conexão com Supabase funcionando
- [ ] Tabela cart_items acessível

## 🆘 Próximos Passos

Se o erro persistir após seguir este guia:

1. **Copie os logs do console** (todos os logs que aparecem ao tentar adicionar)
2. **Tire um screenshot** da mensagem de erro
3. **Verifique a aba Network** no DevTools:
   - Procure por requisições para `cart_items`
   - Veja o status code (200, 400, 500, etc.)
   - Veja a resposta do servidor
4. **Compartilhe essas informações** para análise mais detalhada

## 📝 Informações Técnicas

### Arquivos Modificados
- `src/contexts/CartContext.tsx` - Adicionado logging e melhor tratamento de erros
- `src/db/api.ts` - Adicionado logging detalhado na função addToCart

### Dependências
- @supabase/supabase-js
- React Context API
- localStorage para session management

### Fluxo de Adição ao Carrinho
1. Usuário clica em "Adicionar" no ProductCard
2. handleAddToCart é chamado
3. CartContext.addToCart é executado
4. api.addToCart faz a requisição ao Supabase
5. Verifica se item já existe no carrinho
6. Atualiza quantidade ou insere novo item
7. Retorna resultado
8. CartContext atualiza estado
9. Toast de sucesso é exibido
10. Carrinho é atualizado

### Possíveis Causas de Erro
1. **Rede**: Conexão instável ou timeout
2. **Autenticação**: Anon key inválida ou expirada
3. **Validação**: Dados inválidos (UUID malformado, etc.)
4. **Banco de Dados**: Tabela não existe ou estrutura incorreta
5. **RLS**: Políticas de segurança bloqueando acesso
6. **CORS**: Problemas de cross-origin (improvável com Supabase)
