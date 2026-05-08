# Gerenciamento de Seções da Home - Guia de Uso

## 📍 Localização
**Painel Admin → Seções Home**

## 🎯 Funcionalidades Disponíveis

### 1. ✏️ Editar Título da Seção

**Como usar:**
1. Localize a seção que deseja editar na tabela
2. Clique no ícone de lápis (✏️) ao lado do título
3. Digite o novo título no campo de input
4. Pressione **Enter** ou clique no ícone de confirmação (✓) para salvar
5. Pressione **Esc** ou clique no ícone de cancelar (✗) para descartar

**Validações:**
- O título não pode estar vazio
- Mensagem de sucesso aparece após salvar
- Mensagem de erro aparece se houver falha

---

### 2. ↕️ Reordenar Seções

**Como usar:**
1. Localize a seção que deseja mover
2. Use os botões de seta na coluna "Ações":
   - **↑ (Seta para cima)**: Move a seção uma posição acima
   - **↓ (Seta para baixo)**: Move a seção uma posição abaixo
3. A ordem é atualizada automaticamente no banco de dados
4. A tabela é reordenada visualmente após a mudança

**Observações:**
- A primeira seção não pode subir (botão desabilitado)
- A última seção não pode descer (botão desabilitado)
- A ordem define como as seções aparecem na página inicial

---

### 3. 🔄 Ativar/Desativar Seções

**Como usar:**
1. Localize a seção na coluna "Status"
2. Clique no switch (botão de alternância)
3. O status muda entre:
   - **Ativo** (badge azul): Seção visível na home
   - **Inativo** (badge cinza): Seção oculta na home
4. Mensagem de confirmação aparece após a mudança

**Benefícios:**
- Oculte seções temporariamente sem deletá-las
- Teste diferentes layouts da home
- Controle quais seções aparecem para os visitantes

---

## 📊 Estrutura da Tabela

| Coluna | Descrição |
|--------|-----------|
| **Título** | Nome da seção (editável) |
| **Tipo** | Identificador técnico da seção (não editável) |
| **Ordem** | Posição numérica da seção na home |
| **Status** | Ativo/Inativo com switch interativo |
| **Ações** | Botões para mover seção (↑↓) |

---

## 🎨 Tipos de Seções Disponíveis

- `promotional_cards` - Cards promocionais (Frete grátis, Compra segura, etc.)
- `category_carousel` - Carrossel de categorias
- `on_sale` - Produtos em oferta
- `best_sellers` - Os mais vendidos
- `featured_products` - Produtos em destaque

---

## 💡 Dicas de Uso

1. **Organize por prioridade**: Coloque as seções mais importantes no topo
2. **Teste diferentes ordens**: Experimente reordenar para ver o que funciona melhor
3. **Use títulos descritivos**: Facilita a identificação das seções
4. **Desative temporariamente**: Útil para promoções sazonais
5. **Mantenha consistência**: Use títulos claros e objetivos

---

## ⚠️ Observações Importantes

- Todas as mudanças são salvas automaticamente no banco de dados
- As alterações aparecem imediatamente na página inicial do site
- Seções inativas não aparecem para os visitantes
- A ordem das seções afeta diretamente a experiência do usuário
- Mantenha pelo menos 3-5 seções ativas para uma home completa

---

## 🚀 Exemplo de Uso

**Cenário:** Você quer destacar produtos em oferta durante uma promoção

1. Localize a seção "Produtos em Oferta"
2. Edite o título para "🔥 MEGA PROMOÇÃO - Até 50% OFF"
3. Use as setas para mover essa seção para o topo (logo após o hero banner)
4. Certifique-se de que o status está "Ativo"
5. Após a promoção, você pode:
   - Desativar a seção (mantém os dados)
   - Ou mover para uma posição inferior
   - Ou editar o título de volta ao original

---

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas:
- Verifique se há mensagens de erro (toasts vermelhos)
- Recarregue a página se algo não atualizar
- As mudanças são persistentes no banco de dados
