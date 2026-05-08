# Guia de Gerenciamento de Hero Banners

## ✅ SISTEMA JÁ IMPLEMENTADO

O sistema de gerenciamento de Hero Banners (Full Banner) está **completamente implementado e funcional**, conectado ao painel admin para gerenciamento completo das imagens e conteúdo.

---

## 🎯 FUNCIONALIDADES DISPONÍVEIS

### 1. Gerenciamento Completo via Admin
- ✅ Criar novos banners
- ✅ Editar banners existentes
- ✅ Excluir banners
- ✅ Ativar/desativar banners
- ✅ Upload de imagens de fundo
- ✅ Definir ordem de exibição
- ✅ Configurar textos e links

### 2. Campos Editáveis
- **Título**: Texto principal do banner (suporta formatação com pontos)
- **Subtítulo**: Texto secundário (aparece em caixa vermelha)
- **Texto do Botão**: Label do botão CTA
- **Link do Botão**: URL de destino ao clicar
- **Imagem de Fundo**: Upload de imagem (PNG/JPG até 5MB)
- **Ordem de Exibição**: Controla a sequência no carrossel
- **Status**: Ativo/Inativo

### 3. Exibição Automática
- ✅ Homepage carrega automaticamente o banner ativo
- ✅ Prioriza por ordem de exibição
- ✅ Fallback para valores padrão se não houver banner
- ✅ Loading state durante carregamento

---

## 📍 COMO ACESSAR

### Painel Admin
1. Acesse: `/admin`
2. Faça login com credenciais de administrador
3. No menu lateral, clique em **"Banners Hero"**
4. Você será direcionado para: `/admin/banners`

### Menu Lateral
O link está localizado no menu lateral do admin:
```
📊 Dashboard
📦 Produtos
🛒 Pedidos
👥 Usuários
📁 Categorias
🎟️ Cupons
🖼️ Banners Hero  ← AQUI
📐 Seções Home
📝 Blog
💳 Pagamentos
📈 Relatórios
⚙️ Configurações
💬 WhatsApp
```

---

## 🎨 COMO CRIAR UM NOVO BANNER

### Passo 1: Acessar Criação
1. Vá para `/admin/banners`
2. Clique no botão **"+ Novo Banner"** (canto superior direito)
3. Você será direcionado para `/admin/banners/novo`

### Passo 2: Preencher Informações

#### Título *
- **Campo obrigatório**
- Exemplo: `COLECIONE. MONTE. AVENTURE-SE!`
- **Dica**: Use pontos (.) para separar partes do título
  - Primeira parte: texto menor
  - Segunda parte: texto maior e amarelo (destaque)
  - Terceira parte: texto médio

#### Subtítulo
- Campo opcional
- Exemplo: `MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!`
- Aparece em caixa vermelha abaixo do título

#### Texto do Botão
- Campo opcional
- Exemplo: `VER LANÇAMENTOS`
- Padrão: `VER LANÇAMENTOS`

#### Link do Botão
- Campo opcional
- Exemplo: `/categoria/lancamentos`
- Pode ser qualquer URL interna ou externa

#### Imagem de Fundo
- Campo opcional
- **Formatos aceitos**: PNG, JPG, JPEG, WebP
- **Tamanho máximo**: 5MB
- **Recomendação**: 1920x400px (proporção 16:9)
- **Efeito**: Imagem aparece com opacidade 20% sobre gradiente azul

**Como fazer upload:**
1. Clique na área de upload
2. Selecione a imagem do seu computador
3. Aguarde o preview aparecer
4. Para remover: clique no X no canto da imagem

#### Ordem de Exibição
- Campo numérico
- Padrão: 0
- Menor número = maior prioridade
- Usado para ordenar múltiplos banners no carrossel

#### Banner Ativo
- Switch (liga/desliga)
- Padrão: Ativo
- Apenas banners ativos aparecem na homepage

### Passo 3: Salvar
1. Clique em **"Salvar"**
2. Aguarde o upload da imagem (se houver)
3. Você será redirecionado para a lista de banners
4. Mensagem de sucesso aparecerá

---

## ✏️ COMO EDITAR UM BANNER

### Método 1: Via Lista
1. Vá para `/admin/banners`
2. Localize o banner que deseja editar
3. Clique no ícone de **lápis (Edit)** no card do banner
4. Edite os campos desejados
5. Clique em **"Salvar"**

### Método 2: Via URL Direta
- Acesse: `/admin/banners/{id-do-banner}`

### Campos Editáveis
- Todos os campos podem ser editados
- Imagem pode ser substituída fazendo novo upload
- Para remover imagem: clique no X e salve sem nova imagem

---

## 🔄 ATIVAR/DESATIVAR BANNER

### Via Toggle Rápido
1. Vá para `/admin/banners`
2. Localize o banner
3. Clique no ícone de **olho (Eye/EyeOff)**
4. Banner será ativado/desativado instantaneamente
5. Mensagem de confirmação aparecerá

### Via Edição
1. Edite o banner
2. Use o switch "Banner Ativo"
3. Salve as alterações

### Comportamento
- **Ativo**: Banner aparece na homepage
- **Inativo**: Banner não aparece, mas fica salvo no sistema

---

## 🗑️ COMO EXCLUIR UM BANNER

### Passo a Passo
1. Vá para `/admin/banners`
2. Localize o banner que deseja excluir
3. Clique no ícone de **lixeira (Trash)**
4. Confirme a exclusão no diálogo
5. Banner será removido permanentemente

### ⚠️ ATENÇÃO
- **Ação irreversível**: Não é possível recuperar após exclusão
- Imagem permanece no storage (não é deletada automaticamente)
- Se o banner estava ativo, o próximo na ordem será exibido

---

## 📊 VISUALIZAÇÃO NA HOMEPAGE

### Como o Banner Aparece
O banner é exibido no topo da homepage, logo após o header:

```
┌─────────────────────────────────────────────────────┐
│  TopBar (preto)                                     │
├─────────────────────────────────────────────────────┤
│  BrickStoreHeader (branco)                          │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐ │
│  │  HERO BANNER (azul gradiente)                 │ │
│  │                                                │ │
│  │  COLECIONE.                                    │ │
│  │  MONTE.  ← amarelo, maior                     │ │
│  │  AVENTURE-SE!                                  │ │
│  │                                                │ │
│  │  [MINIFIGURAS ÚNICAS...] ← caixa vermelha     │ │
│  │                                                │ │
│  │  [VER LANÇAMENTOS] ← botão amarelo            │ │
│  │                                                │ │
│  │  ● ○ ○ ○  ← indicadores carrossel             │ │
│  └───────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│  CategoryStrip (círculos de categorias)            │
└─────────────────────────────────────────────────────┘
```

### Lógica de Exibição
1. Sistema busca banners com `is_active = true`
2. Ordena por `display_order` (ascendente)
3. Exibe o primeiro da lista
4. Se não houver banner ativo, usa valores padrão

### Valores Padrão (Fallback)
Se não houver banner cadastrado:
- **Título**: "COLECIONE. MONTE. AVENTURE-SE!"
- **Subtítulo**: "MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!"
- **Botão**: "VER LANÇAMENTOS"
- **Link**: "/categoria/lancamentos"
- **Imagem**: Sem imagem (apenas gradiente)

---

## 🎨 DESIGN E ESTILO

### Cores
- **Gradiente de fundo**: Azul (#0057D9 → #003A99)
- **Título**: Branco
- **Destaque (meio)**: Amarelo (#FFD200)
- **Subtítulo**: Caixa vermelha (#E52421)
- **Botão**: Amarelo (#FFD200)
- **Imagem**: Opacidade 20% sobre gradiente

### Elementos Decorativos
- Blocos amarelos flutuantes (opacidade 10%)
- Gradiente radial central
- Placeholders de minifiguras (laterais, desktop only)
- Indicadores de carrossel (4 pontos)

### Responsividade
- **Desktop**: Altura 380px, layout horizontal
- **Mobile**: Altura 420px, layout vertical
- **Título**: 
  - Desktop: 44px / 68px / 48px
  - Mobile: 32px / 48px / 36px

---

## 🔧 ESTRUTURA TÉCNICA

### Banco de Dados
**Tabela**: `hero_banners`

**Campos**:
```sql
id              uuid PRIMARY KEY
title           text NOT NULL
subtitle        text
image_url       text
link_url        text
button_text     text
display_order   integer DEFAULT 0
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

**Índices**:
- `idx_hero_banners_order` em (display_order, is_active)

**RLS Policies**:
- Leitura pública: Qualquer um pode ver banners ativos
- Escrita admin: Apenas admins podem criar/editar/excluir

### Storage
**Bucket**: `banners`

**Configuração**:
- Público (public: true)
- Tamanho máximo: 5MB por arquivo
- Formatos aceitos: image/*

**Caminho dos arquivos**:
```
banners/
  └── {timestamp}_{filename}
```

### Componentes

**Frontend**:
- `HeroBanner.tsx`: Componente de exibição na homepage
- Carrega dados via Supabase client
- useEffect para buscar banner ativo
- Loading state e fallback

**Admin**:
- `AdminBannersPage.tsx`: Lista de banners
- `BannerFormPage.tsx`: Formulário de criação/edição
- Upload de imagem via `uploadImage()` helper
- Validação com Zod schema

---

## 📝 EXEMPLOS DE USO

### Exemplo 1: Banner de Lançamento
```
Título: NOVIDADES. CHEGARAM. CONFIRA!
Subtítulo: SUPER-HERÓIS EXCLUSIVOS DA MARVEL
Botão: VER NOVIDADES
Link: /categoria/super-herois
Imagem: banner-marvel.jpg
Ordem: 1
Status: Ativo
```

### Exemplo 2: Banner de Promoção
```
Título: PROMOÇÃO. IMPERDÍVEL. APROVEITE!
Subtítulo: ATÉ 50% OFF EM KITS SELECIONADOS
Botão: VER OFERTAS
Link: /ofertas-especiais
Imagem: banner-promo.jpg
Ordem: 2
Status: Ativo
```

### Exemplo 3: Banner de Coleção
```
Título: MONTE. SUA. COLEÇÃO!
Subtítulo: KITS EXCLUSIVOS PARA COLECIONADORES
Botão: EXPLORAR KITS
Link: /categoria/monte-sua-colecao
Imagem: banner-colecao.jpg
Ordem: 3
Status: Ativo
```

---

## 🎯 BOAS PRÁTICAS

### Títulos
- ✅ Use pontos para criar ritmo visual
- ✅ Mantenha conciso (3-5 palavras por parte)
- ✅ Use verbos de ação (MONTE, COLECIONE, EXPLORE)
- ❌ Evite textos muito longos

### Subtítulos
- ✅ Complemente o título
- ✅ Destaque benefício ou urgência
- ✅ Use CAPS para impacto
- ❌ Não repita informação do título

### Botões
- ✅ Use verbos de ação (VER, EXPLORAR, COMPRAR)
- ✅ Seja específico (VER LANÇAMENTOS vs VER MAIS)
- ✅ Mantenha curto (2-3 palavras)
- ❌ Evite textos genéricos

### Imagens
- ✅ Use imagens de alta qualidade
- ✅ Teste contraste com texto branco
- ✅ Prefira imagens horizontais (16:9)
- ✅ Otimize antes do upload (comprima)
- ❌ Evite imagens muito escuras ou claras
- ❌ Não use imagens com muito texto

### Ordem de Exibição
- ✅ 0 = Banner principal (mais importante)
- ✅ 1, 2, 3... = Banners secundários
- ✅ Mantenha sequência lógica
- ✅ Atualize ao adicionar novos

---

## 🔍 TROUBLESHOOTING

### Banner não aparece na homepage
**Possíveis causas:**
1. Banner está inativo → Ative via toggle
2. Ordem muito alta → Ajuste display_order
3. Erro no carregamento → Verifique console do navegador
4. Problema de permissão → Verifique RLS policies

### Imagem não carrega
**Possíveis causas:**
1. Arquivo muito grande → Reduza para menos de 5MB
2. Formato inválido → Use PNG ou JPG
3. Erro no upload → Tente novamente
4. URL quebrada → Faça novo upload

### Texto não aparece corretamente
**Possíveis causas:**
1. Título sem pontos → Adicione pontos para formatação
2. Texto muito longo → Reduza tamanho
3. Caracteres especiais → Use apenas texto simples

### Botão não funciona
**Possíveis causas:**
1. Link vazio → Preencha link_url
2. URL inválida → Verifique formato (/categoria/...)
3. Página não existe → Crie a página de destino

---

## 📈 MÉTRICAS E ANALYTICS

### Dados Disponíveis
- Número total de banners
- Banners ativos vs inativos
- Data de criação de cada banner
- Última atualização

### Recomendações
- Monitore cliques no botão CTA (implementar tracking)
- Teste A/B com diferentes títulos
- Rotacione banners regularmente
- Mantenha 3-5 banners ativos para carrossel

---

## 🚀 PRÓXIMOS PASSOS (Futuro)

### Melhorias Planejadas
1. 📝 Carrossel automático (rotação de banners)
2. 📝 Analytics de cliques por banner
3. 📝 Agendamento de banners (data início/fim)
4. 📝 Preview em tempo real no formulário
5. 📝 Templates pré-definidos
6. 📝 Vídeos de fundo (além de imagens)
7. 📝 Animações personalizadas
8. 📝 Segmentação por público

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de publicar um novo banner:
- [ ] Título preenchido e formatado com pontos
- [ ] Subtítulo complementa o título
- [ ] Botão tem texto claro e acionável
- [ ] Link aponta para página existente
- [ ] Imagem de alta qualidade (se houver)
- [ ] Imagem otimizada (< 5MB)
- [ ] Ordem de exibição definida
- [ ] Banner marcado como ativo
- [ ] Testado em desktop e mobile
- [ ] Verificado contraste de texto

---

## 📞 SUPORTE

### Problemas Técnicos
- Verifique console do navegador (F12)
- Verifique logs do Supabase
- Teste em modo anônimo (limpar cache)

### Dúvidas sobre Uso
- Consulte este guia
- Teste em ambiente de desenvolvimento
- Faça backup antes de alterações grandes

---

**Data de Criação:** 2025-12-22  
**Versão:** 1.0  
**Status:** ✅ Sistema Completo e Funcional  
**Localização Admin:** `/admin/banners`  
**Componente Frontend:** `HeroBanner.tsx`
