# Banners Hero - Referência Visual

## Estrutura do Banner

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  [IMAGEM DE FUNDO]                                  │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────┐         │  │
│  │  │ OVERLAY GRADIENTE                      │         │  │
│  │  │ (Escuro → Transparente)                │         │  │
│  │  │                                        │         │  │
│  │  │  ┌──────────────────────────┐          │         │  │
│  │  │  │                          │          │         │  │
│  │  │  │  TÍTULO (Headline)       │          │         │  │
│  │  │  │  Grande, Branco, Bold    │          │         │  │
│  │  │  │                          │          │         │  │
│  │  │  │  Subtítulo (Subheadline) │          │         │  │
│  │  │  │  Médio, Branco           │          │         │  │
│  │  │  │                          │          │         │  │
│  │  │  │  ┌──────────────┐        │          │         │  │
│  │  │  │  │ BOTÃO CTA    │        │          │         │  │
│  │  │  │  └──────────────┘        │          │         │  │
│  │  │  │                          │          │         │  │
│  │  │  └──────────────────────────┘          │         │  │
│  │  │                                        │         │  │
│  │  └────────────────────────────────────────┘         │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Exemplo de Banner Configurado

### Banner 1: Super Heróis
```
Título: "Novos Bonecos de Super Heróis!"
Subtítulo: "Descubra nossa coleção exclusiva com até 40% de desconto"
CTA: "Ver Coleção"
Link: "/categoria/Super Heróis"
Imagem: [Imagem de super heróis LEGO]
```

**Resultado Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Imagem de fundo com super heróis LEGO]                   │
│                                                             │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ████                                                       │
│  ████  Novos Bonecos de Super Heróis!                      │
│  ████                                                       │
│  ████  Descubra nossa coleção exclusiva                    │
│  ████  com até 40% de desconto                             │
│  ████                                                       │
│  ████  ┌─────────────────┐                                 │
│  ████  │  Ver Coleção    │                                 │
│  ████  └─────────────────┘                                 │
│  ████                                                       │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Overlay Gradiente

### Código CSS
```css
background: linear-gradient(
  to right,
  rgba(0, 0, 0, 0.7),  /* 70% opaco à esquerda */
  rgba(0, 0, 0, 0.5),  /* 50% opaco no meio */
  transparent          /* Transparente à direita */
);
```

### Visualização do Gradiente
```
Esquerda                    Centro                    Direita
████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░
70% opaco                   50% opaco                 0% opaco
```

## Hierarquia Tipográfica

### Desktop (≥1280px)
```
┌────────────────────────────────────┐
│                                    │
│  TÍTULO PRINCIPAL                  │  ← 6xl (3.75rem / 60px)
│  (text-6xl, font-bold)             │     Bold, Branco
│                                    │
│  Subtítulo descritivo mais longo   │  ← 2xl (1.5rem / 24px)
│  que complementa o título          │     Regular, Branco 90%
│                                    │
│  ┌──────────────┐                  │  ← lg (1.125rem / 18px)
│  │ BOTÃO CTA    │                  │     Bold, Cor primária
│  └──────────────┘                  │
│                                    │
└────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│                      │
│  TÍTULO              │  ← 4xl (2.25rem / 36px)
│  PRINCIPAL           │     Bold, Branco
│                      │
│  Subtítulo mais      │  ← lg (1.125rem / 18px)
│  curto               │     Regular, Branco 90%
│                      │
│  ┌──────────┐        │  ← lg (1.125rem / 18px)
│  │ BOTÃO    │        │     Bold, Cor primária
│  └──────────┘        │
│                      │
└──────────────────────┘
```

## Painel Admin - Formulário

```
┌─────────────────────────────────────────────────────────┐
│  Novo Banner                                      [X]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Título (Headline) *                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Ex: Novos Bonecos de Super Heróis!               │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Subtítulo (Subheadline)                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Ex: Descubra nossa coleção exclusiva...          │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Imagem do Banner *                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │           [PREVIEW DA IMAGEM]                     │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│  [Selecionar Imagem]                                    │
│                                                         │
│  Ou insira uma URL:                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ https://exemplo.com/imagem.jpg                    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Texto do Botão (CTA)    │  Link do Botão              │
│  ┌─────────────────────┐ │  ┌─────────────────────┐   │
│  │ Ver Produtos        │ │  │ /categoria/...      │   │
│  └─────────────────────┘ │  └─────────────────────┘   │
│                                                         │
│  Ordem: [1]              │  Status: [✓] Ativo          │
│                                                         │
│                          [Cancelar]  [Salvar]          │
└─────────────────────────────────────────────────────────┘
```

## Lista de Banners no Admin

```
┌─────────────────────────────────────────────────────────────┐
│  Banners Hero                              [+ Novo Banner]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Buscar banner... [                                    ]    │
│                                                             │
│  ┌─────┬──────────────────┬──────────┬───────┬────────┬──┐ │
│  │ IMG │ Título           │ CTA      │ Ordem │ Status │  │ │
│  ├─────┼──────────────────┼──────────┼───────┼────────┼──┤ │
│  │ [▓] │ Novos Bonecos... │ Ver...   │   1   │ Ativo  │✏️🗑│ │
│  │     │ Descubra nossa...│          │       │        │  │ │
│  ├─────┼──────────────────┼──────────┼───────┼────────┼──┤ │
│  │ [▓] │ Monte Sua...     │ Começar..│   2   │ Ativo  │✏️🗑│ │
│  │     │ Crie combinações │          │       │        │  │ │
│  ├─────┼──────────────────┼──────────┼───────┼────────┼──┤ │
│  │ [▓] │ Lançamentos...   │ Explorar │   3   │ Ativo  │✏️🗑│ │
│  │     │ Seja o primeiro..│          │       │        │  │ │
│  └─────┴──────────────────┴──────────┴───────┴────────┴──┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Uso

### 1. Criar Banner
```
Admin → Banners Hero → Novo Banner
  ↓
Preencher formulário
  ↓
Upload imagem ou URL
  ↓
Salvar
  ↓
Banner aparece na home
```

### 2. Editar Banner
```
Admin → Banners Hero → [✏️ Editar]
  ↓
Modificar campos
  ↓
Salvar
  ↓
Alterações refletem na home
```

### 3. Desativar Banner
```
Admin → Banners Hero → [✏️ Editar]
  ↓
Status: Inativo
  ↓
Salvar
  ↓
Banner não aparece mais na home
```

## Dicas de Design

### Boas Práticas
✅ Use imagens de alta qualidade (1920x500px)
✅ Mantenha títulos curtos e impactantes (máx. 60 caracteres)
✅ Use CTAs com verbos de ação (Ver, Explorar, Descobrir)
✅ Teste em diferentes dispositivos
✅ Use imagens com espaço à esquerda para o texto

### Evite
❌ Imagens com texto importante nas bordas
❌ Títulos muito longos que quebram em várias linhas
❌ CTAs genéricos ("Clique aqui", "Saiba mais")
❌ Imagens muito escuras (o overlay já escurece)
❌ Mais de 3-4 banners ativos (carrossel muito longo)
