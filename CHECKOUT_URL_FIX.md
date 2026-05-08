# Fix: URL de Checkout Não Recebida

## Problema

Ao tentar finalizar compra com Stripe, o sistema mostrava o erro:
```
Erro ao processar pagamento
URL de checkout não recebida
```

## Causa Raiz

O código estava verificando a estrutura de resposta incorreta. A função `createStripeCheckout` retorna diretamente o objeto `data`, mas o CartPage estava tentando acessar `response.data.url` em vez de `response.url`.

### Fluxo de Dados

1. **Edge Function** retorna:
```json
{
  "code": "SUCCESS",
  "message": "Sucesso",
  "data": {
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_...",
    "orderId": "uuid..."
  }
}
```

2. **API Function** (`src/db/api.ts`) processa:
```typescript
const result = await response.json();
return result.data || result;  // Retorna apenas o objeto 'data'
```

3. **CartPage** recebia:
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_...",
  "orderId": "uuid..."
}
```

Mas estava tentando acessar `response.data.url` (incorreto) em vez de `response.url` (correto).

## Código Anterior (Com Erro)

```typescript
// Verificar resposta
if (response?.data?.url) {
  // Abrir página de pagamento do Stripe em nova aba
  window.open(response.data.url, '_blank');
  
  toast({
    title: "Redirecionando para pagamento",
    description: "Você será redirecionado para a página de pagamento seguro do Stripe.",
  });
} else {
  throw new Error('URL de checkout não recebida');
}
```

**Problema**: `response.data.url` é `undefined` porque `response` já é o objeto `data`.

## Código Corrigido

```typescript
// Verificar resposta
console.log('Resposta do checkout:', response);

if (response?.url) {
  // Abrir página de pagamento do Stripe em nova aba
  window.open(response.url, '_blank');
  
  toast({
    title: "Redirecionando para pagamento",
    description: "Você será redirecionado para a página de pagamento seguro do Stripe.",
  });
} else {
  console.error('Resposta inválida:', response);
  throw new Error('URL de checkout não recebida');
}
```

**Correções**:
1. ✅ Mudou `response?.data?.url` para `response?.url`
2. ✅ Mudou `response.data.url` para `response.url`
3. ✅ Adicionou logging para debugging
4. ✅ Adicionou log de erro quando resposta é inválida

## Estrutura de Resposta Correta

### Edge Function Response
```typescript
{
  code: "SUCCESS",
  message: "Sucesso",
  data: {
    url: string,           // URL do checkout Stripe
    sessionId: string,     // ID da sessão Stripe
    orderId: string        // ID do pedido no banco
  }
}
```

### API Function Return
```typescript
{
  url: string,           // URL do checkout Stripe
  sessionId: string,     // ID da sessão Stripe
  orderId: string        // ID do pedido no banco
}
```

### CartPage Usage
```typescript
const response = await createStripeCheckout({...});
// response.url ✅ (correto)
// response.data.url ❌ (incorreto)
```

## Arquivo Modificado

- `/src/pages/CartPage.tsx` - Linha 52-65

## Melhorias Adicionais

1. **Logging**: Adicionado `console.log` para ver resposta completa
2. **Error Logging**: Adicionado `console.error` quando resposta é inválida
3. **Debugging**: Facilita identificar problemas futuros

## Como Testar

1. Adicionar produtos ao carrinho
2. Ir para página de checkout (`/checkout` ou `/carrinho`)
3. Clicar em "Finalizar Compra (Stripe)"
4. ✅ Deve abrir nova aba com página de pagamento Stripe
5. ✅ Deve mostrar toast "Redirecionando para pagamento"

## Verificação no Console

Após clicar em "Finalizar Compra (Stripe)", o console deve mostrar:

```javascript
Resposta do checkout: {
  url: "https://checkout.stripe.com/c/pay/cs_test_...",
  sessionId: "cs_test_...",
  orderId: "uuid..."
}
```

Se houver erro, o console mostrará:
```javascript
Resposta inválida: { ... }
Erro ao criar checkout: Error: URL de checkout não recebida
```

## Erros Comuns e Soluções

### ❌ Erro: "URL de checkout não recebida"
**Causas possíveis:**
1. Resposta da API está em formato diferente
2. Edge function retornou erro
3. Variáveis de ambiente não configuradas

**Como debugar:**
1. Verificar console: `Resposta do checkout: ...`
2. Verificar se `response.url` existe
3. Verificar logs da edge function
4. Verificar variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### ❌ Erro: "Missing authorization header"
**Solução:** Verificar se headers estão corretos em `src/db/api.ts`

### ❌ Erro: "Constraint violation"
**Solução:** Verificar se edge function usa `payment_method: 'card'`

## Fluxo Completo de Checkout

1. **Usuário clica** em "Finalizar Compra (Stripe)"
2. **CartPage** chama `createStripeCheckout()`
3. **API Function** faz fetch para edge function
4. **Edge Function** cria pedido no banco
5. **Edge Function** cria sessão Stripe
6. **Edge Function** retorna `{ code, message, data: { url, sessionId, orderId } }`
7. **API Function** extrai e retorna `data`
8. **CartPage** recebe `{ url, sessionId, orderId }`
9. **CartPage** abre `url` em nova aba
10. **Usuário** completa pagamento no Stripe
11. **Stripe** redireciona para success/cancel URL
12. **Webhook** atualiza status do pedido

## Benefícios da Correção

✅ **Checkout Funcional**: Usuários podem finalizar compras  
✅ **Melhor Debugging**: Logs ajudam a identificar problemas  
✅ **UX Melhorada**: Redirecionamento funciona corretamente  
✅ **Código Limpo**: Acesso correto à estrutura de dados  

## Relacionado

Esta correção complementa as seguintes correções anteriores:
- `MISSING_AUTH_HEADER_FIX.md` - Headers corretos na requisição
- `PAYMENT_METHOD_CONSTRAINT_FIX.md` - Constraint do banco de dados
- `STRIPE_JWT_FIX.md` - Autenticação com Supabase

---

**Data da Correção**: 2025-01-03  
**Status**: ✅ Corrigido  
**Tipo**: Bug Fix - Response Structure  
**Impacto**: Alto (bloqueava todos os checkouts)
