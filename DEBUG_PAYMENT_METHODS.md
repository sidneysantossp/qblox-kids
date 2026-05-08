# Debug: Métodos de Pagamento Não Aparecem no Checkout

## Problema Relatado
Os métodos de pagamento (cartão de crédito e débito) estão ativos no painel admin, mas não aparecem na página de checkout.

## Verificações Realizadas

### ✅ Banco de Dados
```sql
SELECT * FROM payment_methods WHERE is_active = true;
```
**Resultado:** 4 métodos ativos encontrados:
- Cartão de Crédito (credit_card)
- Cartão de Débito (debit_card)
- PIX (pix)
- Boleto Bancário (boleto)

### ✅ Políticas RLS
```sql
-- Política: "Anyone can view active payment methods"
-- Permite que qualquer pessoa veja métodos ativos
```
**Status:** Configurada corretamente

### ✅ Função API
```typescript
// src/db/api.ts
export const getActivePaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};
```
**Status:** Implementada corretamente

### ✅ Importação no CheckoutPage
```typescript
import { getActivePaymentMethods } from '@/db/api';
```
**Status:** Importada corretamente

### ✅ useEffect no CheckoutPage
```typescript
useEffect(() => {
  const loadPaymentMethods = async () => {
    try {
      setIsLoadingPaymentMethods(true);
      const methods = await getActivePaymentMethods();
      setActivePaymentMethods(methods);
      
      if (methods.length > 0) {
        setPaymentMethod(methods[0].code);
      }
    } catch (error) {
      console.error('[Checkout] Erro ao carregar métodos de pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os métodos de pagamento',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  loadPaymentMethods();
}, [toast]);
```
**Status:** Implementado corretamente

## Página de Teste Criada

Para facilitar o debug, foi criada uma página de teste:

**URL:** `/test-payment-methods`

**Acesso:** 
1. Abra o navegador
2. Acesse: `https://seu-dominio.com/test-payment-methods`
3. Verifique os dados retornados

**O que a página mostra:**
- Total de métodos carregados
- Dados completos de cada método em JSON
- Mensagens de erro (se houver)

## Possíveis Causas

### 1. Cache do Navegador
**Solução:**
- Pressione `Ctrl + Shift + R` (Windows/Linux)
- Pressione `Cmd + Shift + R` (Mac)
- Ou abra em aba anônima

### 2. Erro Silencioso no Console
**Verificar:**
1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Procure por erros em vermelho
4. Procure por logs com `[Checkout]`

### 3. Estado Não Atualizado
**Verificar:**
1. Abra o DevTools (F12)
2. Vá para a aba "React DevTools" (se instalado)
3. Procure pelo componente `CheckoutForm`
4. Verifique o estado `activePaymentMethods`

### 4. Problema de Autenticação
**Verificar:**
- Se o usuário está logado
- Se há token válido no localStorage
- Se a sessão não expirou

## Passos para Debug

### Passo 1: Verificar Console
```javascript
// Abra o console do navegador (F12)
// Procure por estas mensagens:
[Checkout] Erro ao carregar métodos de pagamento: ...
```

### Passo 2: Testar Página de Debug
```
1. Acesse: /test-payment-methods
2. Verifique se os métodos aparecem
3. Se aparecerem, o problema está no CheckoutPage
4. Se não aparecerem, o problema está na API/Banco
```

### Passo 3: Verificar Network
```
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Filtre por "payment_methods"
4. Recarregue a página
5. Verifique a resposta da requisição
```

### Passo 4: Verificar Estado do React
```
1. Instale React DevTools (extensão do navegador)
2. Abra DevTools (F12)
3. Vá para aba "Components"
4. Procure por "CheckoutForm"
5. Verifique:
   - activePaymentMethods: [] ou [...]
   - isLoadingPaymentMethods: true ou false
   - paymentMethod: "pix" ou outro
```

## Melhorias Implementadas

### 1. Indicador de Loading
```tsx
{isLoadingPaymentMethods ? (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    <span className="ml-2 text-muted-foreground">
      Carregando métodos de pagamento...
    </span>
  </div>
) : ...}
```

### 2. Mensagem de Erro
```tsx
{activePaymentMethods.length === 0 ? (
  <div className="text-center py-8">
    <p className="text-muted-foreground">
      Nenhum método de pagamento disponível no momento.
    </p>
    <p className="text-xs text-muted-foreground mt-2">
      Entre em contato com o suporte.
    </p>
  </div>
) : ...}
```

### 3. Logs de Debug
```typescript
console.error('[Checkout] Erro ao carregar métodos de pagamento:', error);
```

## Próximos Passos

1. **Acesse a página de teste:** `/test-payment-methods`
2. **Verifique o console do navegador** para erros
3. **Limpe o cache** e tente novamente
4. **Verifique a aba Network** para ver a requisição
5. **Se o problema persistir**, compartilhe:
   - Screenshot do console
   - Screenshot da aba Network
   - Screenshot da página de teste

## Comandos Úteis

### Verificar Logs do Supabase
```bash
# No terminal do projeto
npm run dev
# Abra o console e procure por erros
```

### Testar API Diretamente
```javascript
// No console do navegador
import { supabase } from '@/db/supabase';

const { data, error } = await supabase
  .from('payment_methods')
  .select('*')
  .eq('is_active', true);

console.log('Data:', data);
console.log('Error:', error);
```

## Contato

Se o problema persistir após seguir todos os passos, forneça:
1. Screenshot do console (F12 → Console)
2. Screenshot da aba Network (F12 → Network)
3. Screenshot da página `/test-payment-methods`
4. Navegador e versão utilizada
