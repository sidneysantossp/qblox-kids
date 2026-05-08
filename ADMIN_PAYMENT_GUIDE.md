# Guia Rápido: Como Ativar Cartão de Crédito/Débito

## Para Administradores

### Passo 1: Acessar Painel Admin
1. Faça login como administrador
2. Acesse o menu **Admin**
3. Clique em **Pagamentos**

### Passo 2: Configurar API Asaas
1. Role até a seção **Integração Asaas**
2. Insira sua **Chave de API** (API Key)
3. Selecione o ambiente:
   - **Sandbox**: Para testes
   - **Production**: Para produção
4. Clique em **Salvar Configurações**

### Passo 3: Ativar Métodos de Pagamento
Na tabela de métodos de pagamento, você verá:

| Nome | Código | Descrição | Status | Ação |
|------|--------|-----------|--------|------|
| Cartão de Crédito | `credit_card` | Pague com cartão de crédito em até 12x | 🟢 Ativo | [Toggle] |
| Cartão de Débito | `debit_card` | Pague com cartão de débito | 🟢 Ativo | [Toggle] |
| PIX | `pix` | Pagamento instantâneo via PIX | 🟢 Ativo | [Toggle] |
| Boleto Bancário | `boleto` | Pague com boleto bancário | 🟢 Ativo | [Toggle] |

**Para ativar/desativar:**
- Clique no **toggle** ao lado do método desejado
- 🟢 Verde = Ativo (aparece no checkout)
- ⚪ Cinza = Inativo (não aparece no checkout)

### Passo 4: Verificar no Checkout
1. Abra o site em uma aba anônima
2. Adicione um produto ao carrinho
3. Vá para o checkout
4. Verifique se os métodos ativos aparecem

## Comportamento Dinâmico

### ✅ Quando Ativado:
- Método aparece na lista de opções de pagamento
- Clientes podem selecionar e usar
- Formulário de dados aparece (se for cartão)

### ❌ Quando Desativado:
- Método não aparece no checkout
- Clientes não podem selecionar
- Não afeta pedidos já criados

## Exemplo de Uso

### Cenário 1: Ativar Apenas PIX e Cartão de Crédito
```
✅ PIX - Ativo
❌ Boleto - Inativo
✅ Cartão de Crédito - Ativo
❌ Cartão de Débito - Inativo
```

**Resultado no Checkout:**
- Clientes verão apenas PIX e Cartão de Crédito
- Boleto e Cartão de Débito não aparecem

### Cenário 2: Ativar Todos os Métodos
```
✅ PIX - Ativo
✅ Boleto - Ativo
✅ Cartão de Crédito - Ativo
✅ Cartão de Débito - Ativo
```

**Resultado no Checkout:**
- Clientes verão todas as 4 opções
- Máxima flexibilidade de pagamento

## Dicas Importantes

### 🔐 Segurança:
- Nunca compartilhe sua API Key
- Use Sandbox para testes
- Só ative Production quando estiver pronto

### 💳 Cartões de Teste (Sandbox):
**Aprovado:**
- Número: `5162 3062 1937 8829`
- Validade: Qualquer data futura
- CVV: `123`

**Recusado:**
- Número: `5162 3062 1937 8837`

### 📊 Monitoramento:
- Verifique pedidos em **Admin → Pedidos**
- Status do pagamento é atualizado automaticamente
- Webhook do Asaas notifica mudanças de status

## Solução de Problemas

### Método não aparece no checkout:
1. ✅ Verifique se está ativo no admin
2. ✅ Limpe o cache do navegador
3. ✅ Verifique se a API Key está configurada

### Erro ao processar pagamento:
1. ✅ Verifique a API Key
2. ✅ Confirme o ambiente (sandbox/production)
3. ✅ Verifique logs em **Admin → Logs**

### Cartão recusado:
1. ✅ Use cartões de teste válidos (sandbox)
2. ✅ Verifique se os dados estão corretos
3. ✅ Confirme que a conta Asaas está ativa

## Contato e Suporte

Para mais informações sobre a API Asaas:
- 📚 Documentação: https://docs.asaas.com
- 💬 Suporte: https://www.asaas.com/suporte

---

**Última atualização:** 2025-12-22
