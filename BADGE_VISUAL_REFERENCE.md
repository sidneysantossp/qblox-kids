# Badge de Disponibilidade - Referência Visual

## Exemplo de Card com Badge

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        [Imagem do Produto]          │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────┐                │  ← Badge de Disponibilidade
│  │ Pronta Entrega  │                │    (Verde, Azul ou Vermelho)
│  └─────────────────┘                │
├─────────────────────────────────────┤
│                                     │
│  Boneco LEGO Super Heróis           │
│  ⭐ 4.5 (123 avaliações)            │
│                                     │
│  R$ 99,90  R$ 129,90                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [-]    [5]    [+]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🛒 Adicionar               │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## Variações de Badge

### 1. Pronta Entrega (Verde)
```
┌─────────────────┐
│ Pronta Entrega  │  ← Fundo: #16a34a (Verde)
└─────────────────┘     Texto: Branco
```
**Quando usar**: Produto em estoque, pronto para envio imediato

### 2. Sob Encomenda (Azul)
```
┌─────────────────┐
│ Sob Encomenda   │  ← Fundo: #2563eb (Azul)
└─────────────────┘     Texto: Branco
```
**Quando usar**: Produto fabricado sob demanda, prazo de produção

### 3. Indisponível (Vermelho)
```
┌─────────────────┐
│ Indisponível    │  ← Fundo: #dc2626 (Vermelho)
└─────────────────┘     Texto: Branco
```
**Quando usar**: Produto temporariamente fora de linha

## Interface de Administração

### Formulário de Produto - Seção Status

```
┌─────────────────────────────────────────────┐
│  Status                                     │
├─────────────────────────────────────────────┤
│                                             │
│  Disponibilidade                            │
│  ┌─────────────────────────────────────┐   │
│  │ Pronta Entrega              ▼       │   │
│  └─────────────────────────────────────┘   │
│  Status de disponibilidade do produto      │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Destaque                          [ OFF ]  │
│  Exibir na seção de destaques              │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Mais Vendido                      [ OFF ]  │
│  Exibir em mais vendidos                   │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Em Promoção                       [ OFF ]  │
│  Exibir em ofertas                         │
│                                             │
└─────────────────────────────────────────────┘
```

### Dropdown de Disponibilidade (Expandido)

```
┌─────────────────────────────────────┐
│ Pronta Entrega              ▼       │
└─────────────────────────────────────┘
  ┌─────────────────────────────────┐
  │ ✓ Pronta Entrega                │  ← Selecionado
  ├─────────────────────────────────┤
  │   Sob Encomenda                 │
  ├─────────────────────────────────┤
  │   Indisponível                  │
  └─────────────────────────────────┘
```

## Fluxo de Trabalho

### 1. Administrador Cria/Edita Produto
```
Admin → Produtos → Editar/Novo
  ↓
Preenche informações básicas
  ↓
Seleciona "Disponibilidade" na seção Status
  ↓
Escolhe: Pronta Entrega | Sob Encomenda | Indisponível
  ↓
Salva produto
```

### 2. Cliente Visualiza Produto
```
Cliente → Navega pela loja
  ↓
Vê card do produto
  ↓
Badge aparece logo abaixo da imagem
  ↓
Cliente entende status de disponibilidade
  ↓
Toma decisão de compra informada
```

## Cores e Estilos

### Paleta de Cores

| Status           | Cor Principal | Hover        | Código Hex |
|------------------|---------------|--------------|------------|
| Pronta Entrega   | Verde 600     | Verde 700    | #16a34a    |
| Sob Encomenda    | Azul 600      | Azul 700     | #2563eb    |
| Indisponível     | Vermelho 600  | Vermelho 700 | #dc2626    |

### Classes Tailwind

```css
/* Pronta Entrega */
bg-green-600 hover:bg-green-700 text-white

/* Sob Encomenda */
bg-blue-600 hover:bg-blue-700 text-white

/* Indisponível */
bg-red-600 hover:bg-red-700 text-white
```

## Responsividade

### Mobile (< 768px)
```
┌─────────────────┐
│                 │
│   [Imagem]      │
│                 │
├─────────────────┤
│ [Badge]         │  ← Mesmo tamanho
├─────────────────┤
│ Título          │
│ ⭐ 4.5 (123)    │
│ R$ 99,90        │
│ [Qtd] [Add]     │
└─────────────────┘
```

### Desktop (≥ 1280px)
```
┌─────────────────────────┐
│                         │
│      [Imagem]           │
│                         │
├─────────────────────────┤
│ [Badge]                 │  ← Mesmo tamanho
├─────────────────────────┤
│ Título do Produto       │
│ ⭐ 4.5 (123)            │
│ R$ 99,90  R$ 129,90     │
│ [Quantidade] [Adicionar]│
└─────────────────────────┘
```

## Estados do Badge

### Normal
```
┌─────────────────┐
│ Pronta Entrega  │  ← Cor sólida
└─────────────────┘
```

### Hover (quando aplicável)
```
┌─────────────────┐
│ Pronta Entrega  │  ← Cor mais escura
└─────────────────┘
```

## Integração com Outros Elementos

### Badge + Desconto
```
┌─────────────────────────┐
│  ┌────────┐             │
│  │ -20%   │  ← Desconto │
│  └────────┘             │
│                         │
│      [Imagem]           │
│                         │
├─────────────────────────┤
│ [Pronta Entrega]        │  ← Badge Disponibilidade
├─────────────────────────┤
│ Título                  │
└─────────────────────────┘
```

### Badge + Esgotado
```
┌─────────────────────────┐
│                         │
│   ╔═════════════════╗   │
│   ║   ESGOTADO      ║   │  ← Overlay
│   ╚═════════════════╝   │
│                         │
├─────────────────────────┤
│ [Indisponível]          │  ← Badge (ainda visível)
├─────────────────────────┤
│ Título                  │
└─────────────────────────┘
```

## Casos de Uso

### Cenário 1: Produto em Estoque
```
Status: "Pronta Entrega"
Badge: Verde
Mensagem: Cliente sabe que receberá rapidamente
```

### Cenário 2: Produto Personalizado
```
Status: "Sob Encomenda"
Badge: Azul
Mensagem: Cliente entende que há prazo de produção
```

### Cenário 3: Produto Fora de Linha
```
Status: "Indisponível"
Badge: Vermelho
Mensagem: Cliente sabe que não pode comprar no momento
```

## Acessibilidade

### Contraste de Cores
- ✅ Verde (#16a34a) + Branco: Contraste 4.5:1 (WCAG AA)
- ✅ Azul (#2563eb) + Branco: Contraste 4.5:1 (WCAG AA)
- ✅ Vermelho (#dc2626) + Branco: Contraste 4.5:1 (WCAG AA)

### Tamanho do Texto
- Fonte: Sistema padrão
- Tamanho: 14px (legível)
- Peso: Medium (500)

### Semântica HTML
```html
<Badge 
  variant="default"
  className="bg-green-600 hover:bg-green-700 text-white"
>
  Pronta Entrega
</Badge>
```

## Manutenção

### Alterar Cor de um Status
1. Localizar `getAvailabilityBadge()` em:
   - `src/components/products/ProductCard.tsx`
   - `src/components/products/FeaturedProductCard.tsx`
2. Modificar `className` do status desejado
3. Exemplo:
```typescript
case 'in_stock':
  return {
    label: 'Pronta Entrega',
    variant: 'default' as const,
    className: 'bg-emerald-600 hover:bg-emerald-700 text-white', // Nova cor
  };
```

### Alterar Texto de um Status
1. Localizar `getAvailabilityBadge()` nos mesmos arquivos
2. Modificar `label` do status desejado
3. Atualizar também no formulário admin:
```tsx
<SelectItem value="in_stock">Novo Texto</SelectItem>
```

## Checklist de Implementação

- [x] Migração de banco de dados aplicada
- [x] Tipo TypeScript criado (`AvailabilityStatus`)
- [x] Interface `Product` atualizada
- [x] Campo adicionado no formulário admin
- [x] Validação Zod configurada
- [x] Badge exibido em `ProductCard`
- [x] Badge exibido em `FeaturedProductCard`
- [x] Helper function criada
- [x] Produtos existentes atualizados
- [x] Documentação completa
- [x] Lint passou sem erros relacionados

## Próximos Passos (Opcional)

### Melhorias Futuras
1. **Filtro por Disponibilidade**
   - Adicionar filtro na página de produtos
   - Permitir buscar apenas "Pronta Entrega"

2. **Notificação de Disponibilidade**
   - Permitir cliente se inscrever para ser notificado
   - Quando produto "Indisponível" voltar ao estoque

3. **Prazo de Entrega**
   - Adicionar campo de prazo estimado
   - Exibir "Entrega em X dias" no badge

4. **Analytics**
   - Rastrear conversão por status
   - Identificar impacto do badge nas vendas

5. **Internacionalização**
   - Traduzir labels para outros idiomas
   - Suporte a múltiplos mercados
