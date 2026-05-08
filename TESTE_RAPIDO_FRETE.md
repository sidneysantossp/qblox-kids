# 🧪 Guia de Teste Rápido - Frete no Checkout

## ✅ O Que Foi Corrigido

1. **Opções de frete agora sempre aparecem** quando o CEP é preenchido
2. **Frete grátis atualizado** de R$ 99,00 para **R$ 199,00**
3. **Fallback automático** para frete padrão em caso de erro

---

## 🎯 Como Testar Agora

### Teste Rápido 1: Frete Padrão
```
1. Acesse: /checkout
2. Preencha CEP: 04438030
3. ✅ Deve aparecer: "Frete Padrão - R$ 15,90"
```

### Teste Rápido 2: Frete Grátis
```
1. Adicione produtos >= R$ 199,00
2. Acesse: /checkout
3. Preencha CEP: 04438030
4. ✅ Deve aparecer: "Frete Grátis - R$ 0,00"
5. ✅ Mensagem: "Parabéns! Você ganhou frete grátis..."
```

### Teste Rápido 3: Verificar Logs
```
1. Abra Console (F12)
2. Acesse: /checkout
3. Preencha CEP: 04438030
4. ✅ Deve ver logs detalhados no console
```

---

## 🔍 O Que Verificar

### No Checkout
- [ ] Seção "Opções de Frete" aparece após preencher CEP
- [ ] Pelo menos uma opção de frete é exibida
- [ ] Valor do frete aparece no resumo do pedido
- [ ] Total é calculado corretamente (Subtotal + Frete)

### No Carrinho
- [ ] Mensagem "Faltam R$ X para frete grátis!" usa R$ 199,00
- [ ] Quando total >= R$ 199,00, mensagem desaparece

### No TopBar
- [ ] Anúncio mostra "Frete Grátis em compras acima de R$ 199,00"

---

## 🐛 Se Algo Não Funcionar

### Problema: Opções de frete não aparecem
**Solução:**
1. Abra o Console (F12)
2. Procure por erros em vermelho
3. Verifique se o CEP tem 8 dígitos
4. Recarregue a página (Ctrl+R)

### Problema: Frete grátis não aplica
**Solução:**
1. Verifique se o total é >= R$ 199,00
2. Verifique no console se há logs "[API] Frete grátis aplicado"
3. Recarregue a página

### Problema: Erro no console
**Solução:**
- O sistema deve usar frete padrão automaticamente
- Deve aparecer toast: "Usando frete padrão. Valor: R$ 15,90"
- A compra não deve ser bloqueada

---

## 📊 Valores Esperados

| Situação | Frete Esperado | Prazo |
|----------|----------------|-------|
| Total < R$ 199,00 | R$ 15,90 | 5-10 dias |
| Total >= R$ 199,00 | R$ 0,00 (Grátis) | 5-7 dias |
| Erro na API | R$ 15,90 (Padrão) | 5-10 dias |

---

## 🎉 Tudo Funcionando?

Se os testes acima passarem, está tudo OK! ✅

### Próximos Passos (Opcional)
1. Configure a API dos Correios em `/admin/configuracoes`
2. Teste com CEPs de diferentes regiões
3. Verifique se PAC e SEDEX aparecem (se API configurada)

---

**Dúvidas?** Consulte o arquivo `CORRECOES_FRETE.md` para detalhes técnicos completos.
