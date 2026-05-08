# Configuração do Asaas para Kids Block Store

Este guia explica como configurar o sistema de pagamentos Asaas para a plataforma Kids Block Store.

## Sobre o Asaas

O Asaas é um gateway de pagamento brasileiro que oferece:
- **Pix**: Pagamento instantâneo com QR Code
- **Boleto Bancário**: Pagamento tradicional com vencimento em 3 dias
- **Cartão de Crédito**: Aprovação imediata

## Pré-requisitos

1. Conta no Asaas (https://www.asaas.com)
2. Acesso ao painel de administração do Supabase
3. Projeto Kids Block Store já configurado

## Passo 1: Criar Conta no Asaas

### 1.1 Cadastro

1. Acesse https://www.asaas.com
2. Clique em "Criar conta grátis"
3. Preencha os dados da sua empresa:
   - Nome completo
   - Email
   - CPF/CNPJ
   - Telefone
4. Complete o processo de verificação

### 1.2 Verificação da Conta

1. Acesse o painel do Asaas
2. Complete o cadastro da empresa
3. Envie os documentos solicitados:
   - Documento de identidade
   - Comprovante de endereço
   - Documentos da empresa (se CNPJ)
4. Aguarde aprovação (geralmente 1-2 dias úteis)

## Passo 2: Obter Chave de API

### 2.1 Acessar Configurações

1. Faça login no painel do Asaas
2. Vá para **Configurações** → **Integrações** → **API**
3. Você verá duas opções:
   - **Ambiente de Produção**: Para transações reais
   - **Ambiente de Sandbox**: Para testes

### 2.2 Gerar Chave de API

**Para Testes (Sandbox):**
1. Clique em "Gerar nova chave" no ambiente Sandbox
2. Copie a chave gerada (começa com `$aact_`)
3. Guarde esta chave em local seguro

**Para Produção:**
1. Após aprovação da conta, clique em "Gerar nova chave" no ambiente de Produção
2. Copie a chave gerada
3. **IMPORTANTE**: Esta chave processa pagamentos reais

### 2.3 Segurança da Chave

⚠️ **ATENÇÃO**:
- Nunca compartilhe sua chave de API
- Não exponha a chave no código frontend
- Não commite a chave no Git
- Use sempre variáveis de ambiente

## Passo 3: Configurar no Supabase

### 3.1 Acessar Painel do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto Kids Block Store
3. Vá para **Settings** → **Edge Functions** → **Secrets**

### 3.2 Adicionar Chave do Asaas

1. Clique em **Add new secret**
2. Configure:
   - **Name**: `ASAAS_API_KEY`
   - **Value**: Cole sua chave de API do Asaas
3. Clique em **Save**

### 3.3 Configurar Token de Webhook (Opcional)

Para maior segurança nos webhooks:

1. Gere um token aleatório (pode usar: https://www.uuidgenerator.net/)
2. Adicione como secret no Supabase:
   - **Name**: `ASAAS_WEBHOOK_TOKEN`
   - **Value**: Cole o token gerado
3. Clique em **Save**

## Passo 4: Configurar Webhooks

### 4.1 Obter URL do Webhook

Sua URL do webhook será:
```
https://[SEU_PROJETO_ID].supabase.co/functions/v1/asaas_webhook
```

Substitua `[SEU_PROJETO_ID]` pelo ID do seu projeto Supabase.

### 4.2 Configurar no Asaas

1. No painel do Asaas, vá para **Configurações** → **Integrações** → **Webhooks**
2. Clique em **Adicionar webhook**
3. Configure:
   - **URL**: Cole a URL do webhook acima
   - **Eventos**: Selecione:
     - ✅ PAYMENT_CREATED
     - ✅ PAYMENT_AWAITING_RISK_ANALYSIS
     - ✅ PAYMENT_APPROVED_BY_RISK_ANALYSIS
     - ✅ PAYMENT_RECEIVED
     - ✅ PAYMENT_CONFIRMED
     - ✅ PAYMENT_OVERDUE
     - ✅ PAYMENT_DELETED
     - ✅ PAYMENT_REFUNDED
     - ✅ PAYMENT_REFUND_IN_PROGRESS
4. Se configurou o token, adicione no header:
   - **Header**: `asaas-access-token`
   - **Value**: Cole o token configurado
5. Clique em **Salvar**

## Passo 5: Testar Integração

### 5.1 Ambiente Sandbox

O Asaas fornece um ambiente de testes completo:

**Dados de Teste para Cartão de Crédito:**
- **Cartão Aprovado**:
  - Número: `5162306219378829`
  - Validade: Qualquer data futura
  - CVV: `318`
  - Nome: Qualquer nome

- **Cartão Recusado**:
  - Número: `5162306219378837`
  - Validade: Qualquer data futura
  - CVV: `318`

**Dados de Teste para Cliente:**
- CPF: `24971563792`
- Email: `teste@teste.com`
- Telefone: `(11) 99999-9999`

### 5.2 Fluxo de Teste

**Teste com Pix:**
1. Adicione produtos ao carrinho
2. Clique em "Pagar com Asaas"
3. Preencha os dados do cliente
4. Selecione "Pix"
5. Clique em "Finalizar Compra"
6. Você verá o QR Code e o código Pix
7. No ambiente sandbox, o pagamento é simulado automaticamente

**Teste com Boleto:**
1. Siga os passos 1-4 acima
2. Selecione "Boleto Bancário"
3. Clique em "Finalizar Compra"
4. Você verá o link para baixar o boleto
5. No sandbox, você pode simular o pagamento no painel do Asaas

**Teste com Cartão:**
1. Siga os passos 1-4 acima
2. Selecione "Cartão de Crédito"
3. Preencha os dados do cartão de teste
4. Clique em "Finalizar Compra"
5. O pagamento será processado imediatamente

### 5.3 Verificar Pagamentos

1. Acesse o painel do Asaas
2. Vá para **Cobranças**
3. Você verá todas as cobranças criadas
4. Clique em uma cobrança para ver detalhes

## Passo 6: Configurações Adicionais

### 6.1 Taxas do Asaas

O Asaas cobra as seguintes taxas (valores aproximados):
- **Pix**: 0,99% por transação
- **Boleto**: R$ 3,49 por boleto
- **Cartão de Crédito**: 4,99% por transação

Consulte o site do Asaas para taxas atualizadas.

### 6.2 Prazo de Repasse

- **Pix**: D+1 (1 dia útil)
- **Boleto**: D+1 após compensação
- **Cartão**: D+30 (30 dias)

### 6.3 Split de Pagamento

Se você trabalha com marketplace, o Asaas oferece split de pagamento:
1. Configure no painel do Asaas
2. Defina percentuais para cada recebedor
3. O Asaas distribui automaticamente

## Passo 7: Ir para Produção

### 7.1 Ativar Conta

1. Complete todas as verificações no Asaas
2. Aguarde aprovação da conta
3. Configure dados bancários para recebimento
4. Ative o ambiente de produção

### 7.2 Trocar Chave de API

1. No painel do Asaas, gere uma chave de produção
2. No Supabase, atualize a variável `ASAAS_API_KEY`
3. Use a chave de produção (não sandbox)

### 7.3 Atualizar Webhooks

1. Crie um novo webhook no ambiente de produção
2. Use a mesma URL das edge functions
3. Configure os mesmos eventos
4. Teste com uma transação real de baixo valor

### 7.4 Atualizar Edge Functions

As edge functions já estão configuradas para usar o ambiente correto baseado na chave de API:
- Chave sandbox → `https://sandbox.asaas.com/api/v3`
- Chave produção → `https://www.asaas.com/api/v3`

Para forçar o uso de produção, edite os arquivos das edge functions e substitua `sandbox.asaas.com` por `www.asaas.com`.

## Solução de Problemas

### Erro: "ASAAS_API_KEY não configurada"

**Causa**: Variável de ambiente não foi configurada no Supabase

**Solução**:
1. Acesse Supabase → Settings → Edge Functions → Secrets
2. Adicione `ASAAS_API_KEY` com sua chave do Asaas
3. Aguarde alguns minutos para propagar

### Erro: "Invalid API Key"

**Causa**: Chave do Asaas inválida ou expirada

**Solução**:
1. Verifique se copiou a chave completa
2. Certifique-se de usar a chave correta (sandbox vs produção)
3. Gere uma nova chave no painel do Asaas se necessário

### Erro ao criar cliente

**Causa**: Dados do cliente incompletos ou inválidos

**Solução**:
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Valide o formato do CPF/CNPJ
3. Verifique se o email é válido
4. Confirme que o CEP está no formato correto

### Pagamento não é confirmado

**Causa**: Webhook não está configurado ou falhou

**Solução**:
1. Verifique logs do Asaas para ver se o webhook foi enviado
2. Verifique logs do Supabase para ver se a função foi executada
3. Use o botão "Atualizar" na página de pedidos para verificar manualmente
4. Confirme que a URL do webhook está correta

### QR Code Pix não aparece

**Causa**: Erro ao gerar QR Code ou buscar dados do Pix

**Solução**:
1. Verifique logs da edge function
2. Confirme que o pagamento foi criado no Asaas
3. Acesse o painel do Asaas e copie o código Pix manualmente
4. Verifique se a biblioteca qrcode está instalada no frontend

### Cartão de crédito recusado

**Causa**: Dados do cartão inválidos ou cartão sem limite

**Solução**:
1. No sandbox, use os cartões de teste fornecidos
2. Verifique se todos os dados do cartão estão corretos
3. Confirme que a data de validade é futura
4. Em produção, o cliente deve usar um cartão válido

## Recursos Adicionais

- **Documentação do Asaas**: https://docs.asaas.com
- **Painel do Asaas**: https://www.asaas.com/login
- **Suporte do Asaas**: suporte@asaas.com
- **Status da API**: https://status.asaas.com
- **Comunidade**: https://comunidade.asaas.com

## Comparação: Asaas vs Stripe

| Recurso | Asaas | Stripe |
|---------|-------|--------|
| Pix | ✅ Sim | ❌ Não |
| Boleto | ✅ Sim | ❌ Não |
| Cartão | ✅ Sim | ✅ Sim |
| Taxa Pix | 0,99% | - |
| Taxa Boleto | R$ 3,49 | - |
| Taxa Cartão | 4,99% | 4,99% + R$ 0,40 |
| Repasse | D+1 a D+30 | D+2 a D+7 |
| Suporte | Português | Inglês |
| Foco | Brasil | Global |

## Segurança

⚠️ **IMPORTANTE**:

1. **NUNCA** exponha sua chave de API no código frontend
2. **NUNCA** commite chaves secretas no Git
3. Use sempre HTTPS em produção
4. Valide todos os dados no servidor (edge functions)
5. Implemente rate limiting para prevenir abuso
6. Monitore transações suspeitas regularmente
7. Configure alertas para transações de alto valor
8. Mantenha logs de todas as transações

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs do Asaas e Supabase
2. Consulte a documentação oficial do Asaas
3. Entre em contato com o suporte do Asaas
4. Acesse a comunidade do Asaas para dúvidas

## Próximos Passos

Após configurar o Asaas:
1. ✅ Teste todos os métodos de pagamento
2. ✅ Configure webhooks corretamente
3. ✅ Valide o fluxo completo de compra
4. ✅ Monitore as primeiras transações
5. ✅ Configure alertas de segurança
6. ✅ Documente processos internos
7. ✅ Treine equipe de suporte

---

**Última atualização**: Dezembro 2025
**Versão**: 1.0
