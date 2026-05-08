# Configuração do Stripe para QBlox Kids

Este guia explica como configurar o sistema de pagamentos Stripe para a plataforma QBlox Kids.

## Pré-requisitos

1. Conta no Stripe (https://stripe.com)
2. Acesso ao painel de administração do Supabase
3. Projeto QBlox Kids já configurado

## Passo 1: Obter Chaves do Stripe

### 1.1 Criar/Acessar Conta Stripe

1. Acesse https://dashboard.stripe.com
2. Faça login ou crie uma nova conta
3. Complete o processo de verificação da conta

### 1.2 Obter Chave Secreta (Secret Key)

1. No painel do Stripe, vá para **Developers** → **API keys**
2. Você verá duas chaves:
   - **Publishable key** (pk_test_... ou pk_live_...)
   - **Secret key** (sk_test_... ou sk_live_...)
3. **IMPORTANTE**: Copie a **Secret key** (sk_test_... para testes ou sk_live_... para produção)
4. **NUNCA** compartilhe esta chave ou a exponha no código frontend

### 1.3 Modo de Teste vs Produção

- **Modo de Teste**: Use chaves que começam com `sk_test_`
  - Não processa pagamentos reais
  - Use cartões de teste do Stripe
  - Ideal para desenvolvimento

- **Modo de Produção**: Use chaves que começam com `sk_live_`
  - Processa pagamentos reais
  - Requer conta Stripe totalmente verificada
  - Use apenas quando estiver pronto para produção

## Passo 2: Configurar Variáveis de Ambiente no Supabase

### 2.1 Acessar Painel do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto QBlox Kids
3. Vá para **Settings** → **Edge Functions** → **Secrets**

### 2.2 Adicionar Chave do Stripe

1. Clique em **Add new secret**
2. Configure:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: Cole sua chave secreta do Stripe (sk_test_... ou sk_live_...)
3. Clique em **Save**

### 2.3 Verificar Outras Variáveis

Certifique-se de que as seguintes variáveis já existem (criadas automaticamente):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Passo 3: Configurar Webhook do Stripe (Opcional)

Para receber notificações automáticas de eventos de pagamento:

### 3.1 Obter URL do Webhook

Sua URL do webhook será:
```
https://[SEU_PROJETO_ID].supabase.co/functions/v1/verify_stripe_payment
```

### 3.2 Configurar no Stripe

1. No painel do Stripe, vá para **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   - **Endpoint URL**: Cole a URL acima
   - **Events to send**: Selecione:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Clique em **Add endpoint**
5. Copie o **Signing secret** (whsec_...)
6. Adicione como variável de ambiente no Supabase:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: Cole o signing secret

## Passo 4: Configurar URL de Retorno

### 4.1 Atualizar Edge Function (se necessário)

No arquivo `/supabase/functions/create_stripe_checkout/index.ts`, verifique as URLs de sucesso e cancelamento:

```typescript
success_url: `${origin}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${origin}/carrinho`,
```

Certifique-se de que:
- A URL de sucesso aponta para `/pagamento-sucesso`
- A URL de cancelamento aponta para `/carrinho`
- O domínio está correto para seu ambiente

## Passo 5: Testar Integração

### 5.1 Cartões de Teste do Stripe

Use estes cartões para testar (modo de teste apenas):

**Pagamento Bem-sucedido:**
- Número: `4242 4242 4242 4242`
- Data: Qualquer data futura
- CVC: Qualquer 3 dígitos
- CEP: Qualquer CEP válido

**Pagamento Recusado:**
- Número: `4000 0000 0000 0002`

**Requer Autenticação 3D Secure:**
- Número: `4000 0025 0000 3155`

### 5.2 Fluxo de Teste

1. Adicione produtos ao carrinho
2. Clique em "Finalizar Compra"
3. Você será redirecionado para a página de pagamento do Stripe
4. Use um cartão de teste
5. Complete o pagamento
6. Você será redirecionado para `/pagamento-sucesso`
7. Verifique se o pedido aparece em "Meus Pedidos"
8. Verifique no painel admin se o pedido está marcado como "Concluído"

## Passo 6: Configurar Moeda e Métodos de Pagamento

### 6.1 Moeda Padrão

A moeda padrão está configurada como BRL (Real Brasileiro). Para alterar:

1. Edite `/supabase/functions/create_stripe_checkout/index.ts`
2. Localize: `currency: currency || 'brl'`
3. Altere para sua moeda desejada (ex: 'usd', 'eur')

### 6.2 Métodos de Pagamento

Por padrão, apenas cartão de crédito está habilitado. Para adicionar outros métodos:

1. No painel do Stripe, vá para **Settings** → **Payment methods**
2. Ative os métodos desejados (Pix, boleto, etc.)
3. Edite a edge function para incluir:

```typescript
payment_method_types: ['card', 'boleto', 'pix'],
```

## Passo 7: Monitoramento e Logs

### 7.1 Logs do Stripe

- Acesse **Developers** → **Logs** no painel do Stripe
- Visualize todas as requisições da API
- Identifique erros e problemas

### 7.2 Logs do Supabase

- Acesse **Edge Functions** → **Logs** no painel do Supabase
- Visualize logs das funções `create_stripe_checkout` e `verify_stripe_payment`
- Identifique erros de execução

## Passo 8: Ir para Produção

Quando estiver pronto para aceitar pagamentos reais:

### 8.1 Ativar Conta Stripe

1. Complete todas as informações da conta no Stripe
2. Forneça documentos de identificação
3. Configure informações bancárias para receber pagamentos
4. Aguarde aprovação do Stripe

### 8.2 Trocar para Chaves de Produção

1. No painel do Stripe, alterne para **Live mode**
2. Copie a **Secret key** de produção (sk_live_...)
3. No Supabase, atualize a variável `STRIPE_SECRET_KEY` com a chave de produção
4. Teste com um pagamento real de baixo valor

### 8.3 Configurar Webhook de Produção

1. Crie um novo endpoint de webhook no modo Live
2. Use a mesma URL das edge functions
3. Atualize `STRIPE_WEBHOOK_SECRET` com o novo signing secret

## Solução de Problemas

### Erro: "STRIPE_SECRET_KEY não configurada"

**Causa**: Variável de ambiente não foi configurada no Supabase

**Solução**:
1. Acesse Supabase → Settings → Edge Functions → Secrets
2. Adicione `STRIPE_SECRET_KEY` com sua chave do Stripe
3. Aguarde alguns minutos para propagar

### Erro: "Invalid API Key"

**Causa**: Chave do Stripe inválida ou expirada

**Solução**:
1. Verifique se copiou a chave completa
2. Certifique-se de usar a chave correta (test vs live)
3. Gere uma nova chave no painel do Stripe se necessário

### Pagamento não é confirmado

**Causa**: Webhook não está configurado ou falhou

**Solução**:
1. Verifique logs do Stripe para ver se o webhook foi enviado
2. Verifique logs do Supabase para ver se a função foi executada
3. Use o botão "Atualizar" na página de pedidos para verificar manualmente

### Redirecionamento não funciona

**Causa**: URLs de sucesso/cancelamento incorretas

**Solução**:
1. Verifique as URLs na edge function
2. Certifique-se de que o domínio está correto
3. Teste localmente primeiro

## Recursos Adicionais

- **Documentação do Stripe**: https://stripe.com/docs
- **Documentação do Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Cartões de Teste do Stripe**: https://stripe.com/docs/testing
- **Suporte do Stripe**: https://support.stripe.com

## Segurança

⚠️ **IMPORTANTE**:

1. **NUNCA** exponha sua Secret Key no código frontend
2. **NUNCA** commite chaves secretas no Git
3. Use sempre HTTPS em produção
4. Valide todos os dados no servidor (edge functions)
5. Implemente rate limiting para prevenir abuso
6. Monitore transações suspeitas regularmente

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs do Stripe e Supabase
2. Consulte a documentação oficial
3. Entre em contato com o suporte técnico
