# Fix: Missing Authorization Header - Stripe Checkout

## Problema

Ao tentar finalizar compra com Stripe, o sistema retornava:
```
Erro ao processar pagamento
Missing authorization header
```

## Causa

A chamada HTTP para a Edge Function do Supabase estava enviando apenas o header `apikey`, mas o Supabase requer AMBOS os headers:
- `Authorization: Bearer ${anonKey}`
- `apikey: ${anonKey}`

## Código Anterior (Com Erro)

```typescript
const response = await fetch(functionUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    // ❌ Faltando Authorization header
  },
  body: JSON.stringify(checkoutData),
});
```

## Código Corrigido

```typescript
const response = await fetch(functionUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,  // ✅ Adicionado
    'apikey': supabaseAnonKey,
  },
  body: JSON.stringify(checkoutData),
});
```

## Melhorias Adicionais

1. **Validação de Configuração**: Verifica se as variáveis de ambiente estão definidas
2. **Logging Melhorado**: Adiciona console.error para facilitar debugging
3. **Mensagens Claras**: Erros mais descritivos para o usuário

## Arquivo Modificado

- `/src/db/api.ts` - Função `createStripeCheckout`

## Como Testar

1. Adicionar produtos ao carrinho
2. Clicar em "Finalizar Compra (Stripe)"
3. ✅ Deve redirecionar para página de pagamento Stripe sem erros

## Requisitos

Certifique-se de que as seguintes variáveis de ambiente estão definidas:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

**Data**: 2025-01-03  
**Status**: ✅ Corrigido  
**Tipo**: Bug Fix - Headers HTTP
