# Fix: Payment Method Constraint Violation

## Problema

Ao tentar criar um pedido com Stripe, o sistema retornava o erro:
```
Erro ao processar pagamento
Erro ao criar pedido: new row for relation "orders" violates check constraint "orders_payment_method_check"
```

## Causa Raiz

A Edge Function `create_stripe_checkout` estava tentando inserir `payment_method: "stripe"` na tabela `orders`, mas o banco de dados tem uma constraint que só permite os seguintes valores:
- `'card'`
- `'cash'`
- `'pix'`
- `'boleto'`

### Constraint do Banco de Dados

```sql
CHECK ((payment_method = ANY (ARRAY['card'::text, 'cash'::text, 'pix'::text, 'boleto'::text])))
```

## Solução Implementada

Modificamos a Edge Function para usar `payment_method: "card"` (já que Stripe processa pagamentos com cartão) e adicionamos `payment_gateway: "stripe"` para identificar qual gateway foi usado.

### Código Anterior (Com Erro)

```typescript
const { data: order, error } = await supabase
  .from("orders")
  .insert({
    user_id: userId,
    items: formattedItems,
    total_amount: totalAmount / 100,
    shipping_cost: request.shipping_cost || 0,
    discount: request.discount || 0,
    coupon_code: request.coupon_code || null,
    shipping_address: request.shipping_address || null,
    currency: request.currency?.toLowerCase() || 'brl',
    status: "pending",
    payment_method: "stripe", // ❌ Valor inválido
  })
  .select()
  .single();
```

### Código Corrigido

```typescript
const { data: order, error } = await supabase
  .from("orders")
  .insert({
    user_id: userId,
    items: formattedItems,
    total_amount: totalAmount / 100,
    shipping_cost: request.shipping_cost || 0,
    discount: request.discount || 0,
    coupon_code: request.coupon_code || null,
    shipping_address: request.shipping_address || null,
    currency: request.currency?.toLowerCase() || 'brl',
    status: "pending",
    payment_method: "card", // ✅ Valor válido (Stripe usa cartão)
    payment_gateway: "stripe", // ✅ Identifica o gateway usado
  })
  .select()
  .single();
```

## Estrutura da Tabela Orders

### Campos Relacionados a Pagamento

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `payment_method` | text | Método de pagamento: 'card', 'cash', 'pix', 'boleto' |
| `payment_gateway` | text | Gateway usado: 'stripe', 'asaas', etc. |
| `payment_method_id` | text | ID do método de pagamento no gateway |
| `stripe_session_id` | text | ID da sessão Stripe |
| `stripe_payment_intent_id` | text | ID da intenção de pagamento Stripe |

### Separação de Responsabilidades

- **`payment_method`**: Indica o TIPO de pagamento (cartão, dinheiro, pix, boleto)
- **`payment_gateway`**: Indica QUAL gateway processou o pagamento (Stripe, Asaas, etc.)

Isso permite:
- Usar Stripe para processar pagamentos com cartão: `payment_method: 'card'`, `payment_gateway: 'stripe'`
- Usar Asaas para PIX: `payment_method: 'pix'`, `payment_gateway: 'asaas'`
- Usar Asaas para Boleto: `payment_method: 'boleto'`, `payment_gateway: 'asaas'`

## Benefícios da Solução

✅ **Compatível com Constraint**: Usa valor permitido pela constraint do banco  
✅ **Semântica Correta**: 'card' descreve corretamente o método de pagamento do Stripe  
✅ **Rastreabilidade**: Campo `payment_gateway` identifica qual gateway foi usado  
✅ **Flexibilidade**: Permite múltiplos gateways para o mesmo método de pagamento  
✅ **Consistência**: Mantém padrão para outros métodos (PIX, Boleto via Asaas)  

## Arquivo Modificado

- `/supabase/functions/create_stripe_checkout/index.ts` - Linha 120-121

## Versão da Edge Function

- **Versão Anterior**: 3
- **Versão Atual**: 4
- **Status**: ✅ Deployed e Ativo

## Como Testar

1. Adicionar produtos ao carrinho
2. Ir para página de checkout
3. Clicar em "Finalizar Compra (Stripe)"
4. ✅ Deve criar pedido com sucesso e redirecionar para Stripe

## Verificação no Banco de Dados

Após criar um pedido com Stripe, verificar na tabela `orders`:

```sql
SELECT 
  id,
  payment_method,
  payment_gateway,
  stripe_session_id,
  status
FROM orders
WHERE payment_gateway = 'stripe'
ORDER BY created_at DESC
LIMIT 5;
```

Resultado esperado:
- `payment_method`: 'card'
- `payment_gateway`: 'stripe'
- `stripe_session_id`: 'cs_test_...' ou 'cs_live_...'
- `status`: 'pending' (até pagamento ser confirmado)

## Constraints da Tabela Orders

### payment_method_check
```sql
CHECK ((payment_method = ANY (ARRAY['card'::text, 'cash'::text, 'pix'::text, 'boleto'::text])))
```

### status_check
```sql
CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])))
```

## Alternativas Consideradas

### ❌ Alternativa 1: Modificar Constraint
Adicionar 'stripe' aos valores permitidos na constraint.

**Por que não foi escolhida:**
- 'stripe' não é um método de pagamento, é um gateway
- Quebraria a semântica do campo
- Dificultaria relatórios por método de pagamento

### ❌ Alternativa 2: Remover Constraint
Remover a constraint completamente.

**Por que não foi escolhida:**
- Perderia validação de dados
- Permitiria valores inválidos
- Dificultaria manutenção

### ✅ Alternativa 3: Usar 'card' + 'payment_gateway' (ESCOLHIDA)
Usar valor correto no campo correto.

**Por que foi escolhida:**
- Mantém semântica correta
- Preserva validação de dados
- Permite rastreamento de gateway
- Flexível para múltiplos gateways

## Impacto

- **Pedidos Existentes**: Não afetados (constraint só valida novos inserts/updates)
- **Relatórios**: Melhor separação entre método e gateway
- **Integrações**: Mais fácil adicionar novos gateways no futuro
- **Manutenção**: Código mais claro e semântico

---

**Data da Correção**: 2025-01-03  
**Versão Edge Function**: 4  
**Status**: ✅ Corrigido e Deployed  
**Tipo**: Bug Fix - Database Constraint Violation
