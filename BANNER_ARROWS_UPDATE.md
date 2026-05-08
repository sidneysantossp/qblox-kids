# Atualização: Setas do Banner Hero

## Alteração Realizada

As setas de navegação do carrossel de banners hero foram atualizadas para ter um fundo preto transparente, melhorando a visibilidade e o design.

## Estilo Aplicado

### Antes
```tsx
<CarouselPrevious className="left-4" />
<CarouselNext className="right-4" />
```

### Depois
```tsx
<CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 border-none text-white" />
<CarouselNext className="right-4 bg-black/50 hover:bg-black/70 border-none text-white" />
```

## Características

### Fundo
- **Normal**: `bg-black/50` (preto com 50% de opacidade)
- **Hover**: `bg-black/70` (preto com 70% de opacidade)

### Borda
- **Removida**: `border-none` (sem borda)

### Ícone
- **Cor**: `text-white` (branco para contraste)

### Posicionamento
- **Esquerda**: `left-4` (16px da borda esquerda)
- **Direita**: `right-4` (16px da borda direita)

## Efeito Visual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───┐                                             ┌───┐   │
│  │ ◄ │  [BANNER COM IMAGEM E CONTEÚDO]             │ ► │   │
│  └───┘                                             └───┘   │
│   ↑                                                 ↑       │
│   Fundo preto                                Fundo preto   │
│   transparente                               transparente  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Benefícios

1. **Melhor Visibilidade**: O fundo escuro garante que as setas sejam visíveis em qualquer imagem
2. **Design Moderno**: Efeito transparente cria um visual elegante
3. **Feedback Visual**: Hover mais escuro indica interatividade
4. **Consistência**: Combina com o overlay do banner

## Responsividade

As setas mantêm o mesmo estilo em todos os tamanhos de tela:
- Mobile: Visíveis e funcionais
- Tablet: Visíveis e funcionais
- Desktop: Visíveis e funcionais

## Arquivo Modificado

- `src/pages/HomePage.tsx` - Linha 274-275
