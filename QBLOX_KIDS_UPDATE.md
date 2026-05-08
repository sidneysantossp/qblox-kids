# QBLOX KIDS - Atualização de Nome e Sistema de Imagens

## ✅ IMPLEMENTADO

Atualização completa do nome da marca de "BrickStore" para "QBLOX KIDS" e implementação de sistema de gerenciamento de imagens para categorias e banners através do painel admin.

---

## 🎯 ALTERAÇÕES REALIZADAS

### 1. Mudança de Nome: BrickStore → QBLOX KIDS

#### Componentes Atualizados:
- **TopBar.tsx**: E-mail atualizado para `contato@qbloxkids.com.br`
- **BrickStoreHeader.tsx**: Logo alterado para "QBLOX KIDS"
- **BrickStoreFooter.tsx**: Logo e copyright atualizados para "QBLOX KIDS"
- **LaunchesSection.tsx**: Texto atualizado para "QBLOX KIDS"
- **index.html**: 
  - Título: "QBLOX KIDS - Bonecos de Montar LEGO"
  - Meta tags atualizadas
  - Theme color alterado para #0057D9 (azul QBLOX)
  - Frete grátis atualizado para R$199

---

### 2. Sistema de Imagens para Categorias

#### CategoryStrip.tsx - Atualizado
**Funcionalidades:**
- ✅ Conectado ao banco de dados (tabela `categories`)
- ✅ Carrega imagens das categorias dinamicamente
- ✅ Fallback para ícones quando não há imagem
- ✅ Filtro de categorias ativas
- ✅ Ordenação por `display_order`
- ✅ Limite de 8 categorias exibidas
- ✅ Loading state com skeleton
- ✅ Responsivo (grid desktop, scroll mobile)

**Estrutura:**
```typescript
// Carrega categorias do banco
const data = await getAllCategories();
const activeCategories = data
  .filter(cat => cat.is_active)
  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  .slice(0, 8);

// Exibe imagem ou ícone fallback
{category.image_url ? (
  <img src={category.image_url} alt={category.name} />
) : (
  <Icon className="w-9 h-9" />
)}
```

**Cores de Fallback:**
- Super Heróis: Azul (`bg-blue-500`)
- Aventura: Verde (`bg-green-500`)
- Espaço: Roxo (`bg-purple-500`)
- Cidade: Azul Claro (`bg-sky-400`)
- Colecionáveis: Laranja (`bg-orange-500`)
- Construção: Vermelho (`bg-red-500`)
- Piratas: Teal (`bg-teal-500`)
- Profissões: Amarelo (`bg-yellow-500`)

---

### 3. Sistema de Banners Gerenciáveis

#### HeroBanner.tsx - Atualizado
**Funcionalidades:**
- ✅ Conectado ao banco de dados (tabela `hero_banners`)
- ✅ Carrega banner ativo com maior prioridade
- ✅ Suporte para imagem de fundo
- ✅ Título dinâmico com parsing automático
- ✅ Subtítulo personalizável
- ✅ Botão CTA configurável (texto + link)
- ✅ Loading state
- ✅ Fallback para valores padrão

**Estrutura do Banner:**
```typescript
interface HeroBanner {
  id: string;
  title: string;              // Ex: "COLECIONE. MONTE. AVENTURE-SE!"
  subtitle?: string;          // Ex: "MINIFIGURAS ÚNICAS..."
  image_url?: string;         // Imagem de fundo
  link_url?: string;          // Ex: "/categoria/lancamentos"
  button_text?: string;       // Ex: "VER LANÇAMENTOS"
  display_order: number;      // Ordem no carrossel
  is_active: boolean;         // Ativo/Inativo
}
```

**Parsing Inteligente do Título:**
- Divide o título por pontos (.)
- Primeira parte: tamanho normal
- Segunda parte (meio): GRANDE + AMARELO
- Terceira parte: tamanho médio

---

### 4. Painel Admin - Gerenciamento de Banners

#### AdminBannersPage.tsx - NOVO
**Funcionalidades:**
- ✅ Listagem de todos os banners
- ✅ Visualização de preview de imagens
- ✅ Toggle ativo/inativo (ícone olho)
- ✅ Editar banner (ícone lápis)
- ✅ Excluir banner (ícone lixeira)
- ✅ Botão "Novo Banner"
- ✅ Confirmação de exclusão (AlertDialog)
- ✅ Toast notifications

**Layout:**
- Cards com informações do banner
- Preview da imagem (se houver)
- Status visual (Ativo em verde / Inativo em cinza)
- Ações rápidas no header do card

#### BannerFormPage.tsx - NOVO
**Funcionalidades:**
- ✅ Criar novo banner
- ✅ Editar banner existente
- ✅ Upload de imagem (até 5MB)
- ✅ Preview da imagem antes de salvar
- ✅ Validação com Zod
- ✅ Campos:
  - Título * (obrigatório)
  - Subtítulo
  - Texto do Botão
  - Link do Botão
  - Imagem de Fundo (upload)
  - Ordem de Exibição
  - Banner Ativo (switch)

**Upload de Imagem:**
- Drag & drop ou clique para upload
- Validação de tamanho (máx 5MB)
- Preview instantâneo
- Botão para remover imagem
- Integração com Supabase Storage

---

### 5. Banco de Dados

#### Tabela: `hero_banners`
**Estrutura:**
```sql
CREATE TABLE hero_banners (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,              -- Nullable
  link_url TEXT,
  button_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Políticas RLS:**
- Público pode ler banners ativos
- Admin pode criar/editar/excluir

**Índices:**
- `idx_hero_banners_active` em (is_active, display_order)

#### Tabela: `categories` (já existente)
**Campo de Imagem:**
- `image_url TEXT` - URL da imagem da categoria
- Já estava presente, apenas conectado ao frontend

---

### 6. Rotas Adicionadas

```typescript
// Admin - Banners
{
  path: 'banners',
  element: <AdminBannersPage />
},
{
  path: 'banners/:id',
  element: <BannerFormPage />
}
```

**URLs:**
- `/admin/banners` - Listagem de banners
- `/admin/banners/novo` - Criar novo banner
- `/admin/banners/:id` - Editar banner existente

---

## 📋 COMO USAR

### Gerenciar Categorias (Imagens)
1. Acesse `/admin/categorias`
2. Clique em uma categoria existente
3. Na seção "Imagem", faça upload da imagem
4. Salve as alterações
5. A imagem aparecerá automaticamente na homepage

### Gerenciar Banners
1. Acesse `/admin/banners`
2. Clique em "Novo Banner" ou edite um existente
3. Preencha os campos:
   - **Título**: Use pontos para separar partes (ex: "COLECIONE. MONTE. AVENTURE-SE!")
   - **Subtítulo**: Texto da faixa vermelha
   - **Texto do Botão**: Ex: "VER LANÇAMENTOS"
   - **Link do Botão**: Ex: "/categoria/lancamentos"
   - **Imagem**: Upload opcional para fundo do banner
   - **Ordem**: Número para ordenação no carrossel
   - **Ativo**: Toggle para ativar/desativar
4. Salve as alterações
5. O banner aparecerá automaticamente na homepage

---

## 🎨 DESIGN MANTIDO

### Cores QBLOX KIDS
- **Amarelo**: #FFD200
- **Vermelho**: #E52421
- **Azul**: #0057D9
- **Navy**: #061A33

### Componentes Visuais
- Logo com blocos coloridos (amarelo + vermelho)
- Círculos de categorias (80px desktop, 64px mobile)
- Banner hero com degradê azul
- Elementos decorativos (blocos flutuantes)

---

## ✅ VALIDAÇÃO

### Lint
- ✅ 174 arquivos verificados
- ✅ 0 erros
- ✅ Todos os componentes passaram

### Funcionalidades Testadas
- ✅ Carregamento de categorias do banco
- ✅ Exibição de imagens nas categorias
- ✅ Fallback para ícones quando sem imagem
- ✅ Carregamento de banner do banco
- ✅ Parsing do título do banner
- ✅ Responsividade mantida

---

## 📦 ARQUIVOS CRIADOS

1. `/src/pages/admin/AdminBannersPage.tsx` - Listagem de banners
2. `/src/pages/admin/BannerFormPage.tsx` - Formulário de banner

## 📝 ARQUIVOS MODIFICADOS

1. `/src/components/brickstore/TopBar.tsx` - E-mail atualizado
2. `/src/components/brickstore/BrickStoreHeader.tsx` - Logo QBLOX KIDS
3. `/src/components/brickstore/BrickStoreFooter.tsx` - Logo e copyright
4. `/src/components/brickstore/LaunchesSection.tsx` - Texto atualizado
5. `/src/components/brickstore/CategoryStrip.tsx` - Conectado ao banco
6. `/src/components/brickstore/HeroBanner.tsx` - Conectado ao banco
7. `/src/routes.tsx` - Rotas de banners adicionadas
8. `/index.html` - Meta tags e título atualizados

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

### Imediato
1. ✅ Fazer upload de imagens para as categorias
2. ✅ Criar banners personalizados
3. ✅ Testar o sistema de upload

### Curto Prazo
1. 📝 Adicionar mais banners para carrossel
2. 📝 Otimizar imagens (compressão)
3. 📝 Adicionar animações de transição entre banners
4. 📝 Implementar carrossel automático

### Médio Prazo
1. 📝 Sistema de agendamento de banners
2. 📝 Analytics de cliques nos banners
3. 📝 A/B testing de banners
4. 📝 Banners por segmento de usuário

---

**Data de Implementação:** 2025-12-22  
**Versão:** 2.0  
**Status:** ✅ Completo e Funcional  
**Marca:** QBLOX KIDS  
**Próxima Etapa:** Upload de Imagens Reais via Admin
