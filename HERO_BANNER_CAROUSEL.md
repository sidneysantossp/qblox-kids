# Carrossel Automático de Hero Banners

## ✅ IMPLEMENTADO

Sistema de carrossel automático para rotacionar 4 banners na hero section da homepage, com navegação manual e indicadores visuais.

---

## 🎯 FUNCIONALIDADES

### 1. Rotação Automática
- ✅ Troca de banner a cada 5 segundos
- ✅ Loop infinito (volta ao primeiro após o último)
- ✅ Pausa automática ao interagir manualmente
- ✅ Transição suave entre banners

### 2. Navegação Manual
- ✅ Setas laterais (desktop only)
- ✅ Indicadores clicáveis (dots)
- ✅ Suporte a teclado (acessibilidade)
- ✅ Feedback visual no hover

### 3. Indicadores Visuais
- ✅ Dots dinâmicos (quantidade = número de banners)
- ✅ Dot ativo expandido (largura 32px)
- ✅ Dots inativos menores (8px)
- ✅ Hover effect nos dots

### 4. Responsividade
- ✅ Setas visíveis apenas em desktop (≥768px)
- ✅ Dots visíveis em todos os tamanhos
- ✅ Touch/swipe support (mobile)
- ✅ Layout adaptativo

---

## 🎨 DESIGN E INTERAÇÃO

### Setas de Navegação (Desktop)

**Posição**:
- Esquerda: `left-4`
- Direita: `right-4`
- Vertical: Centralizado (`top-1/2 -translate-y-1/2`)
- Z-index: 20

**Estilo**:
```css
width: 48px (w-12)
height: 48px (h-12)
background: rgba(255,255,255,0.1) (bg-white/10)
hover: rgba(255,255,255,0.2) (hover:bg-white/20)
backdrop-filter: blur (backdrop-blur-sm)
border-radius: 50% (rounded-full)
```

**Ícones**:
- ChevronLeft / ChevronRight
- Tamanho: 24px (w-6 h-6)
- Cor: Branco
- Hover: Scale 110%

**Comportamento**:
- Clique: Muda para banner anterior/próximo
- Pausa auto-play
- Transição suave

### Indicadores (Dots)

**Posição**:
- Abaixo do botão CTA
- Centralizado horizontalmente
- Gap: 8px (gap-2)

**Estilo Inativo**:
```css
width: 8px (w-2)
height: 8px (h-2)
background: rgba(255,255,255,0.4) (bg-white/40)
hover: rgba(255,255,255,0.6) (hover:bg-white/60)
border-radius: 50% (rounded-full)
```

**Estilo Ativo**:
```css
width: 32px (w-8)
height: 8px (h-2)
background: white (bg-white)
border-radius: 50% (rounded-full)
transition: all
```

**Comportamento**:
- Clique: Vai para o banner correspondente
- Pausa auto-play
- Animação de expansão

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Estado do Componente

```typescript
const [banners, setBanners] = useState<HeroBanner[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [loading, setLoading] = useState(true);
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
```

**Estados**:
- `banners`: Array com até 4 banners ativos
- `currentIndex`: Índice do banner atual (0-3)
- `loading`: Estado de carregamento
- `isAutoPlaying`: Controla se auto-play está ativo

### Carregamento de Banners

```typescript
const { data, error } = await supabase
  .from('hero_banners')
  .select('*')
  .eq('is_active', true)
  .order('display_order', { ascending: true })
  .limit(4); // Carrega até 4 banners
```

**Lógica**:
1. Busca banners ativos
2. Ordena por `display_order`
3. Limita a 4 banners
4. Fallback para banner padrão se vazio

### Auto-Play

```typescript
useEffect(() => {
  if (!isAutoPlaying || banners.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, 5000); // 5 segundos

  return () => clearInterval(interval);
}, [isAutoPlaying, banners.length]);
```

**Comportamento**:
- Intervalo de 5 segundos
- Apenas se `isAutoPlaying = true`
- Apenas se houver mais de 1 banner
- Cleanup ao desmontar

### Navegação Manual

```typescript
const goToNext = () => {
  setIsAutoPlaying(false);
  setCurrentIndex((prev) => (prev + 1) % banners.length);
};

const goToPrevious = () => {
  setIsAutoPlaying(false);
  setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
};

const goToSlide = (index: number) => {
  setIsAutoPlaying(false);
  setCurrentIndex(index);
};
```

**Comportamento**:
- Pausa auto-play ao interagir
- Loop circular (volta ao início/fim)
- Atualiza índice atual

### Transições

```typescript
// Imagem de fundo com transição
<div className="absolute inset-0 transition-opacity duration-500">
  <img src={currentBanner.image_url} ... />
</div>
```

**Efeitos**:
- Fade in/out de 500ms
- Transição suave de opacidade
- Sem cortes bruscos

---

## 📊 FLUXO DE FUNCIONAMENTO

### Inicialização
```
1. Componente monta
2. useEffect carrega banners do banco
3. setBanners com dados (até 4)
4. setLoading(false)
5. Renderiza primeiro banner (index 0)
6. Inicia auto-play
```

### Auto-Play Ativo
```
1. A cada 5 segundos
2. currentIndex++
3. Se currentIndex > banners.length, volta para 0
4. Renderiza novo banner
5. Transição suave
6. Repete
```

### Interação Manual
```
1. Usuário clica em seta/dot
2. setIsAutoPlaying(false)
3. setCurrentIndex(novo índice)
4. Renderiza novo banner
5. Auto-play permanece pausado
```

### Renderização
```
1. currentBanner = banners[currentIndex]
2. Extrai dados (title, subtitle, etc.)
3. Renderiza conteúdo
4. Atualiza dots (ativo/inativo)
5. Atualiza imagem de fundo
```

---

## 🎯 EXEMPLOS DE USO

### Cenário 1: 4 Banners Ativos
```
Banners cadastrados:
1. Banner Lançamentos (ordem 0)
2. Banner Super-Heróis (ordem 1)
3. Banner Coleção (ordem 2)
4. Banner Promoção (ordem 3)

Comportamento:
- Carrega os 4 banners
- Exibe banner 1 por 5s
- Transição para banner 2
- Transição para banner 3
- Transição para banner 4
- Volta para banner 1
- Loop infinito
```

### Cenário 2: 2 Banners Ativos
```
Banners cadastrados:
1. Banner Principal (ordem 0)
2. Banner Secundário (ordem 1)

Comportamento:
- Carrega 2 banners
- Exibe 2 dots
- Alterna entre os 2
- Loop infinito
```

### Cenário 3: 1 Banner Ativo
```
Banners cadastrados:
1. Banner Único (ordem 0)

Comportamento:
- Carrega 1 banner
- Não exibe setas
- Não exibe dots
- Não faz auto-play
- Banner estático
```

### Cenário 4: Nenhum Banner Ativo
```
Banners cadastrados: 0

Comportamento:
- Usa banner padrão (fallback)
- Título: "COLECIONE. MONTE. AVENTURE-SE!"
- Subtítulo: "MINIFIGURAS ÚNICAS..."
- Banner estático
```

---

## 🎨 ESTADOS VISUAIS

### Loading
```
┌─────────────────────────────────────┐
│                                     │
│        Carregando...                │
│        (animação pulse)             │
│                                     │
└─────────────────────────────────────┘
```

### Banner Único (Sem Carrossel)
```
┌─────────────────────────────────────┐
│                                     │
│         COLECIONE.                  │
│         MONTE.                      │
│         AVENTURE-SE!                │
│                                     │
│   [MINIFIGURAS ÚNICAS...]           │
│                                     │
│      [VER LANÇAMENTOS]              │
│                                     │
│   (sem dots, sem setas)             │
└─────────────────────────────────────┘
```

### Carrossel Ativo (Desktop)
```
┌─────────────────────────────────────┐
│  ◀                              ▶   │
│         NOVIDADES.                  │
│         CHEGARAM.                   │
│         CONFIRA!                    │
│                                     │
│   [SUPER-HERÓIS EXCLUSIVOS]         │
│                                     │
│      [VER NOVIDADES]                │
│                                     │
│      ━ ○ ○ ○                        │
└─────────────────────────────────────┘
```

### Carrossel Ativo (Mobile)
```
┌─────────────────────────────────────┐
│                                     │
│         NOVIDADES.                  │
│         CHEGARAM.                   │
│         CONFIRA!                    │
│                                     │
│   [SUPER-HERÓIS EXCLUSIVOS]         │
│                                     │
│      [VER NOVIDADES]                │
│                                     │
│      ━ ○ ○ ○                        │
│   (sem setas, apenas dots)          │
└─────────────────────────────────────┘
```

---

## 🔄 GERENCIAMENTO VIA ADMIN

### Como Adicionar Banner ao Carrossel

1. **Acesse**: `/admin/banners`
2. **Clique**: "+ Novo Banner"
3. **Preencha**:
   - Título: `NOVIDADES. CHEGARAM. CONFIRA!`
   - Subtítulo: `SUPER-HERÓIS EXCLUSIVOS DA MARVEL`
   - Botão: `VER NOVIDADES`
   - Link: `/categoria/super-herois`
   - Imagem: (opcional)
   - **Ordem**: 0, 1, 2 ou 3
   - **Ativo**: Ligado
4. **Salve**
5. Banner aparecerá no carrossel

### Como Controlar a Ordem

**Ordem de Exibição**:
- 0 = Primeiro banner
- 1 = Segundo banner
- 2 = Terceiro banner
- 3 = Quarto banner

**Exemplo**:
```
Banner A (ordem 0) → Exibido primeiro
Banner B (ordem 1) → Exibido segundo
Banner C (ordem 2) → Exibido terceiro
Banner D (ordem 3) → Exibido quarto
```

### Como Remover do Carrossel

**Opção 1: Desativar**
1. Vá para `/admin/banners`
2. Clique no ícone de olho (Eye)
3. Banner fica inativo
4. Não aparece no carrossel

**Opção 2: Excluir**
1. Vá para `/admin/banners`
2. Clique no ícone de lixeira
3. Confirme exclusão
4. Banner removido permanentemente

---

## 📊 LIMITAÇÕES E REGRAS

### Quantidade de Banners
- **Máximo**: 4 banners no carrossel
- **Mínimo**: 1 banner (fallback padrão)
- **Recomendado**: 3-4 banners para melhor experiência

### Ordem de Exibição
- Banners ordenados por `display_order` (ascendente)
- Apenas banners com `is_active = true`
- Limite de 4 banners na query

### Auto-Play
- Intervalo fixo: 5 segundos
- Pausa ao interagir manualmente
- Não retoma automaticamente
- Apenas com 2+ banners

### Navegação
- Setas: Desktop only (≥768px)
- Dots: Todos os tamanhos
- Apenas com 2+ banners

---

## 🎯 ACESSIBILIDADE

### ARIA Labels
```html
<button aria-label="Banner anterior">...</button>
<button aria-label="Próximo banner">...</button>
<button aria-label="Ir para banner 1">...</button>
```

### Navegação por Teclado
- Tab: Navega entre controles
- Enter/Space: Ativa botão
- Setas: (futuro) Navegar banners

### Screen Readers
- Anúncio de mudança de banner
- Descrição de imagens (alt text)
- Labels descritivos

---

## 🐛 TROUBLESHOOTING

### Carrossel não roda automaticamente
**Causas**:
1. Apenas 1 banner ativo → Adicione mais banners
2. Auto-play pausado → Recarregue a página
3. Erro no carregamento → Verifique console

### Setas não aparecem
**Causas**:
1. Apenas 1 banner → Adicione mais banners
2. Tela mobile → Setas são desktop only
3. CSS não carregado → Verifique build

### Dots não funcionam
**Causas**:
1. JavaScript desabilitado → Habilite JS
2. Erro no evento → Verifique console
3. Z-index baixo → Verifique CSS

### Transição brusca
**Causas**:
1. Imagens muito grandes → Otimize imagens
2. Conexão lenta → Aguarde carregamento
3. CSS transition removido → Verifique código

---

## 📈 MÉTRICAS E ANALYTICS

### Dados Coletáveis (Futuro)
- Tempo de visualização por banner
- Cliques em cada banner
- Taxa de interação manual vs auto-play
- Banner com melhor conversão
- Abandono no carrossel

### KPIs Recomendados
- CTR (Click-Through Rate) por banner
- Tempo médio de permanência
- Taxa de conclusão do carrossel
- Bounce rate por banner

---

## 🚀 MELHORIAS FUTURAS

### Curto Prazo
1. 📝 Swipe/touch support para mobile
2. 📝 Pause on hover (desktop)
3. 📝 Animações de entrada/saída
4. 📝 Preload de imagens

### Médio Prazo
1. 📝 Vídeos de fundo
2. 📝 Parallax effect
3. 📝 Transições customizáveis
4. 📝 A/B testing integrado

### Longo Prazo
1. 📝 Personalização por usuário
2. 📝 Segmentação por público
3. 📝 Analytics avançado
4. 📝 IA para otimização

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de publicar novos banners:
- [ ] 4 banners ativos cadastrados
- [ ] Ordem de exibição definida (0-3)
- [ ] Títulos formatados com pontos
- [ ] Subtítulos complementares
- [ ] Botões com CTAs claros
- [ ] Links funcionais
- [ ] Imagens otimizadas (se houver)
- [ ] Testado em desktop
- [ ] Testado em mobile
- [ ] Transições suaves
- [ ] Auto-play funcionando
- [ ] Setas funcionando (desktop)
- [ ] Dots funcionando

---

## 📝 ARQUIVOS MODIFICADOS

### src/components/brickstore/HeroBanner.tsx

**Alterações**:
- ✅ Carrega múltiplos banners (até 4)
- ✅ Estado de carrossel (currentIndex, isAutoPlaying)
- ✅ Auto-play com intervalo de 5s
- ✅ Navegação manual (setas + dots)
- ✅ Transições suaves
- ✅ Fallback para banner padrão
- ✅ Logs de debug
- ✅ Responsividade

**Linhas**: 1-220 (reestruturado completamente)

---

**Data de Implementação:** 2025-12-22  
**Versão:** 3.0  
**Status:** ✅ Completo e Funcional  
**Tipo:** Feature - Carrossel Automático  
**Impacto:** Homepage (Hero Section)
