# Plataforma de E-commerce Infantil - Documento de Requisitos Atualizado

## 1. Nome do Site
Kids Block Store

## 2. Descrição do Site
Plataforma de e-commerce especializada na venda de bonecos de montar tipo LEGO para o público infantil, oferecendo produtos organizados por temas e categorias, com sistema completo de gestão administrativa e experiência personalizada de montagem de coleções.

## 3. Funcionalidades Principais

### 3.1 Navegação por Categorias
- Super Heróis
- Roblox
- Séries da TV
- Aventura
- Temáticos
- Lançamentos
- Monte sua Coleção (com experiência personalizada de onboarding)
- Ofertas Especiais (nova categoria)

### 3.2 Página Inicial (Home)

#### 3.2.1 Barra Superior (Top Strip)
**Estrutura:**
- Altura: 28-36px
- Fundo: claro (#F5F5F5 ou #FAFAFA)
- Layout: flexbox horizontal com justify-content: space-between

**Conteúdo Esquerda:**
- Texto: Atendimento online / Suporte
- Font-size: 12-14px
- Cor: cinza escuro (#333333)
- Font-weight: regular (400)

**Conteúdo Direita:**
- Links: Login / Minha Conta / Ajuda
- Font-size: 12-14px
- Cor: cinza escuro (#333333)
- Separador: barra vertical (|) entre itens
- Hover: cor laranja (#FF9800)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a barra superior
- Quando desativada, a barra não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Mobile: ocultar ou simplificar para apenas ícones

#### 3.2.2 Header Principal
**Estrutura:**
- Layout: grid de 3 colunas (logo | busca | ações)
- Fundo: branco (#FFFFFF)
- Padding: 16-24px vertical, 20-40px horizontal
- Altura: 80-100px
- Box-shadow: 0 2px 4px rgba(0,0,0,0.08)

**Coluna Esquerda - Logo:**
- Texto: KIDS BLOCK STORE ou logo customizado
- Font-size: 24-32px
- Font-weight: bold (700-800)
- Cor: preto (#000000)
- Font-family: sans-serif limpa

**Coluna Centro - Busca:**
- Width: 100% (max-width: 600px)
- Height: 44-48px
- Border: 1px solid cinza claro (#E0E0E0)
- Border-radius: 24px (arredondado)
- Padding: 12px 20px
- Placeholder: Buscar produtos...
- Ícone de lupa: posicionado à direita dentro do campo
- Font-size: 14-16px
- Background: branco (#FFFFFF)
- Focus: border laranja (#FF9800)

**Coluna Direita - Ações:**
- Display: flex, gap: 16-20px, align-items: center
- Ícones:
  - Conta/Login (ícone de usuário)
  - Favoritos (ícone de coração)
  - Carrinho (ícone de carrinho com badge laranja)
- Botão destacado:
  - Texto: Contato / Ofertas
  - Background: bege/caramelo (#B59470)
  - Cor do texto: branco (#FFFFFF)
  - Padding: 10-12px 20-24px
  - Border-radius: 8px
  - Font-size: 14-16px
  - Font-weight: semibold (600)
  - Hover: background mais escuro (#A07D5A)

**Responsividade:**
- Tablet: reduzir tamanho da busca
- Mobile: logo menor, busca em linha separada abaixo, ícones compactos

#### 3.2.3 Menu de Navegação (Categorias com Ícones)
**Estrutura:**
- Layout: flexbox horizontal
- Fundo: branco (#FFFFFF) ou cinza muito claro (#FAFAFA)
- Padding: 12-16px vertical
- Border-bottom: 1px solid cinza claro (#E0E0E0)

**Itens do Menu:**
- Display: flex, align-items: center, gap: 8px
- Ícone pequeno (16-20px) + texto
- Font-size: 14-16px
- Font-weight: medium (500)
- Cor: cinza escuro (#333333)
- Padding: 8-12px 16-20px
- Hover: cor laranja (#FF9800), background cinza claro (#F5F5F5)
- Cursor: pointer

**Categorias:**
- Super Heróis (ícone de máscara)
- Roblox (ícone de cubo)
- Séries da TV (ícone de TV)
- Aventura (ícone de bússola)
- Temáticos (ícone de estrela)
- Lançamentos (ícone de foguete)
- Monte sua Coleção (ícone de quebra-cabeça)
- Ofertas Especiais (ícone de etiqueta com raio)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o menu de navegação
- Quando desativado, o menu não é renderizado no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: todos os itens visíveis
- Tablet/Mobile: menu hambúrguer ou carrossel horizontal com scroll

#### 3.2.4 Hero / Banner Principal (Carrossel)
**Estrutura:**
- Layout: composição 50/50 (texto | imagem)
- Height: 400-600px (desktop), 300-400px (tablet), 250-350px (mobile)
- Position: relative

**Lado Esquerdo - Bloco de Texto:**
- Background: bege/caramelo (#B59470)
- Formato: trapezoidal/diagonal (borda direita inclinada)
- Padding: 40-60px
- Display: flex, flex-direction: column, justify-content: center

**Hierarquia de Texto:**
1. Linha pequena (script/cursiva):
   - Texto: diversas opções de bonecos
   - Font-family: cursiva (ex: Dancing Script, Pacifico)
   - Font-size: 16-20px
   - Cor: branco (#FFFFFF)
   - Margin-bottom: 8-12px

2. Headline:
   - Texto: Mantenha sua coleção sempre completa
   - Font-size: 24-32px (desktop), 20-24px (mobile)
   - Font-weight: regular (400)
   - Cor: branco (#FFFFFF)
   - Line-height: 1.3
   - Margin-bottom: 12-16px

3. Título gigante (display):
   - Texto: KIDS BLOCK
   - Font-size: 56-72px (desktop), 36-48px (mobile)
   - Font-weight: bold (700-800)
   - Cor: contorno branco (text-stroke ou outline)
   - Estilo: letra vazada (outline branco, preenchimento transparente)
   - Line-height: 1.1
   - Margin-bottom: 20-24px

4. Botão CTA:
   - Texto: Descontos de até 65% aproveite!
   - Background: bege mais escuro (#A07D5A)
   - Cor do texto: branco (#FFFFFF)
   - Padding: 14-16px 28-32px
   - Border-radius: 8px
   - Font-size: 16-18px
   - Font-weight: semibold (600)
   - Cursor: pointer
   - Hover: background ainda mais escuro (#8B6A4A), transform scale(1.02)
   - Transition: all 0.3s ease

**Lado Direito - Imagem:**
- Width: 50%
- Height: 100%
- Object-fit: cover
- Object-position: center
- Imagem: ambiente decorado com bonecos de montar

**Controles do Carrossel:**
- Setas laterais:
  - Position: absolute
  - Top: 50%
  - Transform: translateY(-50%)
  - Left: 20-30px (esquerda), Right: 20-30px (direita)
  - Background: branco com opacidade (rgba(255,255,255,0.8))
  - Border-radius: 50%
  - Width: 44-48px, Height: 44-48px
  - Cursor: pointer
  - Hover: background branco sólido
  - Ícone: seta (chevron) em cinza escuro

- Dots indicadores:
  - Position: absolute
  - Bottom: 20-30px
  - Left: 50%
  - Transform: translateX(-50%)
  - Display: flex, gap: 8-12px
  - Dot: círculo 8-10px, background cinza claro (#E0E0E0)
  - Dot ativo: background laranja (#FF9800)
  - Cursor: pointer

**Paleta de Cores:**
- Bege/caramelo: #B59470, #B58D61, #A07D5A
- Branco: #FFFFFF
- Preto/cinza: #000000, #333333, #757575

**Animações:**
- Transição entre slides: fade ou slide (0.6-0.8s ease)
- Entrada do conteúdo: headline, subtítulo, CTA com delays progressivos (0.2s, 0.4s, 0.6s)
- Autoplay: 5-7 segundos por slide
- Pausar ao hover

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o banner hero
- Quando desativado, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: layout 50/50
- Tablet: layout 40/60 ou empilhado
- Mobile: empilhado (texto acima, imagem abaixo), altura reduzida

#### 3.2.5 Faixa de Benefícios (3 Colunas com Ícones)
**Estrutura:**
- Layout: grid de 3 colunas
- Fundo: branco (#FFFFFF)
- Padding: 40-60px vertical, 20-40px horizontal
- Gap: 20-30px

**Card de Benefício:**
- Display: flex, flex-direction: column, align-items: center
- Text-align: center

**Ícone:**
- Tamanho: 48-56px
- Estilo: linear/outline
- Cor: laranja (#FF9800) ou bege (#B59470)
- Margin-bottom: 12-16px

**Título:**
- Font-size: 18-20px
- Font-weight: semibold (600)
- Cor: preto (#000000)
- Margin-bottom: 6-8px

**Subtítulo:**
- Font-size: 14-16px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Line-height: 1.4

**Benefícios:**
1. Frete grátis (ícone de caminhão)
   - Título: Frete Grátis
   - Subtítulo: Acima de R$ 99,00

2. Desconto (ícone de etiqueta)
   - Título: Desconto de 10%
   - Subtítulo: Na primeira compra

3. Segurança (ícone de cadeado)
   - Título: Loja 100% Segura
   - Subtítulo: Compra protegida

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a faixa de benefícios
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 3 colunas
- Tablet: 3 colunas (compactas)
- Mobile: 1 coluna (empilhado)

#### 3.2.6 Três Cards de Destaque (Mini-Banners de Categoria)
**Estrutura:**
- Layout: grid de 3 colunas
- Gap: 20-24px
- Padding: 40-60px vertical

**Card:**
- Background: cinza muito claro (#F5F5F5)
- Border-radius: 12-16px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.06)
- Padding: 24-32px
- Display: flex, align-items: center
- Cursor: pointer
- Hover: box-shadow mais intensa, transform translateY(-4px)
- Transition: all 0.3s ease

**Lado Esquerdo - Texto:**
- Width: 60%

**Etiqueta (script/cursiva):**
- Font-family: cursiva
- Font-size: 14-16px
- Cor: laranja (#FF9800) ou bege (#B59470)
- Margin-bottom: 8px

**Título:**
- Font-size: 20-24px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Line-height: 1.2
- Margin-bottom: 12-16px

**Botão:**
- Texto: CONFIRA AGORA
- Background: bege/caramelo (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 10-12px 20-24px
- Border-radius: 6-8px
- Font-size: 12-14px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#A07D5A)

**Lado Direito - Imagem:**
- Width: 40%
- Height: 120-150px
- Object-fit: cover
- Border-radius: 8px

**Cards:**
1. Mesas Decorativas (etiqueta: novidade)
2. Puffs Decorativos (etiqueta: lançamento)
3. Sofá Sleeper Puff (etiqueta: desconto)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar os cards de destaque
- Quando desativados, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: 3 colunas
- Tablet: 2 colunas (terceiro abaixo)
- Mobile: 1 coluna (empilhado)

#### 3.2.7 Compre por Categoria (Carrossel de Ícones Circulares)
**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px

**Carrossel:**
- Layout: flexbox horizontal com gap: 20-30px
- Overflow: scroll horizontal (ocultar scrollbar)
- Padding: 20px 0

**Item de Categoria:**
- Display: flex, flex-direction: column, align-items: center
- Width: 100-120px
- Cursor: pointer

**Imagem Circular:**
- Width: 80-100px
- Height: 80-100px
- Border-radius: 50%
- Object-fit: cover
- Border: 2px solid cinza claro (#E0E0E0)
- Margin-bottom: 8-12px
- Hover: border laranja (#FF9800), transform scale(1.05)
- Transition: all 0.3s ease

**Label:**
- Font-size: 12-14px
- Font-weight: medium (500)
- Cor: cinza escuro (#333333)
- Text-align: center
- Line-height: 1.3

**Setas de Navegação:**
- Position: absolute
- Top: 50% (da área de imagens)
- Transform: translateY(-50%)
- Left: 10-20px (esquerda), Right: 10-20px (direita)
- Background: branco (#FFFFFF)
- Border-radius: 50%
- Width: 40-44px, Height: 40-44px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Cursor: pointer
- Hover: background cinza claro (#F5F5F5)

**Categorias:**
- Candelabro
- Mesa
- Vaso
- Cadeira
- Luminária
- Decoração
- Outros

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o carrossel de categorias
- Quando desativado, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: 6-8 itens visíveis
- Tablet: 4-5 itens visíveis
- Mobile: 3-4 itens visíveis, swipe horizontal

#### 3.2.8 Novidades da Semana (Grid de Produtos - 4 Colunas)
**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF) ou cinza muito claro (#FAFAFA)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px

**Grid:**
- Layout: grid de 4 colunas
- Gap: 20-24px

**Card de Produto (Padrão Reutilizável):**

**Container:**
- Background: branco (#FFFFFF)
- Border-radius: 12-16px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 16-20px
- Cursor: pointer
- Hover: box-shadow mais intensa, transform translateY(-4px)
- Transition: all 0.3s ease

**Imagem do Produto:**
- Width: 100%
- Height: 200-240px
- Object-fit: cover
- Border-radius: 8-12px
- Margin-bottom: 12-16px
- Position: relative

**Badge de Desconto:**
- Position: absolute
- Top: 12px
- Left: 12px
- Background: preto (#000000)
- Cor do texto: branco (#FFFFFF)
- Padding: 6-8px 12-16px
- Border-radius: 20px
- Font-size: 12-14px
- Font-weight: bold (700)
- Formato: -10% / OFF
- Z-index: 2

**Ícone de Wishlist (Coração):**
- Position: absolute
- Top: 12px
- Right: 12px
- Background: branco com opacidade (rgba(255,255,255,0.9))
- Border-radius: 50%
- Width: 32-36px, Height: 32-36px
- Display: flex, align-items: center, justify-content: center
- Cursor: pointer
- Hover: background branco sólido, ícone laranja (#FF9800)
- Z-index: 2

**Código SKU:**
- Font-size: 11-13px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Margin-bottom: 6-8px
- Formato: SKU: XXXXXXXX
- Text-transform: uppercase

**Nome do Produto:**
- Font-size: 14-16px
- Font-weight: medium (500)
- Cor: cinza escuro (#333333)
- Line-height: 1.4
- Margin-bottom: 8-12px
- Max-lines: 2 (truncar com ellipsis)

**Preço Principal:**
- Font-size: 20-24px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 4px

**Preço Antigo:**
- Font-size: 14-16px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Text-decoration: line-through
- Margin-bottom: 4px

**Parcelamento:**
- Font-size: 12-14px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Margin-bottom: 12-16px

**Controles de Quantidade (Stepper):**
- Display: flex, align-items: center, justify-content: space-between
- Border: 1px solid cinza claro (#E0E0E0)
- Border-radius: 6-8px
- Padding: 8-10px
- Margin-bottom: 12px

**Botões - e +:**
- Width: 28-32px, Height: 28-32px
- Background: transparente
- Cor: cinza escuro (#333333)
- Font-size: 18-20px
- Cursor: pointer
- Hover: background cinza claro (#F5F5F5)

**Input de Quantidade:**
- Width: 40-50px
- Text-align: center
- Border: none
- Font-size: 14-16px
- Font-weight: medium (500)

**Botão COMPRAR:**
- Width: 100%
- Padding: 12-14px
- Background: verde (#1EAB49)
- Cor do texto: branco (#FFFFFF)
- Font-size: 14-16px
- Font-weight: semibold (600)
- Border-radius: 6-8px
- Border: none
- Cursor: pointer
- Hover: background verde escuro (#17923D), transform scale(1.02)
- Transition: all 0.3s ease
- Margin-bottom: 8-12px

**Ícone de Carrinho (Adição Rápida):**
- Position: absolute
- Bottom: 12px
- Right: 12px
- Background: laranja (#FF9800)
- Border-radius: 50%
- Width: 40-44px
- Height: 40-44px
- Display: flex, align-items: center, justify-content: center
- Cursor: pointer
- Box-shadow: 0 2px 8px rgba(0,0,0,0.15)
- Z-index: 3
- Ícone: carrinho de compras branco
- Hover: background laranja escuro (#F57C00), transform scale(1.1)
- Transition: all 0.3s ease

**Funcionalidade do Ícone de Carrinho:**
- Ao clicar, adiciona 1 unidade do produto ao carrinho
- Exibe feedback visual (animação de adição)
- Atualiza contador do carrinho no header
- Não requer interação com o stepper de quantidade

**Chips de Envio/Entrega:**
- Display: flex, gap: 6-8px, flex-wrap: wrap
- Chip:
  - Background: verde claro (#E8F5E9)
  - Border: 1px solid verde (#4CAF50)
  - Padding: 4-6px 10-12px
  - Border-radius: 12px
  - Font-size: 11-13px
  - Cor: verde escuro (#2E7D32)
  - Texto: Entrega rápida / Frete grátis

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção Novidades da Semana
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 4 colunas
- Tablet: 3 colunas
- Mobile: 2 colunas ou 1 coluna

#### 3.2.9 Faixa de 2 Banners Grandes (Promoção / Lançamentos)
**Estrutura:**
- Layout: grid de 2 colunas
- Gap: 20-24px
- Padding: 60-80px vertical
- Background: branco (#FFFFFF)

**Banner:**
- Height: 300-400px
- Border-radius: 16-20px
- Overflow: hidden
- Position: relative
- Cursor: pointer
- Hover: transform scale(1.02)
- Transition: all 0.3s ease

**Composição (similar ao hero):**
- Layout: 50/50 (texto | imagem)

**Bloco de Texto:**
- Background: bege/caramelo (#B59470)
- Formato: recorte diagonal
- Padding: 30-40px
- Display: flex, flex-direction: column, justify-content: center

**Texto Grande (Display):**
- Texto: PROMOÇÃO / LANÇAMENTOS
- Font-size: 36-48px
- Font-weight: bold (700-800)
- Cor: branco (#FFFFFF)
- Text-transform: uppercase
- Line-height: 1.1
- Margin-bottom: 16-20px

**Botão:**
- Texto: CONFIRA AGORA
- Background: branco (#FFFFFF)
- Cor do texto: bege (#B59470)
- Padding: 12-14px 24-28px
- Border-radius: 6-8px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background cinza claro (#F5F5F5)

**Imagem:**
- Width: 50%
- Height: 100%
- Object-fit: cover

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a faixa de banners grandes
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 2 colunas
- Tablet: 2 colunas (altura reduzida)
- Mobile: 1 coluna (empilhado)

#### 3.2.10 Categorias em Destaque (Cards de Categoria com Descrição)
**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF) ou cinza muito claro (#FAFAFA)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px

**Grid:**
- Layout: grid de 4 colunas
- Gap: 20-24px

**Card de Categoria:**
- Background: branco (#FFFFFF)
- Border-radius: 12-16px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 20-24px
- Cursor: pointer
- Hover: box-shadow mais intensa, transform translateY(-4px)
- Transition: all 0.3s ease

**Imagem:**
- Width: 100%
- Height: 180-220px
- Object-fit: cover
- Border-radius: 8-12px
- Margin-bottom: 16-20px

**Nome da Categoria:**
- Font-size: 18-22px
- Font-weight: semibold (600)
- Cor: preto (#000000)
- Margin-bottom: 8-12px

**Descrição:**
- Font-size: 13-15px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Line-height: 1.5
- Max-lines: 2-3
- Margin-bottom: 12-16px

**Botão:**
- Texto: Saiba mais / Ver mais
- Background: bege/caramelo (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 8-10px 16-20px
- Border-radius: 6px
- Font-size: 13-15px
- Font-weight: medium (500)
- Cursor: pointer
- Hover: background mais escuro (#A07D5A)

**Categorias:**
1. Chique agora!
2. Aconchego
3. Minimalista
4. Super Oferta

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção Categorias em Destaque
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 4 colunas
- Tablet: 2 colunas
- Mobile: 1 coluna

#### 3.2.10.1 Novidades da Semana (Carrossel de Produtos com Desconto)
**Posicionamento:**
- Inserida imediatamente após a seção 3.2.10 Categorias em Destaque

**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px
- Texto: Novidades da Semana

**Carrossel:**
- Layout: flexbox horizontal com gap: 20-24px
- Overflow: scroll horizontal (ocultar scrollbar)
- Padding: 20px 0

**Card de Produto:**
- Reutiliza o componente de Card de Produto padrão (seção 3.2.8)
- Width: 280-320px
- Min-width: 280px
- Inclui ícone de carrinho para adição rápida
- Inclui código SKU

**Setas de Navegação:**
- Position: absolute
- Top: 50% (da área de produtos)
- Transform: translateY(-50%)
- Left: 10-20px (esquerda), Right: 10-20px (direita)
- Background: branco (#FFFFFF)
- Border-radius: 50%
- Width: 44-48px, Height: 44-48px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Cursor: pointer
- Hover: background cinza claro (#F5F5F5)
- Ícone: seta (chevron) em cinza escuro

**Características Especiais:**
- Todos os produtos exibem badge de desconto no canto superior esquerdo
- Formato do badge: percentual (ex: -55% OFF, -37% OFF, -17% OFF)
- Exibição de código SKU abaixo da imagem
- Exibição de preço antigo riscado e preço atual em destaque
- Parcelamento visível (ex: até 12x de R$ 10,49 sem juros)
- Ícone de wishlist (coração) no canto superior direito
- Ícone de carrinho para adição rápida no canto inferior direito
- Controles de quantidade (stepper) integrados
- Botão COMPRAR em verde (#1EAB49)
- Chips de benefícios (Entrega rápida, Frete grátis) quando aplicável

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o carrossel Novidades da Semana
- Quando desativado, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: 4 produtos visíveis
- Tablet: 3 produtos visíveis
- Mobile: 1-2 produtos visíveis, swipe horizontal

**Imagem de Referência:**
- Utilizar image.png como referência visual para o layout e estilo dos cards

#### 3.2.11 Monte Sua Coleção (Grid de Produtos - 4 Colunas)
**Posicionamento:**
- Inserida após a seção 3.2.10.1 Novidades da Semana

**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF) ou cinza muito claro (#FAFAFA)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 16-20px
- Texto: Monte Sua Coleção

**Subtítulo:**
- Text-align: center
- Font-size: 15-17px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)
- Line-height: 1.5
- Margin-bottom: 32-40px
- Texto: Escolha suas peças favoritas e crie coleções únicas

**Grid:**
- Layout: grid de 4 colunas
- Gap: 20-24px

**Card de Produto:**
- Reutiliza o componente de Card de Produto padrão (seção 3.2.8)
- Mesma estrutura e estilo
- Inclui ícone de carrinho para adição rápida
- Inclui código SKU

**Filtro de Produtos:**
- Exibir apenas produtos que pertencem à categoria Monte sua Coleção
- Query/filtro: categoria = Monte sua Coleção

**Botão Ver Mais:**
- Text-align: center
- Margin-top: 32-40px

**Link:**
- Texto: Ver Todos os Produtos
- Background: bege/caramelo (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 12-14px 28-32px
- Border-radius: 8px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#A07D5A)
- Transition: all 0.3s ease
- Link: redireciona para página de categoria Monte sua Coleção

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção Monte Sua Coleção
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 4 colunas
- Tablet: 3 colunas
- Mobile: 2 colunas ou 1 coluna

**Funcionalidades:**
1. Filtrar e exibir apenas produtos da categoria Monte sua Coleção
2. Exibir até 8 produtos na página inicial
3. Botão Ver Todos redireciona para página completa da categoria
4. Manter todas as funcionalidades do card de produto padrão (wishlist, quantidade, comprar, carrinho rápido)
5. Exibir código SKU em todos os cards

#### 3.2.12 Nossos Queridinhos (Grid de Produtos)
- Reutiliza o componente de Card de Produto padrão (seção 3.2.8)
- Mesma estrutura e estilo
- Inclui ícone de carrinho para adição rápida
- Inclui código SKU
- Apenas muda o título da seção e a query/filtro de produtos

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção Nossos Queridinhos
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

#### 3.2.13 Mini Banners Promocionais (2 Banners Horizontais)
**Posicionamento:**
- Inserida imediatamente após a seção 3.2.12 Nossos Queridinhos

**Estrutura:**
- Layout: grid de 2 colunas
- Gap: 20-24px
- Padding: 40-60px vertical
- Background: branco (#FFFFFF)

**Banner:**
- Height: 180-220px
- Border-radius: 12-16px
- Overflow: hidden
- Position: relative
- Cursor: pointer
- Hover: box-shadow 0 4px 12px rgba(0,0,0,0.12), transform translateY(-2px)
- Transition: all 0.3s ease

**Composição:**
- Layout: horizontal (texto | imagem)
- Display: flex, align-items: center

**Lado Esquerdo - Texto:**
- Width: 55-60%
- Padding: 24-32px
- Background: gradiente ou cor sólida (configurável no admin)

**Etiqueta (opcional):**
- Font-family: cursiva
- Font-size: 12-14px
- Cor: configurável no admin
- Margin-bottom: 8px
- Text-transform: uppercase

**Título:**
- Font-size: 20-28px
- Font-weight: bold (700)
- Cor: configurável no admin
- Line-height: 1.2
- Margin-bottom: 12-16px
- Max-lines: 2

**Descrição (opcional):**
- Font-size: 13-15px
- Font-weight: regular (400)
- Cor: configurável no admin
- Line-height: 1.4
- Margin-bottom: 16-20px
- Max-lines: 2

**Botão CTA:**
- Texto: configurável no admin (ex: VER OFERTAS, CONFIRA AGORA)
- Background: configurável no admin
- Cor do texto: configurável no admin
- Padding: 10-12px 20-24px
- Border-radius: 6-8px
- Font-size: 13-15px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: opacity 0.9, transform scale(1.02)
- Transition: all 0.3s ease

**Lado Direito - Imagem:**
- Width: 40-45%
- Height: 100%
- Object-fit: cover
- Object-position: center

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar os mini banners promocionais
- Quando desativados, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: 2 colunas lado a lado
- Tablet: 2 colunas (altura reduzida)
- Mobile: 1 coluna (empilhado), layout vertical (imagem acima, texto abaixo)

**Gerenciamento no Admin:**
- Seção dedicada no painel admin para gerenciar mini banners
- Localização: dentro da seção Banner Hero, abaixo dos full banners
- Campos editáveis:
  + Título do banner
  + Etiqueta (opcional)
  + Descrição (opcional)
  + Texto do botão
  + Link de destino
  + Imagem (upload)
  + Cor de fundo do texto
  + Cor do título
  + Cor da descrição
  + Cor de fundo do botão
  + Cor do texto do botão
  + Ordem de exibição (1 ou 2)
  + Status (ativo/inativo) - toggle switch
  + Data de início (opcional)
  + Data de término (opcional)
- Limite: 2 mini banners ativos simultaneamente
- Preview em tempo real das alterações
- Opção de duplicar banner existente
- Validação de imagem (formato, tamanho, dimensões recomendadas)

#### 3.2.14 Banners Horizontais (Lançamentos / Novos Produtos)
**Estrutura:**
- Layout: 2 banners empilhados
- Gap: 20-24px
- Padding: 40-60px vertical

**Banner:**
- Background: cinza muito claro (#F5F5F5)
- Border-radius: 12-16px
- Padding: 30-40px
- Display: flex, align-items: center, justify-content: space-between
- Cursor: pointer
- Hover: box-shadow, transform translateY(-2px)
- Transition: all 0.3s ease

**Lado Esquerdo - Texto:**
- Width: 60%

**Título:**
- Font-size: 24-32px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 12-16px

**Botão:**
- Texto: VER MAIS
- Background: bege/caramelo (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 10-12px 20-24px
- Border-radius: 6-8px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#A07D5A)

**Lado Direito - Imagem:**
- Width: 35%
- Height: 150-180px
- Object-fit: cover
- Border-radius: 8px

**Banners:**
1. Lançamentos (imagem: quadros)
2. Novos Produtos (imagem: vasos)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar os banners horizontais
- Quando desativados, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: layout horizontal
- Tablet: layout horizontal (compacto)
- Mobile: empilhado (texto acima, imagem abaixo)

#### 3.2.15 Nossos Destaques (Grid de Produtos)
- Reutiliza o componente de Card de Produto padrão (seção 3.2.8)
- Mesma estrutura e estilo
- Inclui ícone de carrinho para adição rápida
- Inclui código SKU
- Apenas muda o título da seção e a query/filtro de produtos

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção Nossos Destaques
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

#### 3.2.16 Seção Institucional (Conheça sobre nossa empresa)
**Estrutura:**
- Layout: grid de 2 colunas
- Padding: 60-80px vertical
- Background: branco (#FFFFFF)
- Gap: 40-60px

**Coluna Esquerda - Texto:**
- Width: 50%

**Título:**
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Line-height: 1.2
- Margin-bottom: 16-20px

**Parágrafo:**
- Font-size: 15-17px
- Font-weight: regular (400)
- Cor: cinza escuro (#333333)
- Line-height: 1.6
- Margin-bottom: 20-24px

**Botão:**
- Texto: Ver mais
- Background: bege/caramelo (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 12-14px 24-28px
- Border-radius: 6-8px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#A07D5A)

**Coluna Direita - Imagens:**
- Width: 50%
- Position: relative

**Composição de Imagens:**
- 2 imagens sobrepostas
- Imagem 1:
  - Width: 70%
  - Height: 300-350px
  - Object-fit: cover
  - Border-radius: 12px
  - Box-shadow: 0 8px 16px rgba(0,0,0,0.12)
  - Position: relative
  - Z-index: 1

- Imagem 2:
  - Width: 60%
  - Height: 250-300px
  - Object-fit: cover
  - Border-radius: 12px
  - Box-shadow: 0 8px 16px rgba(0,0,0,0.12)
  - Position: absolute
  - Bottom: -20px
  - Right: 0
  - Z-index: 2

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção institucional
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 2 colunas
- Tablet: 2 colunas (compactas)
- Mobile: 1 coluna (empilhado)

#### 3.2.17 Escolha por Marcas (Carrossel de Logos)
**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF) ou cinza muito claro (#FAFAFA)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px

**Carrossel:**
- Layout: flexbox horizontal com gap: 40-60px
- Overflow: scroll horizontal (ocultar scrollbar)
- Padding: 20px 0
- Align-items: center

**Logo de Marca:**
- Width: 120-150px
- Height: auto
- Object-fit: contain
- Filter: grayscale(100%)
- Opacity: 0.6
- Cursor: pointer
- Hover: filter grayscale(0%), opacity 1
- Transition: all 0.3s ease

**Setas de Navegação:**
- Position: absolute
- Top: 50%
- Transform: translateY(-50%)
- Left: 10-20px (esquerda), Right: 10-20px (direita)
- Background: branco (#FFFFFF)
- Border-radius: 50%
- Width: 40-44px, Height: 40-44px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Cursor: pointer
- Hover: background cinza claro (#F5F5F5)

**Marcas:**
- GRAFF
- MIKIMOTO
- Outras marcas

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o carrossel de marcas
- Quando desativado, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: 5-6 logos visíveis
- Tablet: 3-4 logos visíveis
- Mobile: 2-3 logos visíveis, swipe horizontal

#### 3.2.18 Vídeo Embed (YouTube)
**Estrutura:**
- Padding: 60-80px vertical
- Background: branco (#FFFFFF)
- Max-width: 900-1000px
- Margin: 0 auto

**Player:**
- Width: 100%
- Aspect-ratio: 16/9
- Border-radius: 12-16px
- Overflow: hidden
- Box-shadow: 0 8px 16px rgba(0,0,0,0.12)

**Thumbnail:**
- Width: 100%
- Height: 100%
- Object-fit: cover

**Botão Play:**
- Position: absolute
- Top: 50%
- Left: 50%
- Transform: translate(-50%, -50%)
- Width: 80-100px
- Height: 80-100px
- Background: vermelho (#FF0000) ou laranja (#FF9800)
- Border-radius: 50%
- Display: flex, align-items: center, justify-content: center
- Cursor: pointer
- Hover: transform translate(-50%, -50%) scale(1.1)
- Transition: all 0.3s ease
- Ícone: triângulo branco (play)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o vídeo embed
- Quando desativado, a seção não é renderizada no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: largura máxima 900-1000px
- Tablet: largura 100%
- Mobile: largura 100%, altura ajustada

#### 3.2.19 Depoimentos (Cards)
**Estrutura:**
- Padding: 60-80px vertical
- Background: cinza muito claro (#FAFAFA)

**Título:**
- Text-align: center
- Font-size: 28-36px
- Font-weight: bold (700)
- Cor: preto (#000000)
- Margin-bottom: 32-40px

**Carrossel:**
- Layout: flexbox horizontal com gap: 20-24px
- Overflow: scroll horizontal (ocultar scrollbar)
- Padding: 20px 0

**Card de Depoimento:**
- Background: branco (#FFFFFF)
- Border-radius: 12-16px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 20-24px
- Width: 300-350px
- Min-width: 300px

**Header do Card:**
- Display: flex, align-items: center, gap: 12-16px
- Margin-bottom: 12-16px

**Avatar:**
- Width: 48-56px
- Height: 48-56px
- Border-radius: 50%
- Object-fit: cover

**Info do Usuário:**
- Display: flex, flex-direction: column

**Nome:**
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cor: preto (#000000)

**Data:**
- Font-size: 12-14px
- Font-weight: regular (400)
- Cor: cinza médio (#757575)

**Estrelas (Rating):**
- Display: flex, gap: 4px
- Margin-bottom: 12px
- Ícone: estrela preenchida (⭐) em laranja (#FF9800)
- Tamanho: 16-18px

**Texto do Depoimento:**
- Font-size: 13-15px
- Font-weight: regular (400)
- Cor: cinza escuro (#333333)
- Line-height: 1.5
- Max-lines: 4-5 (truncar com ellipsis)

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a seção de depoimentos
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: 3-4 cards visíveis
- Tablet: 2-3 cards visíveis
- Mobile: 1-2 cards visíveis, swipe horizontal

#### 3.2.20 Chamada Instagram
**Estrutura:**
- Padding: 40-60px vertical
- Background: branco (#FFFFFF)
- Text-align: center

**Conteúdo:**
- Display: flex, align-items: center, justify-content: center, gap: 12-16px

**Ícone do Instagram:**
- Tamanho: 28-32px
- Cor: gradiente Instagram (#E1306C, #F77737, #FCAF45)

**Texto:**
- Font-size: 16-18px
- Font-weight: medium (500)
- Cor: cinza escuro (#333333)

**@ (Chip):**
- Background: laranja (#FF9800) ou bege (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 6-8px 16-20px
- Border-radius: 20px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a chamada Instagram
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Responsividade:**
- Desktop: layout horizontal
- Mobile: layout horizontal (compacto)

#### 3.2.21 Footer: Newsletter + Rodapé

**Faixa de Newsletter:**
- Background: preto (#000000)
- Padding: 40-60px vertical, 20-40px horizontal

**Layout:**
- Display: grid de 3 colunas (título | input | botão)
- Align-items: center
- Gap: 20-30px

**Coluna Esquerda - Título:**
- Font-size: 24-32px
- Font-weight: bold (700)
- Cor: branco (#FFFFFF)
- Line-height: 1.2

**Subtítulo:**
- Font-size: 14-16px
- Font-weight: regular (400)
- Cor: cinza claro (#CCCCCC)

**Coluna Centro - Input:**
- Width: 100%
- Height: 48-52px
- Background: branco (#FFFFFF)
- Border: none
- Border-radius: 24px
- Padding: 12-16px 20-24px
- Font-size: 14-16px
- Placeholder: Digite seu e-mail

**Coluna Direita - Botão:**
- Texto: CADASTRAR
- Background: laranja (#FF9800) ou bege (#B59470)
- Cor do texto: branco (#FFFFFF)
- Padding: 14-16px 28-32px
- Border-radius: 24px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro
- Transition: all 0.3s ease

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar a faixa de newsletter
- Quando desativada, a seção não é renderizada no frontend
- Status padrão: Ativa

**Rodapé:**
- Background: preto (#000000)
- Padding: 20-30px vertical, 20-40px horizontal
- Border-top: 1px solid cinza escuro (#333333)

**Texto de Copyright:**
- Text-align: center
- Font-size: 13-15px
- Font-weight: regular (400)
- Cor: cinza claro (#CCCCCC)
- Texto: © 2026 QBLOX KIDS. Todos os direitos reservados.

**Links do Rodapé:**
- Display: flex, justify-content: center, gap: 20-30px
- Margin-top: 12-16px

**Link Individual:**
- Font-size: 13-15px
- Font-weight: regular (400)
- Cor: cinza claro (#CCCCCC)
- Text-decoration: none
- Hover: cor laranja (#FF9800)
- Transition: all 0.3s ease

**Links:**
- Política de Privacidade
- Termos de Uso
- Contato: contato@qbloxkids.com.br

**Ícones de Redes Sociais:**
- Display: flex, justify-content: center, gap: 16-20px
- Margin-top: 16-20px

**Ícone Individual:**
- Width: 32-36px
- Height: 32-36px
- Background: transparente
- Border: 1px solid cinza claro (#CCCCCC)
- Border-radius: 50%
- Display: flex, align-items: center, justify-content: center
- Cursor: pointer
- Hover: background laranja (#FF9800), border laranja
- Transition: all 0.3s ease

**Elementos Flutuantes:**

**Ícone de WhatsApp:**
- Position: fixed
- Bottom: 20-30px
- Right: 20-30px
- Background: verde (#25D366)
- Border-radius: 50%
- Width: 56-64px
- Height: 56-64px
- Display: flex, align-items: center, justify-content: center
- Box-shadow: 0 4px 12px rgba(0,0,0,0.2)
- Cursor: pointer
- Z-index: 1000
- Ícone: WhatsApp branco

**Animação Pulse:**
- Animation: pulse 2s infinite
- Keyframes:
  - 0%: transform scale(1), opacity 1
  - 50%: transform scale(1.1), opacity 0.8
  - 100%: transform scale(1), opacity 1

**Hover:**
- Transform: scale(1.15)
- Transition: all 0.3s ease

**Funcionalidade:**
- Ao clicar, abre conversa no WhatsApp com número configurado no admin
- Mensagem pré-definida configurada no admin
- Formato do link: https://wa.me/[número]?text=[mensagem]
- Visibilidade controlada por toggle no painel admin

**Ícone Voltar ao Topo:**
- Position: fixed
- Bottom: 90-100px
- Right: 20-30px
- Background: laranja (#FF9800)
- Border-radius: 50%
- Width: 44-48px
- Height: 44-48px
- Display: flex, align-items: center, justify-content: center
- Box-shadow: 0 4px 12px rgba(0,0,0,0.2)
- Cursor: pointer
- Hover: transform scale(1.1)
- Transition: all 0.3s ease
- Z-index: 1000
- Ícone: seta para cima branca
- Comportamento: scroll suave ao topo ao clicar

**Controle de Visibilidade:**
- Toggle no painel admin para ativar/desativar o botão voltar ao topo
- Quando desativado, o botão não é renderizado no frontend
- Status padrão: Ativo

**Responsividade:**
- Desktop: layout 3 colunas
- Tablet: layout 2 colunas (título acima, input e botão lado a lado)
- Mobile: layout 1 coluna (empilhado)

### 3.3 Ofertas Relâmpago
(Conteúdo mantido conforme documento original)

### 3.4 Menu Inferior Mobile (Bottom Navigation Bar)
(Conteúdo mantido conforme documento original)

### 3.5 Especificações Técnicas - Carrossel Seleção de Natal
(Conteúdo mantido conforme documento original)

### 3.6 Especificações Técnicas - Carrossel Produtos em Destaque
(Conteúdo mantido conforme documento original)

### 3.7 Especificações Técnicas - Carrossel Coleção 2026
(Conteúdo mantido conforme documento original)

### 3.8 Especificações Técnicas - Banners Promocionais de Categorias
(Conteúdo mantido conforme documento original)

### 3.9 Especificações Técnicas - Seção de Newsletter
(Conteúdo mantido conforme documento original)

### 3.10 Página de Detalhes do Produto
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

### 3.11 Funcionalidades de E-commerce
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

### 3.12 Sistema de Autenticação e Gerenciamento de Usuários
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

### 3.13 Badge de Status do Produto
(Conteúdo mantido conforme documento original)

### 3.14 Páginas Institucionais
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

### 3.15 Página Exclusiva de Ofertas Especiais
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

### 3.16 Página de Listagem de Produtos
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

## 4. Categorias de Produtos
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

## 5. Imagens de Referência
1. image.png

## 6. Estilo de Design
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

## 7. Integrações e Funcionalidades Avançadas

### 7.1 Integração com Gateway de Pagamento Asaas

**Métodos de Pagamento Disponíveis:**

A plataforma utilizará a API do Asaas para processar pagamentos, oferecendo os seguintes métodos:

1. **Cartão de Crédito (credit_card)**
   - Descrição: Pague com cartão de crédito em até 12x
   - Código API: credit_card
   - Parcelamento: até 12x sem juros
   - Bandeiras aceitas: Visa, Mastercard, Elo, American Express, Hipercard
   - Processamento: instantâneo
   - Status padrão: Ativo

2. **Cartão de Débito (debit_card)**
   - Descrição: Pague com cartão de débito
   - Código API: debit_card
   - Parcelamento: à vista
   - Bandeiras aceitas: Visa Débito, Mastercard Débito, Elo Débito
   - Processamento: instantâneo
   - Status padrão: Ativo

3. **PIX (pix)**
   - Descrição: Pagamento instantâneo via PIX
   - Código API: pix
   - Processamento: instantâneo
   - Validade do QR Code: 30 minutos
   - Status padrão: Ativo

4. **Boleto Bancário (boleto)**
   - Descrição: Pague com boleto bancário
   - Código API: boleto
   - Prazo de vencimento: 3 dias úteis
   - Processamento: até 2 dias úteis após pagamento
   - Status padrão: Ativo

5. **Dinheiro (cash)**
   - Descrição: Pagamento em dinheiro na entrega
   - Código API: cash
   - Disponível apenas para entregas locais
   - Status padrão: Inativo

**Fluxo de Pagamento no Checkout:**

**Etapa 1: Seleção do Método de Pagamento**
- Exibir todos os métodos ativos em cards visuais
- Destacar método recomendado (PIX ou Cartão de Crédito)
- Mostrar ícones das bandeiras aceitas para cartões

**Etapa 2: Preenchimento de Dados**

**Para Cartão de Crédito:**
- Número do cartão (16 dígitos)
- Nome do titular (como impresso no cartão)
- Data de validade (MM/AA)
- CVV (3 ou 4 dígitos)
- CPF do titular
- Seleção de parcelas (dropdown com valores)
- Validação em tempo real dos campos
- Máscara automática para número do cartão
- Detecção automática da bandeira

**Para Cartão de Débito:**
- Número do cartão (16 dígitos)
- Nome do titular (como impresso no cartão)
- Data de validade (MM/AA)
- CVV (3 ou 4 dígitos)
- CPF do titular
- Validação em tempo real dos campos
- Máscara automática para número do cartão
- Detecção automática da bandeira
- Observação: Pagamento à vista, sem parcelamento

**Para PIX:**
- Geração automática do QR Code
- Exibição do código PIX copia e cola
- Botão para copiar código
- Timer de validade (30 minutos)
- Instruções de pagamento
- Verificação automática de pagamento

**Para Boleto:**
- Geração automática do boleto
- Exibição do código de barras
- Botão para copiar código de barras
- Botão para baixar PDF do boleto
- Data de vencimento destacada
- Instruções de pagamento

**Para Dinheiro:**
- Confirmação do valor total
- Campo para informar se precisa de troco
- Valor do troco (se aplicável)
- Observações adicionais

**Etapa 3: Confirmação e Processamento**
- Resumo do pedido
- Método de pagamento selecionado
- Valor total
- Botão Finalizar Compra
- Loading durante processamento
- Mensagens de erro claras em caso de falha

**Segurança:**
- Tokenização de dados de cartão via Asaas
- Certificado SSL/TLS
- Validação PCI DSS
- Criptografia de dados sensíveis
- Não armazenar dados completos de cartão
- Logs de transações para auditoria

**Gerenciamento no Admin:**
- Ativar/desativar métodos de pagamento
- Configurar taxas e parcelamento
- Visualizar transações
- Gerenciar estornos
- Relatórios de pagamentos
- Configuração de credenciais Asaas (API Key)

**Notificações:**
- E-mail de confirmação de pedido
- E-mail com boleto/PIX (se aplicável)
- Notificação de pagamento aprovado
- Notificação de pagamento recusado
- Atualização de status do pedido

**Tratamento de Erros:**
- Cartão recusado: sugerir outro método
- Saldo insuficiente: informar e sugerir alternativas
- Dados inválidos: destacar campos com erro
- Timeout: permitir nova tentativa
- Erro de comunicação: mensagem clara e suporte

### 7.2 Outras Integrações
(Conteúdo mantido conforme documento original)

## 8. Painel Administrativo (Admin Panel)

### 8.1 Dashboard Principal
(Conteúdo mantido conforme documento original)

### 8.2 Gerenciamento de Produtos

**Funcionalidades:**
- Adicionar novo produto
- Editar produto existente
- Excluir produto
- Gerenciar estoque
- Definir preços e descontos
- Upload de imagens
- Categorização
- Gerenciar variações (tamanho, cor, etc.)
- Definir status (ativo/inativo)
- Gerenciar código SKU

**Campos do Formulário de Produto:**

**Informações Básicas:**
1. **Nome do Produto:**
   - Label: Nome do Produto *
   - Type: text
   - Placeholder: Ex: Boneco LEGO Super-Homem
   - Max-length: 150 caracteres
   - Validação: obrigatório

2. **Código SKU:**
   - Label: Código SKU *
   - Type: text
   - Placeholder: Ex: LEGO-SH-001
   - Max-length: 50 caracteres
   - Validação: obrigatório, único (não pode haver produtos com o mesmo SKU)
   - Helper text: Código único de identificação do produto
   - Formato sugerido: CATEGORIA-SUBCATEGORIA-NÚMERO
   - Auto-geração: botão para gerar SKU automaticamente baseado em categoria e timestamp

3. **Descrição Curta:**
   - Label: Descrição Curta *
   - Type: textarea
   - Placeholder: Breve descrição do produto
   - Rows: 2
   - Max-length: 200 caracteres
   - Validação: obrigatório

4. **Descrição Completa:**
   - Label: Descrição Completa *
   - Type: rich text editor
   - Validação: obrigatório

**Preços e Estoque:**
5. **Preço:**
   - Label: Preço *
   - Type: number
   - Placeholder: 0.00
   - Min: 0
   - Step: 0.01
   - Validação: obrigatório

6. **Preço Promocional:**
   - Label: Preço Promocional
   - Type: number
   - Placeholder: 0.00
   - Min: 0
   - Step: 0.01
   - Helper text: Deixe em branco se não houver promoção

7. **Quantidade em Estoque:**
   - Label: Quantidade em Estoque *
   - Type: number
   - Placeholder: 0
   - Min: 0
   - Validação: obrigatório

8. **Estoque Mínimo:**
   - Label: Estoque Mínimo
   - Type: number
   - Placeholder: 5
   - Min: 0
   - Helper text: Alerta quando estoque atingir este valor

**Categorização:**
9. **Categoria Principal:**
   - Label: Categoria Principal *
   - Type: select
   - Opções: Super Heróis, Roblox, Séries da TV, Aventura, Temáticos, Lançamentos, Monte sua Coleção, Ofertas Especiais
   - Validação: obrigatório

10. **Categorias Secundárias:**
    - Label: Categorias Secundárias
    - Type: multi-select
    - Opções: mesmas da categoria principal
    - Helper text: Produto pode aparecer em múltiplas categorias

**Imagens:**
11. **Imagens do Produto:**
    - Label: Imagens do Produto *
    - Type: multiple file upload
    - Formatos aceitos: JPG, PNG, WebP
    - Tamanho máximo por imagem: 2MB
    - Dimensões recomendadas: 800x800px
    - Mínimo: 1 imagem
    - Máximo: 10 imagens
    - Funcionalidade de arrastar e soltar para reordenar
    - Preview em tempo real
    - Validação: obrigatório (mínimo 1 imagem)

**Badges e Status:**
12. **Badge de Status:**
    - Label: Badge de Status
    - Type: select
    - Opções: Nenhum, Novo, Promoção, Destaque, Esgotando, Exclusivo
    - Default: Nenhum

13. **Percentual de Desconto:**
    - Label: Percentual de Desconto
    - Type: number
    - Placeholder: 0
    - Min: 0
    - Max: 100
    - Helper text: Será exibido no badge se houver preço promocional

**Envio e Dimensões:**
14. **Peso (kg):**
    - Label: Peso (kg)
    - Type: number
    - Placeholder: 0.00
    - Min: 0
    - Step: 0.01

15. **Dimensões:**
    - Comprimento (cm)
    - Largura (cm)
    - Altura (cm)
    - Type: number para cada campo
    - Min: 0

**Configurações Avançadas:**
16. **Frete Grátis:**
    - Label: Frete Grátis
    - Type: toggle switch
    - Default: desativado

17. **Entrega Rápida:**
    - Label: Entrega Rápida
    - Type: toggle switch
    - Default: desativado

18. **Status do Produto:**
    - Label: Status
    - Type: toggle switch
    - Opções: Ativo / Inativo
    - Default: Ativo

19. **Destaque na Home:**
    - Label: Exibir na Home
    - Type: toggle switch
    - Default: desativado
    - Helper text: Produto aparecerá nas seções de destaque

**SEO:**
20. **Meta Título:**
    - Label: Meta Título
    - Type: text
    - Max-length: 60 caracteres
    - Helper text: Título para mecanismos de busca

21. **Meta Descrição:**
    - Label: Meta Descrição
    - Type: textarea
    - Rows: 2
    - Max-length: 160 caracteres
    - Helper text: Descrição para mecanismos de busca

**Botões de Ação:**
- Display: flex, justify-content: flex-end, gap: 12-16px
- Margin-top: 32-40px

**Botão Cancelar:**
- Texto: Cancelar
- Background: transparente
- Border: 1px solid cinza claro (#E0E0E0)
- Cor do texto: cinza escuro (#616161)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Cursor: pointer
- Hover: background cinza muito claro (#FAFAFA)

**Botão Salvar:**
- Texto: Salvar Produto
- Background: laranja (#FF9800)
- Cor do texto: branco (#FFFFFF)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#F57C00)

**Validações:**
- Nome do produto: obrigatório, máximo 150 caracteres
- Código SKU: obrigatório, único, máximo 50 caracteres
- Descrição curta: obrigatório, máximo 200 caracteres
- Descrição completa: obrigatório
- Preço: obrigatório, maior que 0
- Quantidade em estoque: obrigatório, maior ou igual a 0
- Categoria principal: obrigatório
- Imagens: obrigatório, mínimo 1 imagem, formato válido, tamanho máximo 2MB por imagem

**Funcionalidades Especiais do SKU:**
1. **Geração Automática:**
   - Botão Gerar SKU Automaticamente ao lado do campo
   - Formato: CATEGORIA-TIMESTAMP (ex: SUPERHEROIS-20260208001)
   - Validação automática de unicidade

2. **Validação em Tempo Real:**
   - Verificar se SKU já existe ao digitar
   - Exibir mensagem de erro se SKU duplicado
   - Ícone de check verde se SKU disponível

3. **Busca por SKU:**
   - Campo de busca no topo da listagem de produtos
   - Filtro específico para buscar por código SKU
   - Busca parcial (ex: buscar LEGO retorna todos SKUs que contenham LEGO)

4. **Exibição na Listagem:**
   - Coluna SKU na tabela de produtos
   - Ordenação por SKU
   - Filtro por SKU

**Mensagens de Erro:**
- Exibidas abaixo do campo correspondente
- Cor: vermelho (#F44336)
- Font-size: 12-14px
- Exemplos:
  + Este SKU já está em uso. Por favor, escolha outro.
  + O código SKU é obrigatório.
  + O código SKU deve ter no máximo 50 caracteres.

**Mensagens de Sucesso:**
- Exibidas no topo da página
- Background: verde claro (#E8F5E9)
- Cor: verde escuro (#2E7D32)
- Padding: 12-16px
- Border-radius: 8px
- Ícone: check
- Exemplo: Produto cadastrado com sucesso! SKU: LEGO-SH-001

### 8.3 Gerenciamento de Pedidos
(Conteúdo mantido conforme documento original)

### 8.4 Gerenciamento de Usuários
(Conteúdo mantido conforme documento original)

### 8.5 Gerenciamento de Categorias
(Conteúdo mantido conforme documento original)

### 8.6 Gerenciamento de Banners Hero
**Funcionalidades:**
- Adicionar novo banner
- Editar banner existente
- Excluir banner
- Ordenar banners
- Definir período de exibição
- Upload de imagem
- Configurar link de destino

**Campos do Formulário:**
- Título do banner
- Subtítulo
- Texto do botão
- Link de destino
- Imagem
- Ordem de exibição
- Data de início
- Data de término
- Status (ativo/inativo) - toggle switch

**Seção de Mini Banners Promocionais:**
**Posicionamento no Admin:**
- Localizada dentro da seção Banner Hero
- Inserida imediatamente abaixo da gestão de full banners
- Separada visualmente por um divisor ou título de subseção

**Título da Subseção:**
- Texto: Mini Banners Promocionais
- Font-size: 20-24px
- Font-weight: semibold (600)
- Cor: preto (#000000)
- Margin-top: 40-50px
- Margin-bottom: 20-24px

**Descrição:**
- Font-size: 14-16px
- Cor: cinza médio (#757575)
- Margin-bottom: 24-32px
- Texto: Gerencie os 2 mini banners promocionais que aparecem após a seção Os Mais Vendidos na página inicial

**Botão Adicionar Mini Banner:**
- Texto: + Novo Mini Banner
- Background: laranja (#FF9800)
- Cor do texto: branco (#FFFFFF)
- Padding: 10-12px 20-24px
- Border-radius: 8px
- Font-size: 14-16px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#F57C00)
- Margin-bottom: 20-24px

**Listagem de Mini Banners:**
- Layout: grid de 2 colunas
- Gap: 20-24px
- Exibir no máximo 2 mini banners

**Card de Mini Banner:**
- Background: branco (#FFFFFF)
- Border: 1px solid cinza claro (#E0E0E0)
- Border-radius: 12px
- Padding: 16-20px
- Box-shadow: 0 2px 4px rgba(0,0,0,0.06)

**Preview do Mini Banner:**
- Width: 100%
- Height: 120-150px
- Border-radius: 8px
- Overflow: hidden
- Margin-bottom: 12-16px
- Background: cinza muito claro (#F5F5F5)
- Display: flex, align-items: center
- Cursor: pointer

**Informações do Mini Banner:**
- Display: flex, flex-direction: column, gap: 8px

**Título:**
- Font-size: 15-17px
- Font-weight: semibold (600)
- Cor: preto (#000000)
- Max-lines: 1 (truncar com ellipsis)

**Status:**
- Display: inline-flex
- Padding: 4-6px 10-12px
- Border-radius: 12px
- Font-size: 12-14px
- Font-weight: medium (500)
- Ativo: background verde claro (#E8F5E9), cor verde escuro (#2E7D32)
- Inativo: background cinza claro (#F5F5F5), cor cinza escuro (#616161)

**Período de Exibição:**
- Font-size: 12-14px
- Cor: cinza médio (#757575)
- Formato: DD/MM/YYYY - DD/MM/YYYY ou Sem data de término

**Botões de Ação:**
- Display: flex, gap: 8-12px
- Margin-top: 12-16px

**Botão Editar:**
- Texto: Editar
- Background: azul (#2196F3)
- Cor do texto: branco (#FFFFFF)
- Padding: 8-10px 16-20px
- Border-radius: 6px
- Font-size: 13-15px
- Cursor: pointer
- Hover: background azul escuro (#1976D2)

**Botão Excluir:**
- Texto: Excluir
- Background: vermelho (#F44336)
- Cor do texto: branco (#FFFFFF)
- Padding: 8-10px 16-20px
- Border-radius: 6px
- Font-size: 13-15px
- Cursor: pointer
- Hover: background vermelho escuro (#D32F2F)

**Botão Duplicar:**
- Texto: Duplicar
- Background: cinza (#757575)
- Cor do texto: branco (#FFFFFF)
- Padding: 8-10px 16-20px
- Border-radius: 6px
- Font-size: 13-15px
- Cursor: pointer
- Hover: background cinza escuro (#616161)

**Formulário de Criação/Edição de Mini Banner:**
**Estrutura:**
- Layout: formulário em grid
- Padding: 30-40px
- Background: branco (#FFFFFF)
- Border-radius: 12px
- Box-shadow: 0 2px 8px rgba(0,0,0,0.08)
- Max-width: 800-900px

**Título do Formulário:**
- Texto: Novo Mini Banner / Editar Mini Banner
- Font-size: 24-28px
- Font-weight: bold (700)
- Margin-bottom: 24-32px

**Campos do Formulário:**

1. **Título do Banner:**
   - Label: Título *
   - Type: text
   - Placeholder: Ex: Seleção de Brinquedos com até 30% OFF
   - Max-length: 100 caracteres
   - Validação: obrigatório

2. **Etiqueta (opcional):**
   - Label: Etiqueta
   - Type: text
   - Placeholder: Ex: Em até 10x sem juros
   - Max-length: 50 caracteres
   - Helper text: Texto pequeno que aparece acima do título

3. **Descrição (opcional):**
   - Label: Descrição
   - Type: textarea
   - Placeholder: Ex: Aproveite descontos incríveis em produtos selecionados
   - Rows: 2
   - Max-length: 150 caracteres
   - Helper text: Texto adicional que aparece abaixo do título

4. **Texto do Botão:**
   - Label: Texto do Botão *
   - Type: text
   - Placeholder: Ex: VER OFERTAS
   - Max-length: 30 caracteres
   - Validação: obrigatório

5. **Link de Destino:**
   - Label: Link de Destino *
   - Type: text
   - Placeholder: Ex: /categoria/ofertas
   - Validação: obrigatório, formato de URL

6. **Upload de Imagem:**
   - Label: Imagem do Banner *
   - Type: file upload
   - Formatos aceitos: JPG, PNG, WebP
   - Tamanho máximo: 2MB
   - Dimensões recomendadas: 800x400px
   - Preview em tempo real
   - Validação: obrigatório

7. **Configurações de Cores:**
   - **Cor de Fundo do Texto:**
     + Label: Cor de Fundo do Texto
     + Type: color picker
     + Default: #FF0000 (vermelho)
   
   - **Cor do Título:**
     + Label: Cor do Título
     + Type: color picker
     + Default: #FFFFFF (branco)
   
   - **Cor da Descrição:**
     + Label: Cor da Descrição
     + Type: color picker
     + Default: #FFFFFF (branco)
   
   - **Cor de Fundo do Botão:**
     + Label: Cor de Fundo do Botão
     + Type: color picker
     + Default: #FFFFFF (branco)
   
   - **Cor do Texto do Botão:**
     + Label: Cor do Texto do Botão
     + Type: color picker
     + Default: #000000 (preto)

8. **Ordem de Exibição:**
   - Label: Ordem de Exibição *
   - Type: select
   - Opções: 1 (Esquerda) / 2 (Direita)
   - Validação: obrigatório

9. **Status:**
   - Label: Status
   - Type: toggle switch
   - Opções: Ativo / Inativo
   - Default: Ativo

10. **Período de Exibição:**
    - **Data de Início:**
      + Label: Data de Início
      + Type: date picker
      + Helper text: Deixe em branco para exibir imediatamente
    
    - **Data de Término:**
      + Label: Data de Término
      + Type: date picker
      + Helper text: Deixe em branco para exibição contínua

**Preview em Tempo Real:**
- Exibir preview do mini banner conforme configurações
- Atualizar preview ao alterar qualquer campo
- Mostrar como aparecerá no site

**Botões de Ação:**
- Display: flex, justify-content: flex-end, gap: 12-16px
- Margin-top: 32-40px

**Botão Cancelar:**
- Texto: Cancelar
- Background: transparente
- Border: 1px solid cinza claro (#E0E0E0)
- Cor do texto: cinza escuro (#616161)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Cursor: pointer
- Hover: background cinza muito claro (#FAFAFA)

**Botão Salvar:**
- Texto: Salvar Mini Banner
- Background: laranja (#FF9800)
- Cor do texto: branco (#FFFFFF)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#F57C00)

**Validações:**
- Título: obrigatório, máximo 100 caracteres
- Texto do botão: obrigatório, máximo 30 caracteres
- Link de destino: obrigatório, formato de URL válido
- Imagem: obrigatória, formato válido, tamanho máximo 2MB
- Ordem de exibição: obrigatória, deve ser 1 ou 2
- Limite: máximo 2 mini banners ativos simultaneamente

**Mensagens de Erro:**
- Exibidas abaixo do campo correspondente
- Cor: vermelho (#F44336)
- Font-size: 12-14px

**Mensagens de Sucesso:**
- Exibidas no topo da página
- Background: verde claro (#E8F5E9)
- Cor: verde escuro (#2E7D32)
- Padding: 12-16px
- Border-radius: 8px
- Ícone: check

**Responsividade:**
- Desktop: layout completo
- Tablet: layout adaptado
- Mobile: campos em coluna única

### 8.7 Gerenciamento de Seções Home

**Funcionalidades:**
- Ativar/desativar seções da página inicial
- Reordenar seções
- Configurar conteúdo de cada seção

**Estrutura da Página:**
- Título: Gerenciar Seções da Home
- Subtítulo: Ative ou desative seções e configure a ordem de exibição
- Layout: lista de cards com drag-and-drop

**Card de Seção:**
- Background: branco (#FFFFFF)
- Border: 1px solid cinza claro (#E0E0E0)
- Border-radius: 12px
- Padding: 20-24px
- Margin-bottom: 16-20px
- Cursor: move (para drag-and-drop)

**Informações do Card:**
1. **Ícone de Arrastar:**
   - Position: absolute, left: 12px
   - Ícone: 6 pontos (⋮⋮)
   - Cor: cinza médio (#757575)
   - Cursor: move

2. **Nome da Seção:**
   - Font-size: 18-20px
   - Font-weight: semibold (600)
   - Cor: preto (#000000)

3. **Descrição:**
   - Font-size: 13-15px
   - Cor: cinza médio (#757575)
   - Margin-top: 4-6px

4. **Toggle de Status:**
   - Position: absolute, right: 12px
   - Type: toggle switch
   - Ativo: verde (#4CAF50)
   - Inativo: cinza (#9E9E9E)
   - Label: Ativo / Inativo

5. **Botão Configurar:**
   - Texto: Configurar
   - Background: azul (#2196F3)
   - Cor do texto: branco (#FFFFFF)
   - Padding: 8-10px 16-20px
   - Border-radius: 6px
   - Font-size: 13-15px
   - Cursor: pointer
   - Hover: background azul escuro (#1976D2)
   - Margin-top: 12-16px

**Lista de Seções Gerenciáveis:**
1. Barra Superior (Top Strip)
2. Menu de Navegação
3. Banner Hero (Carrossel)
4. Faixa de Benefícios
5. Cards de Destaque
6. Compre por Categoria
7. Novidades da Semana (Grid)
8. Faixa de Banners Grandes
9. Categorias em Destaque
10. Novidades da Semana (Carrossel)
11. Monte Sua Coleção
12. Nossos Queridinhos
13. Mini Banners Promocionais
14. Banners Horizontais
15. Nossos Destaques
16. Seção Institucional
17. Escolha por Marcas
18. Vídeo Embed
19. Depoimentos
20. Chamada Instagram
21. Newsletter
22. Botão Voltar ao Topo

**Funcionalidades:**
- Drag-and-drop para reordenar seções
- Toggle para ativar/desativar cada seção
- Botão Configurar para acessar configurações específicas de cada seção
- Salvar automaticamente ao alterar status ou ordem
- Preview em tempo real das alterações

**Botões de Ação:**
- Display: flex, justify-content: flex-end, gap: 12-16px
- Margin-top: 32-40px

**Botão Restaurar Padrão:**
- Texto: Restaurar Padrão
- Background: transparente
- Border: 1px solid cinza claro (#E0E0E0)
- Cor do texto: cinza escuro (#616161)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Cursor: pointer
- Hover: background cinza muito claro (#FAFAFA)

**Botão Salvar Alterações:**
- Texto: Salvar Alterações
- Background: laranja (#FF9800)
- Cor do texto: branco (#FFFFFF)
- Padding: 12-14px 24-28px
- Border-radius: 8px
- Font-weight: semibold (600)
- Cursor: pointer
- Hover: background mais escuro (#F57C00)

**Mensagens de Sucesso:**
- Exibidas no topo da página
- Background: verde claro (#E8F5E9)
- Cor: verde escuro (#2E7D32)
- Padding: 12-16px
- Border-radius: 8px
- Ícone: check
- Exemplo: Configurações salvas com sucesso!

### 8.8 Gerenciamento de Blog
(Conteúdo mantido conforme documento original)

### 8.9 Gerenciamento de Pagamentos

**Funcionalidades:**
- Configurar métodos de pagamento
- Ativar/desativar métodos
- Configurar credenciais Asaas
- Definir taxas e parcelamento
- Visualizar transações
- Gerenciar estornos
- Relatórios de pagamentos

**Configuração de Métodos de Pagamento:**

**Estrutura da Página:**
- Título: Métodos de Pagamento
- Subtítulo: Métodos de pagamento disponíveis na plataforma
- Layout: lista de cards

**Card de Método de Pagamento:**
- Background: branco (#FFFFFF)
- Border: 1px solid cinza claro (#E0E0E0)
- Border-radius: 12px
- Padding: 20-24px
- Margin-bottom: 16-20px

**Informações do Card:**
1. **Nome do Método:**
   - Font-size: 18-20px
   - Font-weight: semibold (600)
   - Cor: preto (#000000)

2. **Código API:**
   - Font-size: 13-15px
   - Font-weight: regular (400)
   - Cor: cinza médio (#757575)
   - Background: cinza muito claro (#F5F5F5)
   - Padding: 4-6px 10-12px
   - Border-radius: 6px
   - Font-family: monospace

3. **Descrição:**
   - Font-size: 14-16px
   - Font-weight: regular (400)
   - Cor: cinza escuro (#333333)
   - Margin-top: 8-12px

4. **Status:**
   - Toggle switch
   - Ativo: verde (#4CAF50)
   - Inativo: cinza (#9E9E9E)
   - Label: Ativo / Inativo

5. **Botão Configurar:**
   - Texto: Configurar
   - Background: azul (#2196F3)
   - Cor do texto: branco (#FFFFFF)
   - Padding: 8-10px 16-20px
   - Border-radius: 6px
   - Cursor: pointer
   - Hover: background azul escuro (#1976D2)

**Configurações Específicas por Método:**

**Cartão de Crédito:**
- Parcelamento máximo (1-12x)
- Juros por parcela (%)
- Parcelas sem juros (1-12x)
- Bandeiras aceitas (multi-select)
- Taxa de processamento (%)

**Cartão de Débito:**
- Bandeiras aceitas (multi-select)
- Taxa de processamento (%)

**PIX:**
- Validade do QR Code (minutos)
- Desconto para pagamento via PIX (%)
- Taxa de processamento (%)

**Boleto:**
- Prazo de vencimento (dias)
- Juros por dia de atraso (%)
- Multa por atraso (%)
- Taxa de processamento (R$)

**Dinheiro:**
- Disponível apenas para entregas locais (toggle)
- Raio de entrega (km)
- Taxa de entrega (R$)

**Configuração de Credenciais Asaas:**
- API Key (campo de texto, tipo password)
- Ambiente (select: Sandbox / Produção)
- Webhook URL (gerada automaticamente)
- Botão Testar Conexão
- Status da conexão (conectado/desconectado)

**Visualização de Transações:**
- Tabela com colunas:
  + ID da Transação
  + Data/Hora
  + Cliente
  + Método de Pagamento
  + Valor
  + Status (Pendente/Aprovado/Recusado/Estornado)
  + Ações (Ver Detalhes/Estornar)
- Filtros:
  + Período (data início - data fim)
  + Método de pagamento
  + Status
  + Cliente (busca por nome/e-mail)
- Paginação
- Exportar para CSV/Excel

**Gerenciamento de Estornos:**
- Botão Solicitar Estorno
- Modal de confirmação
- Campos:
  + Motivo do estorno (select)
  + Observações (textarea)
  + Valor a estornar (se parcial)
- Histórico de estornos
- Status do estorno (Solicitado/Processando/Concluído/Recusado)

**Relatórios de Pagamentos:**
- Período selecionável
- Métricas:
  + Total de transações
  + Valor total processado
  + Taxa de aprovação (%)
  + Valor médio por transação
  + Distribuição por método de pagamento (gráfico de pizza)
  + Evolução de vendas (gráfico de linha)
- Exportar relatório (PDF/Excel)

### 8.10 Relatórios e Análises
(Conteúdo mantido conforme documento original)

### 8.11 Configurações Gerais
(Conteúdo mantido conforme documento original)

### 8.12 Configurações de Botão de WhatsApp
(Conteúdo mantido conforme documento original)

### 8.13 Gerenciamento de Cupons de Desconto
(Conteúdo mantido conforme documento original, incluindo todas as subseções)

## 9. Referências de Integração
(Conteúdo mantido conforme documento original)

## 10. SEO para E-commerce - Implementação Completa

### 10.1 FASE 2 — ON-PAGE SEO (Semanas 2-6)

#### 10.1.1 Title Tags Otimizadas para Cada Página

**Estrutura Geral:**
- Formato: [Keyword Principal] | [Diferencial/Benefício] | [Nome da Marca]
- Comprimento: 50-60 caracteres
- Incluir keyword principal no início
- Incluir diferencial competitivo
- Incluir nome da marca no final

**Exemplos por Tipo de Página:**

**Homepage:**
- Title: Bonecos de Montar | Blocos Tipo LEGO com Frete Grátis | QBlox
- Comprimento: 60 caracteres
- Keywords: bonecos de montar, blocos tipo LEGO, frete grátis

**Categoria Ninjago:**
- Title: Bonecos de Montar Ninjago | Coleção NinjaBlox | QBlox
- Comprimento: 56 caracteres
- Keywords: bonecos de montar ninjago, coleção ninjablox

**Produto NinjaBlox Smoken:**
- Title: Boneco de Montar NinjaBlox Smoken | R$14,90 | QBlox
- Comprimento: 53 caracteres
- Keywords: boneco de montar ninjablox smoken, preço

**Outras Categorias:**

**Super Heróis:**
- Title: Bonecos de Montar Super Heróis | Marvel e DC | QBlox
- Comprimento: 56 caracteres

**Roblox:**
- Title: Bonecos de Montar Roblox | Personagens Oficiais | QBlox
- Comprimento: 59 caracteres

**Séries da TV:**
- Title: Bonecos de Montar Séries TV | Personagens Favoritos | QBlox
- Comprimento: 60 caracteres

**Aventura:**
- Title: Bonecos de Montar Aventura | Exploradores e Heróis | QBlox
- Comprimento: 60 caracteres

**Temáticos:**
- Title: Bonecos de Montar Temáticos | Coleções Especiais | QBlox
- Comprimento: 59 caracteres

**Lançamentos:**
- Title: Lançamentos Bonecos de Montar | Novidades 2026 | QBlox
- Comprimento: 58 caracteres

**Monte sua Coleção:**
- Title: Monte sua Coleção | Bonecos de Montar Personalizados | QBlox
- Comprimento: 60 caracteres

**Ofertas Especiais:**
- Title: Ofertas Bonecos de Montar | Até 65% OFF | QBlox
- Comprimento: 52 caracteres

**Páginas Institucionais:**

**Sobre Nós:**
- Title: Sobre a QBlox | Loja de Bonecos de Montar Tipo LEGO
- Comprimento: 54 caracteres

**Contato:**
- Title: Contato QBlox | Atendimento e Suporte | Bonecos de Montar
- Comprimento: 60 caracteres

**Política de Privacidade:**
- Title: Política de Privacidade | QBlox Bonecos de Montar
- Comprimento: 51 caracteres

**Termos de Uso:**
- Title: Termos de Uso | QBlox Bonecos de Montar
- Comprimento: 43 caracteres

**Política de Troca e Devolução:**
- Title: Troca e Devolução | Garantia QBlox | Bonecos de Montar
- Comprimento: 58 caracteres

**Regras de Implementação:**
1. Title tag deve ser único para cada página
2. Incluir keyword principal no início
3. Incluir preço em páginas de produto
4. Incluir diferencial competitivo (frete grátis, desconto, etc.)
5. Incluir nome da marca no final
6. Não ultrapassar 60 caracteres
7. Evitar keyword stuffing
8. Usar separador | (pipe) entre elementos

**Gerenciamento no Admin:**
- Campo editável de Title Tag ao criar/editar produtos e categorias
- Contador de caracteres em tempo real
- Sugestão automática baseada em nome do produto/categoria
- Preview de como aparecerá no Google
- Validação de comprimento (máximo 60 caracteres)
- Alerta se title tag duplicado

#### 10.1.2 Meta Descriptions Únicas para Cada Página

**Estrutura Geral:**
- Comprimento: 150-160 caracteres
- Incluir keyword principal
- Incluir preço (para produtos)
- Incluir diferencial competitivo
- Incluir call-to-action

**Exemplos por Tipo de Página:**

**Homepage:**
- Meta Description: Compre bonecos de montar tipo LEGO na QBlox. Frete grátis acima de R$99. Parcele em até 12x sem juros. Entrega rápida para todo Brasil. Confira!
- Comprimento: 156 caracteres

**Categoria Ninjago:**
- Meta Description: Bonecos de montar Ninjago compatíveis com LEGO. Coleção completa NinjaBlox a partir de R$14,90. Frete grátis acima de R$99. Compre agora!
- Comprimento: 150 caracteres

**Produto NinjaBlox Smoken:**
- Meta Description: Boneco de montar NinjaBlox Smoken por R$14,90. Compatível com blocos tipo LEGO. Frete grátis acima de R$99. Parcele em até 12x. Compre já!
- Comprimento: 152 caracteres

**Outras Categorias:**

**Super Heróis:**
- Meta Description: Bonecos de montar Super Heróis Marvel e DC. Compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Parcele em até 12x!
- Comprimento: 150 caracteres

**Roblox:**
- Meta Description: Bonecos de montar Roblox oficiais. Personagens favoritos compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Confira!
- Comprimento: 148 caracteres

**Séries da TV:**
- Meta Description: Bonecos de montar de séries de TV. Personagens favoritos compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Compre!
- Comprimento: 150 caracteres

**Aventura:**
- Meta Description: Bonecos de montar Aventura. Exploradores e heróis compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Parcele em 12x!
- Comprimento: 150 caracteres

**Temáticos:**
- Meta Description: Bonecos de montar temáticos. Coleções especiais compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Compre agora!
- Comprimento: 148 caracteres

**Lançamentos:**
- Meta Description: Lançamentos 2026 de bonecos de montar. Novidades compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Confira já!
- Comprimento: 147 caracteres

**Monte sua Coleção:**
- Meta Description: Monte sua coleção de bonecos personalizados. Compatíveis com LEGO. A partir de R$14,90. Frete grátis acima de R$99. Parcele em 12x!
- Comprimento: 148 caracteres

**Ofertas Especiais:**
- Meta Description: Ofertas de bonecos de montar com até 65% OFF. Compatíveis com LEGO. Frete grátis acima de R$99. Parcele em até 12x. Aproveite!
- Comprimento: 148 caracteres

**Páginas Institucionais:**

**Sobre Nós:**
- Meta Description: Conheça a QBlox, loja especializada em bonecos de montar tipo LEGO. Qualidade, variedade e os melhores preços. Frete grátis acima de R$99.
- Comprimento: 150 caracteres

**Contato:**
- Meta Description: Entre em contato com a QBlox. Atendimento online, suporte especializado e dúvidas sobre bonecos de montar. Estamos aqui para ajudar!
- Comprimento: 148 caracteres

**Política de Privacidade:**
- Meta Description: Política de privacidade da QBlox. Saiba como protegemos seus dados pessoais e garantimos a segurança das suas informações. Leia mais.
- Comprimento: 150 caracteres

**Termos de Uso:**
- Meta Description: Termos de uso da QBlox. Conheça as regras e condições para compra de bonecos de montar em nossa loja online. Leia os termos completos.
- Comprimento: 150 caracteres

**Política de Troca e Devolução:**
- Meta Description: Política de troca e devolução da QBlox. Garantia de satisfação em bonecos de montar. Processo simples e rápido. Confira as condições.
- Comprimento: 150 caracteres

**Regras de Implementação:**
1. Meta description deve ser única para cada página
2. Incluir keyword principal naturalmente
3. Incluir preço em páginas de produto
4. Incluir diferencial competitivo (frete grátis, parcelamento, desconto)
5. Incluir call-to-action (Compre agora, Confira, Aproveite)
6. Comprimento entre 150-160 caracteres
7. Evitar keyword stuffing
8. Usar linguagem persuasiva e clara

**Gerenciamento no Admin:**
- Campo editável de Meta Description ao criar/editar produtos e categorias
- Contador de caracteres em tempo real
- Sugestão automática baseada em descrição do produto/categoria
- Preview de como aparecerá no Google
- Validação de comprimento (150-160 caracteres)
- Alerta se meta description duplicada
- Destaque de keywords no preview

#### 10.1.3 Heading Structure (H1-H6)

**Princípios Gerais:**
- Cada página deve ter apenas um H1
- H1 deve conter a keyword principal
- H2 organiza seções principais da página
- H3 detalha sub-itens dentro de H2
- H4-H6 para hierarquias mais profundas (raramente necessário)
- Estrutura lógica e hierárquica

**Estrutura por Tipo de Página:**

**Homepage:**
```
H1: Bonecos de Montar Tipo LEGO | QBlox
  H2: Categorias em Destaque
    H3: Super Heróis
    H3: Roblox
    H3: Séries da TV
  H2: Novidades da Semana
  H2: Ofertas Especiais
  H2: Monte Sua Coleção
  H2: Por Que Comprar na QBlox?
    H3: Frete Grátis
    H3: Parcele em até 12x
    H3: Loja 100% Segura
```

**Página de Categoria (Exemplo: Ninjago):**
```
H1: Bonecos de Montar Ninjago | Coleção NinjaBlox
  H2: Sobre a Coleção Ninjago
  H2: Produtos em Destaque
  H2: Filtrar por
    H3: Preço
    H3: Personagem
    H3: Disponibilidade
  H2: Por Que Escolher Bonecos Ninjago?
    H3: Compatibilidade com LEGO
    H3: Qualidade Premium
    H3: Personagens Autênticos
```

**Página de Produto (Exemplo: NinjaBlox Smoken):**
```
H1: Boneco de Montar NinjaBlox Smoken
  H2: Descrição do Produto
  H2: Especificações Técnicas
    H3: Material
    H3: Dimensões
    H3: Idade Recomendada
    H3: Compatibilidade
  H2: O Que Está Incluído
  H2: Avaliações de Clientes
  H2: Produtos Relacionados
  H2: Perguntas Frequentes
    H3: É compatível com LEGO?
    H3: Qual a idade recomendada?
    H3: Qual o prazo de entrega?
```

**Página Sobre Nós:**
```
H1: Sobre a QBlox | Loja de Bonecos de Montar
  H2: Nossa História
  H2: Nossa Missão
  H2: Nossos Valores
  H2: Por Que Escolher a QBlox?
    H3: Qualidade Garantida
    H3: Variedade de Produtos
    H3: Atendimento Especializado
  H2: Nossa Equipe
```

**Página de Contato:**
```
H1: Entre em Contato com a QBlox
  H2: Formulário de Contato
  H2: Outras Formas de Contato
    H3: WhatsApp
    H3: E-mail
    H3: Telefone
  H2: Horário de Atendimento
  H2: Perguntas Frequentes
```

**Regras de Implementação:**
1. Apenas um H1 por página
2. H1 deve ser o título principal e conter keyword principal
3. H2 para seções principais
4. H3 para sub-seções dentro de H2
5. Não pular níveis (ex: H2 direto para H4)
6. Usar keywords naturalmente nos headings
7. Headings devem ser descritivos e claros
8. Manter hierarquia lógica

**Gerenciamento no Admin:**
- Campo editável de H1 ao criar/editar produtos e categorias
- Sugestão automática de H1 baseada em nome do produto/categoria
- Preview da estrutura de headings
- Validação de hierarquia (alertar se pular níveis)
- Contador de H1 (alertar se mais de um)
- Destaque de keywords nos headings

#### 10.1.4 Descrições de Produto Ricas

**Estrutura Geral:**
- Mínimo: 200-300 palavras
- Incluir keywords naturalmente
- Dividir em seções com H2/H3
- Usar listas e bullet points
- Incluir informações técnicas
- Incluir benefícios e diferenciais

**Elementos Obrigatórios:**
1. Descrição do personagem/tema
2. Material e dimensões
3. Compatibilidade com blocos (compatível com blocos de montar tipo LEGO)
4. Idade recomendada
5. O que está incluído no kit
6. Keywords naturais

**Exemplo de Descrição Completa (NinjaBlox Smoken):**

```
H2: Descrição do Produto

O Boneco de Montar NinjaBlox Smoken é perfeito para fãs de Ninjago que adoram construir e colecionar. Este boneco de montar traz o icônico personagem Smoken, conhecido por suas habilidades ninja e visual marcante. Compatível com blocos de montar tipo LEGO, o NinjaBlox Smoken permite criar aventuras épicas e expandir sua coleção de bonecos de montar.

Feito com material plástico ABS de alta qualidade, este boneco de montar garante durabilidade e segurança durante as brincadeiras. As peças se encaixam perfeitamente, proporcionando uma experiência de montagem satisfatória para crianças e adultos.

H2: Especificações Técnicas

H3: Material
- Plástico ABS de alta qualidade
- Livre de substâncias tóxicas
- Durável e resistente

H3: Dimensões
- Altura do boneco montado: 8 cm
- Largura: 4 cm
- Profundidade: 2 cm
- Peso: 25g

H3: Compatibilidade
- Compatível com blocos de montar tipo LEGO
- Compatível com outros bonecos da linha NinjaBlox
- Encaixe perfeito e seguro

H3: Idade Recomendada
- A partir de 6 anos
- Ideal para crianças e colecionadores
- Peças pequenas - não recomendado para menores de 3 anos

H2: O Que Está Incluído no Kit

- 1 boneco NinjaBlox Smoken
- Acessórios: espada ninja, shuriken
- Manual de instruções ilustrado
- Embalagem original lacrada

H2: Por Que Escolher o NinjaBlox Smoken?

- Personagem autêntico da série Ninjago
- Compatível com blocos de montar tipo LEGO
- Material de alta qualidade e durável
- Perfeito para colecionar e brincar
- Estimula criatividade e coordenação motora
- Preço acessível: R$14,90
- Frete grátis acima de R$99
- Parcele em até 12x sem juros

H2: Dicas de Uso

- Combine com outros bonecos NinjaBlox para criar cenas épicas
- Use blocos de montar tipo LEGO para construir cenários
- Ideal para presentear fãs de Ninjago
- Perfeito para colecionadores de bonecos de montar

H2: Garantia e Segurança

- Produto original e lacrado
- Garantia de 30 dias contra defeitos de fabricação
- Certificado de segurança INMETRO
- Loja 100% segura e confiável
```

**Comprimento:** Aproximadamente 350 palavras

**Keywords Incluídas:**
- boneco de montar
- NinjaBlox Smoken
- compatível com blocos de montar tipo LEGO
- bonecos de montar
- Ninjago
- material de alta qualidade
- idade recomendada
- frete grátis
- parcele em até 12x

**Regras de Implementação:**
1. Mínimo de 200-300 palavras
2. Dividir em seções com H2/H3
3. Incluir todos os elementos obrigatórios
4. Usar keywords naturalmente (densidade 1-2%)
5. Incluir informações técnicas detalhadas
6. Incluir benefícios e diferenciais
7. Usar listas e bullet points
8. Incluir call-to-action
9. Mencionar compatibilidade com LEGO
10. Incluir preço e condições de pagamento

**Gerenciamento no Admin:**
- Editor de texto rico (WYSIWYG) para descrições
- Contador de palavras em tempo real
- Sugestão de estrutura de headings
- Checklist de elementos obrigatórios
- Análise de densidade de keywords
- Preview de como aparecerá no site
- Templates pré-definidos por categoria
- Validação de comprimento mínimo (200 palavras)

#### 10.1.5 Otimização de Imagens

**Elementos de Otimização:**
1. Alt text descritivo
2. Nomes de arquivo descritivos
3. Compressão WebP
4. Lazy loading
5. Dimensões adequadas
6. Title attribute (opcional)

**Alt Text:**

**Estrutura:**
- Formato: [Tipo de produto] [Nome do produto] - [Característica adicional]
- Incluir keyword principal
- Ser descritivo e específico
- Máximo 125 caracteres

**Exemplos:**

**Produto NinjaBlox Smoken:**
- Imagem principal: Boneco de montar NinjaBlox Smoken - bloco tipo LEGO ninjago
- Imagem 2: Boneco NinjaBlox Smoken com acessórios - espada e shuriken
- Imagem 3: Boneco NinjaBlox Smoken vista lateral - compatível com LEGO
- Imagem 4: Boneco NinjaBlox Smoken embalagem original lacrada

**Categoria Ninjago:**
- Banner: Coleção bonecos de montar Ninjago - compatíveis com LEGO
- Card 1: Boneco de montar NinjaBlox Kai - personagem vermelho
- Card 2: Boneco de montar NinjaBlox Jay - personagem azul

**Homepage:**
- Hero banner: Bonecos de montar tipo LEGO - frete grátis acima de R$99
- Categoria Super Heróis: Bonecos de montar super heróis Marvel e DC
- Categoria Roblox: Bonecos de montar Roblox - personagens oficiais

**Nomes de Arquivo:**

**Estrutura:**
- Formato: [categoria]-[produto]-[variacao].webp
- Usar apenas letras minúsculas
- Separar palavras com hífen (-)
- Incluir keyword principal
- Evitar caracteres especiais

**Exemplos:**

**Correto:**
- boneco-montar-ninjablox-smoken-principal.webp
- boneco-montar-ninjablox-smoken-acessorios.webp
- boneco-montar-ninjablox-smoken-lateral.webp
- boneco-montar-ninjablox-smoken-embalagem.webp

**Incorreto:**
- image-001.jpg
- IMG_20260208_123456.jpg
- produto_foto.png
- DSC_0001.jpg

**Compressão WebP:**

**Especificações:**
- Formato: WebP
- Qualidade: 80-85%
- Tamanho máximo: 200KB por imagem
- Dimensões recomendadas:
  + Produto principal: 800x800px
  + Produto galeria: 800x800px
  + Thumbnail: 300x300px
  + Banner hero: 1920x600px
  + Banner categoria: 1200x400px

**Lazy Loading:**

**Implementação:**
- Atributo loading=lazy em todas as imagens
- Exceção: imagens above the fold (hero banner, logo)
- Placeholder com cor de fundo enquanto carrega
- Transição suave ao carregar

**Exemplo de Código:**
```html
<img 
  src=boneco-montar-ninjablox-smoken-principal.webp
  alt=Boneco de montar NinjaBlox Smoken - bloco tipo LEGO ninjago
  title=Boneco NinjaBlox Smoken - R$14,90
  width=800
  height=800
  loading=lazy
/>
```

**Title Attribute (Opcional):**

**Estrutura:**
- Formato: [Nome do produto] - [Preço]
- Incluir preço para produtos
- Incluir call-to-action para banners

**Exemplos:**
- Produto: Boneco NinjaBlox Smoken - R$14,90
- Banner: Frete grátis acima de R$99 - Compre agora
- Categoria: Coleção Ninjago - Veja todos os produtos

**Regras de Implementação:**
1. Todas as imagens devem ter alt text descritivo
2. Nomes de arquivo devem ser descritivos e incluir keywords
3. Usar formato WebP com compressão 80-85%
4. Implementar lazy loading em todas as imagens (exceto above the fold)
5. Dimensões adequadas para cada tipo de imagem
6. Tamanho máximo de 200KB por imagem
7. Title attribute opcional mas recomendado
8. Incluir width e height para evitar layout shift

**Gerenciamento no Admin:**
- Upload de imagens com conversão automática para WebP
- Compressão automática ao fazer upload
- Campo editável de alt text para cada imagem
- Sugestão automática de alt text baseada em nome do produto
- Campo editável de nome de arquivo
- Sugestão automática de nome de arquivo
- Preview de alt text e nome de arquivo
- Validação de tamanho máximo (200KB)
- Validação de dimensões recomendadas
- Alerta se alt text vazio ou genérico
- Ferramenta de edição de imagens (crop, resize)
- Opção de adicionar title attribute

### 10.2 FASE 3 — DADOS ESTRUTURADOS (Semanas 3-6)

#### 10.2.1 Schema.org Product em Todas as Páginas de Produto

**Estrutura Completa:**

```json
{
  @context: https://schema.org/,
  @type: Product,
  name: Boneco de Montar NinjaBlox Smoken,
  description: Boneco de montar NinjaBlox Smoken compatível com blocos tipo LEGO. Personagem autêntico da série Ninjago com acessórios. Material de alta qualidade, ideal para crianças a partir de 6 anos.,
  image: [
    https://qblox.com.br/images/boneco-montar-ninjablox-smoken-principal.webp,
    https://qblox.com.br/images/boneco-montar-ninjablox-smoken-acessorios.webp,
    https://qblox.com.br/images/boneco-montar-ninjablox-smoken-lateral.webp,
    https://qblox.com.br/images/boneco-montar-ninjablox-smoken-embalagem.webp
  ],
  sku: NINJAGO-SMOKEN-001,
  brand: {
    @type: Brand,
    name: NinjaBlox
  },
  offers: {
    @type: Offer,
    url: https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/,
    priceCurrency: BRL,
    price: 14.90,
    priceValidUntil: 2026-12-31,
    availability: https://schema.org/InStock,
    itemCondition: https://schema.org/NewCondition,
    seller: {
      @type: Organization,
      name: QBlox
    }
  },
  aggregateRating: {
    @type: AggregateRating,
    ratingValue: 4.8,
    reviewCount: 127
  },
  review: [
    {
      @type: Review,
      author: {
        @type: Person,
        name: Maria Silva
      },
      datePublished: 2026-02-15,
      reviewBody: Produto excelente! Meu filho adorou o boneco NinjaBlox Smoken. Compatível com LEGO e de ótima qualidade.,
      reviewRating: {
        @type: Rating,
        ratingValue: 5,
        bestRating: 5
      }
    }
  ]
}
```

**Campos Obrigatórios:**
1. @context: https://schema.org/
2. @type: Product
3. name: Nome do produto
4. description: Descrição do produto (150-200 caracteres)
5. image: Array de URLs de imagens
6. sku: Código SKU único
7. brand: Marca do produto
8. offers: Informações de oferta
   - @type: Offer
   - url: URL da página do produto
   - priceCurrency: BRL
   - price: Preço do produto
   - availability: Status de disponibilidade

**Campos Opcionais (Recomendados):**
1. priceValidUntil: Data de validade do preço
2. itemCondition: Condição do item (novo/usado)
3. seller: Informações do vendedor
4. aggregateRating: Avaliação agregada (quando disponível)
5. review: Array de avaliações (quando disponível)

**Status de Disponibilidade:**
- Em estoque: https://schema.org/InStock
- Fora de estoque: https://schema.org/OutOfStock
- Pré-venda: https://schema.org/PreOrder
- Disponibilidade limitada: https://schema.org/LimitedAvailability

**Implementação:**
- Inserir script JSON-LD no <head> de cada página de produto
- Gerar dinamicamente baseado nos dados do produto
- Atualizar automaticamente quando produto for editado
- Validar usando Google Rich Results Test

**Gerenciamento no Admin:**
- Geração automática de Schema.org Product ao salvar produto
- Preview do JSON-LD gerado
- Validação automática usando Google Rich Results Test API
- Alerta se campos obrigatórios estiverem faltando
- Opção de editar manualmente o JSON-LD
- Histórico de alterações no Schema

#### 10.2.2 Schema.org BreadcrumbList

**Estrutura Completa:**

```json
{
  @context: https://schema.org,
  @type: BreadcrumbList,
  itemListElement: [
    {
      @type: ListItem,
      position: 1,
      name: Home,
      item: https://qblox.com.br/
    },
    {
      @type: ListItem,
      position: 2,
      name: Bonecos de Montar,
      item: https://qblox.com.br/bonecos-de-montar/
    },
    {
      @type: ListItem,
      position: 3,
      name: Ninjago,
      item: https://qblox.com.br/boneco-de-montar-ninjago/
    },
    {
      @type: ListItem,
      position: 4,
      name: NinjaBlox Smoken,
      item: https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/
    }
  ]
}
```

**Estrutura de Breadcrumbs por Tipo de Página:**

**Homepage:**
- Não exibe breadcrumbs

**Categoria (Exemplo: Ninjago):**
```
Home → Bonecos de Montar → Ninjago
```

**Produto (Exemplo: NinjaBlox Smoken):**
```
Home → Bonecos de Montar → Ninjago → NinjaBlox Smoken
```

**Página Institucional (Exemplo: Sobre Nós):**
```
Home → Sobre Nós
```

**Implementação:**
- Inserir script JSON-LD no <head> de cada página
- Exibir breadcrumbs visualmente no topo da página
- Gerar dinamicamente baseado na hierarquia da página
- Atualizar automaticamente quando estrutura mudar
- Validar usando Google Rich Results Test

**Estilo Visual dos Breadcrumbs:**
- Font-size: 13-15px
- Cor: cinza médio (#757575)
- Separador: / ou >
- Hover: cor laranja (#FF9800)
- Último item: negrito, cor preta (#000000)
- Margin-bottom: 16-20px

**Gerenciamento no Admin:**
- Geração automática de Schema.org BreadcrumbList
- Preview do JSON-LD gerado
- Validação automática usando Google Rich Results Test API
- Opção de customizar separador
- Opção de ocultar breadcrumbs em páginas específicas

#### 10.2.3 Schema.org Organization

**Estrutura Completa:**

```json
{
  @context: https://schema.org,
  @type: Organization,
  name: QBlox,
  url: https://qblox.com.br,
  logo: https://qblox.com.br/images/logo-qblox.png,
  description: Loja especializada em bonecos de montar tipo LEGO. Variedade, qualidade e os melhores preços. Frete grátis acima de R$99.,
  contactPoint: {
    @type: ContactPoint,
    telephone: +55-11-98765-4321,
    contactType: Customer Service,
    areaServed: BR,
    availableLanguage: Portuguese
  },
  sameAs: [
    https://www.instagram.com/qbloxkids,
    https://www.facebook.com/qbloxkids,
    https://www.youtube.com/qbloxkids
  ],
  address: {
    @type: PostalAddress,
    streetAddress: Rua Exemplo, 123,
    addressLocality: São Paulo,
    addressRegion: SP,
    postalCode: 01234-567,
    addressCountry: BR
  }
}
```

**Campos Obrigatórios:**
1. @context: https://schema.org
2. @type: Organization
3. name: Nome da empresa
4. url: URL do site
5. logo: URL do logo

**Campos Opcionais (Recomendados):**
1. description: Descrição da empresa
2. contactPoint: Informações de contato
3. sameAs: Array de URLs de redes sociais
4. address: Endereço da empresa

**Implementação:**
- Inserir script JSON-LD no <head> da homepage
- Manter informações atualizadas
- Validar usando Google Rich Results Test

**Gerenciamento no Admin:**
- Seção dedicada para configurar Schema.org Organization
- Campos editáveis:
  + Nome da empresa
  + URL do site
  + Logo (upload)
  + Descrição
  + Telefone de contato
  + Endereço completo
  + URLs de redes sociais
- Preview do JSON-LD gerado
- Validação automática usando Google Rich Results Test API

#### 10.2.4 Schema.org ItemList nas Páginas de Categoria

**Estrutura Completa:**

```json
{
  @context: https://schema.org,
  @type: ItemList,
  name: Bonecos de Montar Ninjago,
  description: Coleção completa de bonecos de montar Ninjago compatíveis com LEGO. Personagens autênticos, qualidade premium.,
  url: https://qblox.com.br/boneco-de-montar-ninjago/,
  numberOfItems: 24,
  itemListElement: [
    {
      @type: ListItem,
      position: 1,
      item: {
        @type: Product,
        name: Boneco de Montar NinjaBlox Smoken,
        url: https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/,
        image: https://qblox.com.br/images/boneco-montar-ninjablox-smoken-principal.webp,
        offers: {
          @type: Offer,
          priceCurrency: BRL,
          price: 14.90,
          availability: https://schema.org/InStock
        }
      }
    },
    {
      @type: ListItem,
      position: 2,
      item: {
        @type: Product,
        name: Boneco de Montar NinjaBlox Kai,
        url: https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-kai/,
        image: https://qblox.com.br/images/boneco-montar-ninjablox-kai-principal.webp,
        offers: {
          @type: Offer,
          priceCurrency: BRL,
          price: 14.90,
          availability: https://schema.org/InStock
        }
      }
    }
  ]
}
```

**Campos Obrigatórios:**
1. @context: https://schema.org
2. @type: ItemList
3. name: Nome da categoria
4. url: URL da página de categoria
5. itemListElement: Array de produtos

**Campos Opcionais (Recomendados):**
1. description: Descrição da categoria
2. numberOfItems: Número total de produtos

**Implementação:**
- Inserir script JSON-LD no <head> de cada página de categoria
- Gerar dinamicamente baseado nos produtos da categoria
- Incluir todos os produtos visíveis na página
- Atualizar automaticamente quando produtos forem adicionados/removidos
- Validar usando Google Rich Results Test

**Gerenciamento no Admin:**
- Geração automática de Schema.org ItemList ao salvar categoria
- Preview do JSON-LD gerado
- Validação automática usando Google Rich Results Test API
- Opção de limitar número de produtos no Schema (recomendado: 20-30)
- Alerta se campos obrigatórios estiverem faltando

### 10.3 FASE 4 — ARQUITETURA DE CONTEÚDO E CATEGORIAS (Semanas 4-8)

#### 10.3.1 Criar Páginas de Categoria Otimizadas

**Objetivo:**
Cada categoria precisa ser uma página independente com URL única, contendo conteúdo otimizado para SEO e experiência do usuário.

**Estrutura de Página de Categoria:**

**1. URL Única:**
- Formato: https://qblox.com.br/[categoria-slug]/
- Exemplos:
  + https://qblox.com.br/boneco-de-montar-ninjago/
  + https://qblox.com.br/bonecos-de-montar-super-herois/
  + https://qblox.com.br/bonecos-de-montar-roblox/
  + https://qblox.com.br/bonecos-de-montar-pokemon/
  + https://qblox.com.br/bonecos-de-montar-stranger-things/
  + https://qblox.com.br/acessorios-para-blocos-de-montar/

**2. H1 com Keyword:**
- Formato: [Keyword Principal] | [Diferencial]
- Exemplos:
  + Bonecos de Montar Ninjago | Coleção NinjaBlox
  + Bonecos de Montar Super-Heróis | Marvel e DC
  + Bonecos de Montar Roblox | Personagens Oficiais
  + Bonecos de Montar Pokémon | Coleção Completa
  + Bonecos de Montar Stranger Things | Personagens da Série
  + Acessórios para Blocos de Montar | Compatíveis com LEGO

**3. Texto Introdutório (300-500 palavras):**

**Estrutura do Texto:**
- Parágrafo 1: Introdução ao tema (100-150 palavras)
  + O que é a categoria
  + Por que é popular
  + Público-alvo

- Parágrafo 2: Benefícios e diferenciais (100-150 palavras)
  + Compatibilidade com LEGO
  + Qualidade dos produtos
  + Variedade de personagens/temas

- Parágrafo 3: Como escolher (100-150 palavras)
  + Critérios de seleção
  + Idade recomendada
  + Dicas de compra

**Exemplo de Texto Introdutório (Categoria Ninjago):**

```
H1: Bonecos de Montar Ninjago | Coleção NinjaBlox

Os bonecos de montar Ninjago são perfeitos para fãs da série que adoram construir e colecionar. A coleção NinjaBlox traz todos os personagens icônicos da série, incluindo Kai, Jay, Cole, Zane, Lloyd e muitos outros. Compatíveis com blocos de montar tipo LEGO, esses bonecos permitem criar aventuras épicas e expandir sua coleção de minifiguras ninja.

Nossa coleção de bonecos de montar Ninjago se destaca pela qualidade premium dos materiais e pela fidelidade aos personagens da série. Cada boneco é feito com plástico ABS de alta qualidade, garantindo durabilidade e segurança durante as brincadeiras. As peças se encaixam perfeitamente com blocos LEGO originais, permitindo criar cenários e histórias únicas. Além disso, oferecemos frete grátis acima de R$99 e parcelamento em até 12x sem juros.

Ao escolher bonecos de montar Ninjago, considere a idade recomendada (a partir de 6 anos), os personagens favoritos da criança e a compatibilidade com outros brinquedos de montar. Nossa coleção inclui desde bonecos individuais até kits completos com acessórios e veículos. Todos os produtos são originais, lacrados e acompanham manual de instruções ilustrado. Confira nossa seleção e encontre o boneco Ninjago perfeito para sua coleção!
```

**4. Listagem de Produtos:**
- Reutilizar componente de Card de Produto padrão (seção 3.2.8)
- Layout: grid de 4 colunas (desktop), 3 colunas (tablet), 2 colunas (mobile)
- Paginação: 20-30 produtos por página
- Ordenação padrão: Mais vendidos

**5. Filtros e Ordenação:**

**Filtros Disponíveis:**
- **Preço:**
  + Até R$20
  + R$20 - R$50
  + R$50 - R$100
  + Acima de R$100
  + Faixa personalizada (slider)

- **Personagem/Tema:**
  + Lista de personagens/temas específicos da categoria
  + Exemplo (Ninjago): Kai, Jay, Cole, Zane, Lloyd, Nya, Sensei Wu

- **Disponibilidade:**
  + Em estoque
  + Pré-venda
  + Esgotado (ocultar por padrão)

- **Desconto:**
  + Com desconto
  + Sem desconto

- **Frete:**
  + Frete grátis
  + Entrega rápida

**Opções de Ordenação:**
- Mais vendidos (padrão)
- Menor preço
- Maior preço
- Lançamentos
- Melhor avaliação
- A-Z
- Z-A

**Layout dos Filtros:**
- Posição: lateral esquerda (desktop), topo (mobile)
- Estilo: accordion colapsável
- Aplicar filtros: botão Aplicar Filtros
- Limpar filtros: link Limpar Todos
- Contador de produtos: Exibindo X de Y produtos

**6. FAQ sobre o Tema:**

**Estrutura:**
- Título: H2 Perguntas Frequentes sobre [Categoria]
- Layout: accordion colapsável
- Mínimo: 5 perguntas
- Máximo: 10 perguntas

**Exemplo de FAQ (Categoria Ninjago):**

```
H2: Perguntas Frequentes sobre Bonecos de Montar Ninjago

H3: Os bonecos NinjaBlox são compatíveis com LEGO?
Sim! Todos os bonecos de montar NinjaBlox são 100% compatíveis com blocos LEGO originais. As peças se encaixam perfeitamente, permitindo criar cenários e histórias únicas combinando diferentes coleções.

H3: Qual a idade recomendada para bonecos Ninjago?
A idade recomendada é a partir de 6 anos. Os bonecos contêm peças pequenas que podem representar risco de asfixia para crianças menores de 3 anos. Sempre supervisione crianças durante as brincadeiras.

H3: Os bonecos vêm com acessórios?
Sim! A maioria dos bonecos NinjaBlox vem com acessórios temáticos, como espadas ninja, shurikens, escudos e outros itens característicos de cada personagem. Confira a descrição de cada produto para detalhes.

H3: Qual o prazo de entrega?
O prazo de entrega varia de acordo com sua região. Em média, entregas para capitais levam de 3 a 7 dias úteis. Para compras acima de R$99, o frete é grátis! Consulte o prazo exato no checkout.

H3: Posso devolver se não gostar?
Sim! Você tem 7 dias para solicitar a devolução ou troca do produto, conforme o Código de Defesa do Consumidor. O produto deve estar em sua embalagem original, sem sinais de uso. Consulte nossa Política de Troca e Devolução para mais detalhes.

H3: Os bonecos são originais?
Sim! Todos os bonecos de montar vendidos na QBlox são originais, lacrados e acompanham certificado de autenticidade. Garantimos a qualidade e segurança de todos os produtos.

H3: Posso parcelar a compra?
Sim! Você pode parcelar sua compra em até 12x sem juros no cartão de crédito. Também aceitamos pagamento via PIX, boleto bancário e cartão de débito.

H3: Vocês vendem kits completos?
Sim! Além de bonecos individuais, oferecemos kits completos com múltiplos personagens, veículos e cenários. Confira nossa seção de kits e economize na compra de coleções completas.
```

**7. Links Internos:**

**Tipos de Links:**
- **Links para Produtos Relacionados:**
  + Seção Produtos em Destaque
  + Seção Você Também Pode Gostar
  + Seção Mais Vendidos

- **Links para Categorias Relacionadas:**
  + Exemplo (Ninjago): Super-Heróis, Roblox, Aventura
  + Formato: Veja também: [Link Categoria 1] | [Link Categoria 2] | [Link Categoria 3]

- **Links para Conteúdo do Blog:**
  + Artigos relacionados ao tema da categoria
  + Exemplo (Ninjago): Ninjago: Conheça Todos os Personagens e Seus Poderes

**Posicionamento dos Links:**
- Produtos relacionados: após listagem principal
- Categorias relacionadas: após FAQ
- Links para blog: sidebar ou após FAQ

**Categorias Essenciais:**

**1. Bonecos de Montar Ninjago (NinjaBlox)**
- URL: https://qblox.com.br/boneco-de-montar-ninjago/
- H1: Bonecos de Montar Ninjago | Coleção NinjaBlox
- Keywords: boneco de montar ninjago, ninjago blocos de montar, minifiguras ninja, ninjago brinquedo

**2. Bonecos de Montar Super-Heróis (Marvel e DC)**
- URL: https://qblox.com.br/bonecos-de-montar-super-herois/
- H1: Bonecos de Montar Super-Heróis | Marvel e DC
- Keywords: boneco de montar super herói, minifiguras marvel blocos, boneco de montar vingadores

**3. Bonecos de Montar Roblox**
- URL: https://qblox.com.br/bonecos-de-montar-roblox/
- H1: Bonecos de Montar Roblox | Personagens Oficiais
- Keywords: boneco de montar roblox, roblox blocos de montar, minifiguras roblox

**4. Bonecos de Montar Pokémon**
- URL: https://qblox.com.br/bonecos-de-montar-pokemon/
- H1: Bonecos de Montar Pokémon | Coleção Completa
- Keywords: boneco de montar pokemon, pokemon blocos de montar, minifiguras pokemon

**5. Bonecos de Montar Stranger Things**
- URL: https://qblox.com.br/bonecos-de-montar-stranger-things/
- H1: Bonecos de Montar Stranger Things | Personagens da Série
- Keywords: boneco de montar stranger things, stranger things blocos de montar, minifiguras stranger things

**6. Acessórios para Blocos de Montar**
- URL: https://qblox.com.br/acessorios-para-blocos-de-montar/
- H1: Acessórios para Blocos de Montar | Compatíveis com LEGO
- Keywords: acessórios blocos de montar, acessórios lego compatíveis, peças blocos de montar

**Gerenciamento no Admin:**

**Seção: Gerenciar Categorias**

**Campos Editáveis:**
1. **Nome da Categoria:**
   - Label: Nome da Categoria *
   - Type: text
   - Validação: obrigatório

2. **Slug da URL:**
   - Label: Slug da URL *
   - Type: text
   - Validação: obrigatório, único
   - Sugestão automática baseada no nome

3. **H1:**
   - Label: Título H1 *
   - Type: text
   - Max-length: 60 caracteres
   - Validação: obrigatório
   - Sugestão automática

4. **Texto Introdutório:**
   - Label: Texto Introdutório *
   - Type: rich text editor
   - Min-length: 300 palavras
   - Max-length: 500 palavras
   - Validação: obrigatório
   - Contador de palavras em tempo real

5. **Meta Title:**
   - Label: Meta Title *
   - Type: text
   - Max-length: 60 caracteres
   - Validação: obrigatório
   - Sugestão automática

6. **Meta Description:**
   - Label: Meta Description *
   - Type: textarea
   - Max-length: 160 caracteres
   - Validação: obrigatório
   - Sugestão automática

7. **Keywords Principais:**
   - Label: Keywords Principais
   - Type: tags input
   - Helper text: Adicione as keywords principais para esta categoria

8. **FAQ:**
   - Label: Perguntas Frequentes
   - Type: repeater field
   - Campos:
     + Pergunta (text)
     + Resposta (textarea)
   - Mínimo: 5 perguntas
   - Máximo: 10 perguntas

9. **Categorias Relacionadas:**
   - Label: Categorias Relacionadas
   - Type: multi-select
   - Opções: lista de todas as categorias

10. **Imagem de Banner:**
    - Label: Imagem de Banner
    - Type: file upload
    - Dimensões recomendadas: 1920x400px

11. **Status:**
    - Label: Status
    - Type: toggle switch
    - Opções: Ativo / Inativo

**Botões de Ação:**
- Salvar Categoria
- Cancelar
- Preview

**Validações:**
- Nome da categoria: obrigatório
- Slug: obrigatório, único
- H1: obrigatório, máximo 60 caracteres
- Texto introdutório: obrigatório, 300-500 palavras
- Meta title: obrigatório, máximo 60 caracteres
- Meta description: obrigatório, máximo 160 caracteres
- FAQ: mínimo 5 perguntas

#### 10.3.2 Criar um Blog

**Objetivo:**
Conteúdo informacional é essencial para capturar tráfego de topo de funil e estabelecer autoridade no nicho.

**Estrutura do Blog:**

**1. URL do Blog:**
- Formato: https://qblox.com.br/blog/
- Posts: https://qblox.com.br/blog/[post-slug]/

**2. Página Principal do Blog:**
- H1: Blog QBlox | Dicas e Novidades sobre Bonecos de Montar
- Layout: grid de 3 colunas (desktop), 2 colunas (tablet), 1 coluna (mobile)
- Paginação: 12 posts por página
- Sidebar:
  + Busca
  + Categorias
  + Posts mais lidos
  + Newsletter

**3. Estrutura de Post:**

**Elementos Obrigatórios:**
- H1: Título do post
- Imagem de destaque (1200x630px)
- Data de publicação
- Autor
- Tempo de leitura
- Categorias/tags
- Conteúdo (mínimo 1000 palavras)
- Imagens ilustrativas (mínimo 3)
- Call-to-action
- Compartilhamento social
- Posts relacionados
- Comentários (opcional)

**Artigos Sugeridos:**

**1. Guia Completo: Como Escolher Bonecos de Montar por Idade**
- URL: https://qblox.com.br/blog/como-escolher-bonecos-de-montar-por-idade/
- H1: Guia Completo: Como Escolher Bonecos de Montar por Idade
- Keywords: bonecos de montar por idade, brinquedos de montar para crianças, idade recomendada blocos de montar
- Comprimento: 1500-2000 palavras
- Estrutura:
  + Introdução (200 palavras)
  + Bonecos de Montar para 3-5 anos (300 palavras)
  + Bonecos de Montar para 6-8 anos (300 palavras)
  + Bonecos de Montar para 9-12 anos (300 palavras)
  + Bonecos de Montar para Adolescentes e Adultos (300 palavras)
  + Dicas de Segurança (200 palavras)
  + Conclusão (100 palavras)

**2. Ninjago: Conheça Todos os Personagens e Seus Poderes**
- URL: https://qblox.com.br/blog/ninjago-personagens-e-poderes/
- H1: Ninjago: Conheça Todos os Personagens e Seus Poderes
- Keywords: personagens ninjago, poderes ninjago, ninjas ninjago
- Comprimento: 2000-2500 palavras
- Estrutura:
  + Introdução ao Universo Ninjago (200 palavras)
  + Kai - Ninja do Fogo (300 palavras)
  + Jay - Ninja do Raio (300 palavras)
  + Cole - Ninja da Terra (300 palavras)
  + Zane - Ninja do Gelo (300 palavras)
  + Lloyd - Ninja Verde (300 palavras)
  + Nya - Ninja da Água (300 palavras)
  + Outros Personagens Importantes (300 palavras)
  + Conclusão (100 palavras)

**3. Boneco de Montar vs LEGO: Qual a Diferença?**
- URL: https://qblox.com.br/blog/boneco-de-montar-vs-lego-diferencas/
- H1: Boneco de Montar vs LEGO: Qual a Diferença?
- Keywords: boneco de montar vs lego, diferença lego e blocos de montar, compatível com lego
- Comprimento: 1200-1500 palavras
- Estrutura:
  + Introdução (200 palavras)
  + O Que São Bonecos de Montar (300 palavras)
  + O Que É LEGO (300 palavras)
  + Principais Diferenças (400 palavras)
  + Compatibilidade (200 palavras)
  + Qual Escolher? (200 palavras)
  + Conclusão (100 palavras)

**4. 10 Melhores Bonecos de Montar para Presente em 2026**
- URL: https://qblox.com.br/blog/melhores-bonecos-de-montar-para-presente-2026/
- H1: 10 Melhores Bonecos de Montar para Presente em 2026
- Keywords: bonecos de montar para presente, presente de aniversário blocos de montar, melhores brinquedos de montar
- Comprimento: 1500-2000 palavras
- Estrutura:
  + Introdução (200 palavras)
  + 10 Produtos (cada um com 150 palavras):
    1. Boneco NinjaBlox Kai
    2. Kit Super-Heróis Marvel
    3. Boneco Roblox Ninja
    4. Coleção Pokémon Starter
    5. Kit Stranger Things
    6. Boneco NinjaBlox Lloyd
    7. Kit Acessórios Premium
    8. Boneco Homem-Aranha
    9. Coleção Ninjago Completa
    10. Kit Criativo Personalizado
  + Como Escolher o Presente Ideal (200 palavras)
  + Conclusão (100 palavras)

**5. Como Montar e Exibir sua Coleção de Minifiguras**
- URL: https://qblox.com.br/blog/como-montar-e-exibir-colecao-de-minifiguras/
- H1: Como Montar e Exibir sua Coleção de Minifiguras
- Keywords: coleção de minifiguras, como exibir bonecos de montar, organizar coleção lego
- Comprimento: 1200-1500 palavras
- Estrutura:
  + Introdução (200 palavras)
  + Organizando sua Coleção (300 palavras)
  + Ideias de Exibição (400 palavras)
  + Cuidados e Manutenção (300 palavras)
  + Dicas de Armazenamento (200 palavras)
  + Conclusão (100 palavras)

**6. NinjaBlox: Conheça a Linha Completa de Ninjas para Montar**
- URL: https://qblox.com.br/blog/ninjablox-linha-completa-ninjas/
- H1: NinjaBlox: Conheça a Linha Completa de Ninjas para Montar
- Keywords: ninjablox, bonecos ninjablox, linha ninjablox completa
- Comprimento: 1500-2000 palavras
- Estrutura:
  + Introdução à Linha NinjaBlox (200 palavras)
  + Bonecos Individuais (400 palavras)
  + Kits e Coleções (400 palavras)
  + Acessórios e Complementos (300 palavras)
  + Compatibilidade e Qualidade (300 palavras)
  + Onde Comprar (200 palavras)
  + Conclusão (100 palavras)

**Gerenciamento no Admin:**

**Seção: Gerenciar Blog**

**Campos Editáveis:**
1. **Título do Post:**
   - Label: Título do Post *
   - Type: text
   - Max-length: 60 caracteres
   - Validação: obrigatório

2. **Slug da URL:**
   - Label: Slug da URL *
   - Type: text
   - Validação: obrigatório, único
   - Sugestão automática baseada no título

3. **Imagem de Destaque:**
   - Label: Imagem de Destaque *
   - Type: file upload
   - Dimensões recomendadas: 1200x630px
   - Validação: obrigatório

4. **Resumo:**
   - Label: Resumo *
   - Type: textarea
   - Max-length: 160 caracteres
   - Validação: obrigatório

5. **Conteúdo:**
   - Label: Conteúdo *
   - Type: rich text editor
   - Min-length: 1000 palavras
   - Validação: obrigatório
   - Contador de palavras em tempo real

6. **Autor:**
   - Label: Autor *
   - Type: select
   - Opções: lista de autores cadastrados
   - Validação: obrigatório

7. **Categorias:**
   - Label: Categorias *
   - Type: multi-select
   - Opções: Guias, Dicas, Novidades, Reviews, Tutoriais
   - Validação: obrigatório (mínimo 1)

8. **Tags:**
   - Label: Tags
   - Type: tags input
   - Helper text: Adicione tags relevantes para o post

9. **Meta Title:**
   - Label: Meta Title *
   - Type: text
   - Max-length: 60 caracteres
   - Validação: obrigatório
   - Sugestão automática

10. **Meta Description:**
    - Label: Meta Description *
    - Type: textarea
    - Max-length: 160 caracteres
    - Validação: obrigatório
    - Sugestão automática

11. **Data de Publicação:**
    - Label: Data de Publicação
    - Type: date picker
    - Default: data atual

12. **Status:**
    - Label: Status
    - Type: select
    - Opções: Rascunho, Publicado, Agendado

**Botões de Ação:**
- Salvar Post
- Publicar
- Agendar
- Preview
- Cancelar

**Validações:**
- Título: obrigatório, máximo 60 caracteres
- Slug: obrigatório, único
- Imagem de destaque: obrigatória
- Resumo: obrigatório, máximo 160 caracteres
- Conteúdo: obrigatório, mínimo 1000 palavras
- Autor: obrigatório
- Categorias: obrigatório (mínimo 1)
- Meta title: obrigatório, máximo 60 caracteres
- Meta description: obrigatório, máximo 160 caracteres

### 10.4 FASE 5 — ESTRATÉGIA DE KEYWORDS (Implementação Contínua)

#### 10.4.1 Mapa de Keywords por Página

**Objetivo:**
Definir keywords principais e secundárias para cada tipo de página, baseado na análise da SERP e potencial de ranqueamento.

**Homepage:**
- **Keywords Principais:**
  + boneco de montar
  + blocos de montar tipo lego
  + minifiguras para montar

- **Keywords Secundárias:**
  + bonecos de montar compatíveis com lego
  + blocos de montar infantil
  + minifiguras blocos de montar
  + brinquedos de montar

- **Densidade de Keywords:**
  + Keyword principal: 1-2% do conteúdo
  + Keywords secundárias: 0.5-1% do conteúdo

**Categoria Ninjago:**
- **Keywords Principais:**
  + boneco de montar ninjago
  + ninjago blocos de montar
  + minifiguras ninja
  + ninjago brinquedo

- **Keywords Secundárias:**
  + ninjablox
  + bonecos ninjago compatíveis com lego
  + coleção ninjago blocos
  + personagens ninjago para montar

**Produtos NinjaBlox:**
- **Keywords Principais:**
  + boneco de montar ninja
  + ninjablox
  + minifigura ninja blocos

- **Keywords Secundárias:**
  + boneco ninjago [nome do personagem]
  + ninjablox [nome do personagem]
  + minifigura ninjago compatível lego

**Categoria Super-Heróis:**
- **Keywords Principais:**
  + boneco de montar super herói
  + minifiguras marvel blocos
  + boneco de montar vingadores

- **Keywords Secundárias:**
  + bonecos super heróis compatíveis com lego
  + minifiguras dc blocos
  + bonecos marvel para montar
  + super heróis blocos de montar

**Categoria Roblox:**
- **Keywords Principais:**
  + boneco de montar roblox
  + roblox blocos de montar
  + minifiguras roblox

- **Keywords Secundárias:**
  + bonecos roblox compatíveis com lego
  + personagens roblox para montar
  + coleção roblox blocos

**Implementação no Admin:**

**Seção: Análise de Keywords**

**Funcionalidades:**
1. **Dashboard de Keywords:**
   - Exibir keywords principais e secundárias por página
   - Densidade de keywords atual
   - Sugestões de otimização
   - Ranking atual no Google (se integrado com API)

2. **Análise de Conteúdo:**
   - Verificar densidade de keywords em tempo real
   - Alertar se densidade muito baixa ou muito alta
   - Sugerir onde adicionar keywords naturalmente

3. **Relatório de Performance:**
   - Ranking de keywords
   - Volume de busca
   - Dificuldade de ranqueamento
   - Oportunidades de melhoria

#### 10.4.2 Long-Tail Keywords (Menor Concorrência, Maior Conversão)

**Objetivo:**
Focar em termos long-tail com menor concorrência e maior potencial de conversão, ideais para um e-commerce novo alcançar a primeira página no curto prazo.

**Long-Tail Keywords Prioritárias:**

**1. boneco de montar ninjago barato**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: compra
- Páginas-alvo: Categoria Ninjago, produtos específicos

**2. kit bonecos de montar ninjago**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: compra
- Páginas-alvo: Categoria Ninjago, kits específicos

**3. boneco ninja blocos de montar**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: pesquisa/compra
- Páginas-alvo: Categoria Ninjago, produtos específicos

**4. minifiguras ninjago compatível lego**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: pesquisa/compra
- Páginas-alvo: Categoria Ninjago, produtos específicos

**5. boneco de montar roblox comprar**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: compra
- Páginas-alvo: Categoria Roblox, produtos específicos

**6. bonecos de montar super-heróis marvel**
- Volume de busca: médio
- Concorrência: baixa
- Intenção: pesquisa/compra
- Páginas-alvo: Categoria Super-Heróis, produtos específicos

**7. blocos de montar tipo lego barato**
- Volume de busca: alto
- Concorrência: média
- Intenção: compra
- Páginas-alvo: Homepage, categorias principais

**8. NinjaBlox boneco**
- Volume de busca: baixo
- Concorrência: muito baixa
- Intenção: pesquisa/compra
- Páginas-alvo: Categoria Ninjago, produtos NinjaBlox

**Estratégia de Implementação:**

**1. Otimização de Páginas Existentes:**
- Incluir long-tail keywords naturalmente no conteúdo
- Adicionar seções específicas para long-tail keywords
- Criar FAQs respondendo perguntas relacionadas

**2. Criação de Landing Pages:**
- Criar páginas específicas para long-tail keywords de alto potencial
- Exemplo: /boneco-de-montar-ninjago-barato/
- Conteúdo focado na keyword específica

**3. Conteúdo de Blog:**
- Criar posts focados em long-tail keywords
- Exemplo: Como Encontrar Bonecos de Montar Ninjago Baratos
- Linkar para páginas de produtos relevantes

**4. Otimização de Produtos:**
- Incluir long-tail keywords em títulos e descrições
- Exemplo: Boneco de Montar NinjaBlox Kai - Compatível com LEGO - Barato

**Monitoramento e Ajustes:**

**Métricas a Acompanhar:**
1. Posição no ranking do Google
2. Volume de tráfego orgânico
3. Taxa de conversão por keyword
4. Taxa de rejeição
5. Tempo médio na página

**Ferramentas Recomendadas:**
- Google Search Console
- Google Analytics
- SEMrush ou Ahrefs (para análise de keywords)
- Screaming Frog (para auditoria técnica)

**Frequência de Revisão:**
- Semanal: monitorar posições e tráfego
- Mensal: ajustar estratégia baseado em performance
- Trimestral: revisar e atualizar mapa de keywords

## 11. Fundação Técnica e Otimização para Mecanismos de Busca

### 11.1 Resolução do Problema de Renderização

**Contexto:**
A plataforma precisa garantir que todo o conteúdo seja renderizado de forma adequada para os mecanismos de busca (Googlebot), permitindo indexação completa e correta de produtos, categorias e páginas institucionais.

**Opções de Implementação (em ordem de prioridade):**

**Opção 1 - Migração para Plataforma com SSR Nativo (RECOMENDADO):**
- Migrar para plataforma de e-commerce com Server-Side Rendering (SSR) nativo
- Plataformas recomendadas:
  + Shopify
  + Nuvemshop
  + WooCommerce
  + Tray
- Vantagens:
  + SSR nativo e otimizado
  + Infraestrutura robusta e escalável
  + Suporte técnico especializado
  + Atualizações automáticas de segurança e performance
  + Ferramentas de SEO integradas

**Opção 2 - Implementação de SSR/SSG na Plataforma Atual:**
- Implementar Server-Side Rendering (SSR) ou Static Site Generation (SSG)
- Frameworks recomendados:
  + Next.js (React)
  + Nuxt.js (Vue)
  + SvelteKit (Svelte)
- Requisitos técnicos:
  + Servidor Node.js para SSR
  + Build pipeline para SSG
  + Cache e CDN para otimização
- Vantagens:
  + Controle total sobre a implementação
  + Flexibilidade para customizações
  + Performance otimizada

**Opção 3 - Implementação de Pre-rendering (MENOS RECOMENDADO):**
- Implementar pre-rendering com serviços como Prerender.io
- Servir HTML estático ao Googlebot
- Limitações:
  + Solução paliativa, não resolve o problema na raiz
  + Custo adicional de serviço terceiro
  + Possível latência na atualização de conteúdo
  + Menor controle sobre o processo de renderização

**Recomendação Final:**
A Opção 1 (migração para plataforma com SSR nativo) é fortemente recomendada por oferecer a melhor relação entre custo-benefício, performance, segurança e facilidade de manutenção a longo prazo.

### 11.2 Criação e Configuração do Sitemap.xml

**Localização:**
- URL: https://qblox.com.br/sitemap.xml
- Arquivo deve estar na raiz do domínio

**Estrutura do Sitemap:**
```xml
<?xml version=1.0 encoding=UTF-8?>
<urlset xmlns=http://www.sitemaps.org/schemas/sitemap/0.9>
  <!-- Página inicial -->
  <url>
    <loc>https://qblox.com.br/</loc>
    <lastmod>2026-02-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Categorias -->
  <url>
    <loc>https://qblox.com.br/boneco-de-montar-ninjago/</loc>
    <lastmod>2026-02-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Produtos -->
  <url>
    <loc>https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/</loc>
    <lastmod>2026-02-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Páginas institucionais -->
  <url>
    <loc>https://qblox.com.br/sobre-nos/</loc>
    <lastmod>2026-02-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

**Conteúdo do Sitemap:**
- Todas as URLs de produtos ativos
- Todas as URLs de categorias
- Todas as páginas institucionais (Sobre Nós, Contato, Política de Privacidade, Termos de Uso)
- Página inicial
- Páginas de blog (se aplicável)

**Atualização Automática:**
- Sitemap deve ser atualizado automaticamente quando:
  + Produtos são adicionados
  + Produtos são removidos
  + Produtos são ativados/desativados
  + Categorias são criadas ou modificadas
  + Páginas institucionais são criadas ou modificadas
- Frequência de atualização: diária ou em tempo real

**Prioridades (priority):**
- Página inicial: 1.0
- Categorias principais: 0.8
- Produtos: 0.6
- Páginas institucionais: 0.5
- Blog posts: 0.4

**Frequência de Mudança (changefreq):**
- Página inicial: daily
- Categorias: weekly
- Produtos: weekly
- Páginas institucionais: monthly
- Blog posts: monthly

**Validação:**
- Validar sitemap.xml usando ferramentas como:
  + Google Search Console
  + XML Sitemap Validator
  + Screaming Frog SEO Spider

**Submissão:**
- Submeter sitemap.xml ao Google Search Console
- Submeter sitemap.xml ao Bing Webmaster Tools
- Adicionar referência ao sitemap no robots.txt

### 11.3 Correção do Arquivo robots.txt

**Localização:**
- URL: https://qblox.com.br/robots.txt
- Arquivo deve estar na raiz do domínio

**Estrutura do robots.txt:**

```
User-agent: *
Allow: /

# Bloquear áreas administrativas
Disallow: /admin/
Disallow: /painel/
Disallow: /dashboard/

# Bloquear páginas de checkout e carrinho
Disallow: /checkout/
Disallow: /carrinho/
Disallow: /minha-conta/

# Bloquear páginas de busca com parâmetros
Disallow: /*?s=
Disallow: /*?busca=

# Bloquear páginas de filtros com múltiplos parâmetros
Disallow: /*?*&*

# Permitir recursos necessários para renderização
Allow: /css/
Allow: /js/
Allow: /images/
Allow: /fonts/
Allow: /assets/

# Sitemap
Sitemap: https://qblox.com.br/sitemap.xml
```

**Regras Importantes:**
1. **Permitir recursos de renderização:**
   - CSS: Allow: /css/
   - JavaScript: Allow: /js/
   - Imagens: Allow: /images/
   - Fontes: Allow: /fonts/
   - Assets: Allow: /assets/

2. **Bloquear áreas sensíveis:**
   - Painel administrativo
   - Páginas de checkout
   - Páginas de conta do usuário
   - Páginas de busca com parâmetros

3. **Referência ao Sitemap:**
   - Incluir linha: Sitemap: https://qblox.com.br/sitemap.xml

**Validação:**
- Testar robots.txt usando:
  + Google Search Console - Testador de robots.txt
  + Bing Webmaster Tools - Testador de robots.txt

**Monitoramento:**
- Verificar regularmente se o Googlebot consegue acessar recursos necessários
- Monitorar erros de rastreamento no Google Search Console

### 11.4 Implementação de Estrutura de URL Clara e Otimizada

**Princípios de URL Structure:**
1. **URLs legíveis e descritivas**
2. **Hierarquia clara**
3. **Keywords relevantes**
4. **URLs únicas**
5. **Sem parâmetros desnecessários**

**Estrutura de URL por Tipo de Página:**

**Página Inicial:**
- URL: https://qblox.com.br/

**Categorias:**
- Formato: https://qblox.com.br/[categoria-slug]/
- Exemplos:
  + https://qblox.com.br/boneco-de-montar-ninjago/
  + https://qblox.com.br/super-herois/
  + https://qblox.com.br/roblox/
  + https://qblox.com.br/series-da-tv/
  + https://qblox.com.br/aventura/
  + https://qblox.com.br/tematicos/
  + https://qblox.com.br/lancamentos/
  + https://qblox.com.br/monte-sua-colecao/
  + https://qblox.com.br/ofertas-especiais/

**Produtos:**
- Formato: https://qblox.com.br/[categoria-slug]/[produto-slug]/
- Exemplos:
  + https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/
  + https://qblox.com.br/super-herois/boneco-homem-aranha/
  + https://qblox.com.br/roblox/boneco-roblox-ninja/

**Páginas Institucionais:**
- Formato: https://qblox.com.br/[pagina-slug]/
- Exemplos:
  + https://qblox.com.br/sobre-nos/
  + https://qblox.com.br/contato/
  + https://qblox.com.br/politica-de-privacidade/
  + https://qblox.com.br/termos-de-uso/
  + https://qblox.com.br/politica-de-troca-e-devolucao/

**Blog (se aplicável):**
- Formato: https://qblox.com.br/blog/[post-slug]/
- Exemplo: https://qblox.com.br/blog/como-montar-colecao-lego/

**Regras de Slug:**
1. **Apenas letras minúsculas**
2. **Sem acentos ou caracteres especiais**
3. **Palavras separadas por hífen (-)**
4. **Máximo de 3-5 palavras**
5. **Incluir keyword principal**
6. **Evitar stop words (de, da, do, para, etc.) quando possível**

**Exemplos de Conversão:**
- Boneco de Montar Ninjago → boneco-de-montar-ninjago
- NinjaBlox Smoken → ninjablox-smoken
- Super-Heróis → super-herois
- Monte sua Coleção → monte-sua-colecao

**Redirecionamentos:**
- Implementar redirecionamentos 301 para URLs antigas
- Manter histórico de URLs para evitar links quebrados
- Configurar canonical tags para evitar conteúdo duplicado

**Canonical Tags:**
```html
<link rel=canonical href=https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/ />
```

**Breadcrumbs:**
- Implementar breadcrumbs estruturados
- Exemplo:
  + Home > Boneco de Montar Ninjago > NinjaBlox Smoken
- Markup Schema.org:

```json
{
  @context: https://schema.org,
  @type: BreadcrumbList,
  itemListElement: [
    {
      @type: ListItem,
      position: 1,
      name: Home,
      item: https://qblox.com.br/
    },
    {
      @type: ListItem,
      position: 2,
      name: Boneco de Montar Ninjago,
      item: https://qblox.com.br/boneco-de-montar-ninjago/
    },
    {
      @type: ListItem,
      position: 3,
      name: NinjaBlox Smoken,
      item: https://qblox.com.br/boneco-de-montar-ninjago/ninjablox-smoken/
    }
  ]
}
```

**Validação de URLs:**
- Todas as URLs devem ser únicas
- Não deve haver URLs duplicadas
- URLs devem ser permanentes (não mudar sem redirecionamento)
- URLs devem ser case-insensitive (tratar maiúsculas e minúsculas como iguais)

**Gerenciamento no Admin:**
- Campo de slug editável ao criar/editar produtos e categorias
- Validação automática de slug único
- Sugestão automática de slug baseada no nome
- Preview da URL final
- Histórico de slugs anteriores
- Configuração de redirecionamentos 301

## 12. Imagens de Referência
1. image.png