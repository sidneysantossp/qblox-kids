# Banners Hero com Overlay e CTA - Implementação Completa

## Visão Geral
Os banners hero da página inicial agora suportam títulos (headlines), subtítulos (subheadlines) e botões de chamada para ação (CTA), todos customizáveis através do painel administrativo. As imagens possuem um overlay escuro para destacar o texto branco.

## Funcionalidades Implementadas

### 1. Estrutura do Banner
Cada banner pode conter:
- **Título (Headline)**: Texto principal em destaque (obrigatório)
- **Subtítulo (Subheadline)**: Texto descritivo complementar (opcional)
- **Imagem**: Imagem de fundo do banner (obrigatório)
- **Botão CTA**: Texto do botão de ação (opcional)
- **Link**: URL para onde o botão direciona (opcional)
- **Ordem de Exibição**: Controla a sequência dos banners
- **Status**: Ativo/Inativo

### 2. Efeito Visual
- **Overlay Gradiente**: Aplicado da esquerda para direita (preto com transparência)
  - `from-black/70 via-black/50 to-transparent`
- **Texto Branco**: Com sombra para melhor legibilidade
- **Botão CTA**: Estilizado com sombra e efeito hover

### 3. Painel Administrativo

#### Acessar Gerenciamento de Banners
1. Faça login como administrador
2. Acesse: **Painel Admin > Banners Hero**
3. URL: `/admin/banners`

#### Criar Novo Banner
1. Clique em "Novo Banner"
2. Preencha os campos:
   - **Título**: Texto principal (obrigatório)
   - **Subtítulo**: Texto complementar (opcional)
   - **Imagem**: Upload ou URL (obrigatório)
   - **Texto do Botão**: Ex: "Ver Produtos" (opcional)
   - **Link do Botão**: Ex: "/categoria/Super Heróis" (opcional)
   - **Ordem de Exibição**: Número para ordenação
   - **Status**: Ativo/Inativo
3. Clique em "Salvar"

#### Editar Banner Existente
1. Na lista de banners, clique no ícone de lápis (Editar)
2. Modifique os campos desejados
3. Clique em "Salvar"

#### Excluir Banner
1. Na lista de banners, clique no ícone de lixeira (Excluir)
2. Confirme a exclusão

### 4. Upload de Imagens

#### Opção 1: Upload de Arquivo
- Clique em "Selecionar Imagem"
- Escolha uma imagem do seu computador
- Formatos aceitos: JPG, PNG, WebP, GIF
- Tamanho máximo: 5MB
- Recomendado: 1920x500px

#### Opção 2: URL Manual
- Cole a URL de uma imagem hospedada externamente
- Ex: `https://exemplo.com/banner.jpg`

### 5. Banners de Exemplo
Três banners foram pré-configurados:

1. **Novos Bonecos de Super Heróis!**
   - Subtítulo: "Descubra nossa coleção exclusiva com até 40% de desconto"
   - CTA: "Ver Coleção" → `/categoria/Super Heróis`

2. **Monte Sua Coleção Personalizada**
   - Subtítulo: "Crie combinações únicas com nossos bonecos de montar"
   - CTA: "Começar Agora" → `/monte-sua-colecao`

3. **Lançamentos Exclusivos**
   - Subtítulo: "Seja o primeiro a ter os novos personagens da temporada"
   - CTA: "Explorar" → `/categoria/Lançamentos`

## Estrutura Técnica

### Banco de Dados
Tabela: `hero_banners`
```sql
- id: UUID (PK)
- title: TEXT (obrigatório)
- subtitle: TEXT (opcional)
- image_url: TEXT (obrigatório)
- link_url: TEXT (opcional)
- button_text: TEXT (opcional)
- display_order: INTEGER
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage
Bucket: `images`
- Público para leitura
- Upload restrito a administradores
- Limite: 5MB por arquivo
- Formatos: JPEG, PNG, WebP, GIF

### Componentes

#### HomePage.tsx
- Busca banners ativos do banco de dados
- Exibe com overlay e conteúdo customizado
- Fallback para imagens padrão se não houver banners

#### AdminBanners.tsx
- Interface completa de CRUD
- Formulário com todos os campos
- Upload de imagens integrado
- Validação de campos obrigatórios

#### ImageUpload.tsx
- Componente reutilizável para upload
- Suporta drag & drop visual
- Preview da imagem
- Opção de URL manual

## Responsividade

### Desktop (xl: ≥1280px)
- Altura do banner: 500px
- Título: text-6xl
- Subtítulo: text-2xl
- Botão: size-lg

### Tablet (md: 768px-1279px)
- Altura do banner: 450px
- Título: text-5xl
- Subtítulo: text-xl
- Botão: size-lg

### Mobile (<768px)
- Altura do banner: 500px
- Título: text-4xl
- Subtítulo: text-lg
- Botão: size-lg

## Boas Práticas

### Conteúdo
- **Título**: Máximo 60 caracteres para melhor legibilidade
- **Subtítulo**: Máximo 120 caracteres
- **CTA**: Verbos de ação (Ver, Explorar, Descobrir, Comprar)

### Imagens
- Resolução recomendada: 1920x500px
- Formato preferido: WebP (melhor compressão)
- Evite imagens com texto importante nas bordas
- Teste em diferentes dispositivos

### Overlay
- O gradiente está otimizado para texto à esquerda
- Se precisar texto centralizado, ajuste o gradiente em `HomePage.tsx`
- Cores do overlay podem ser customizadas na classe `bg-gradient-to-r`

## Troubleshooting

### Banner não aparece
- Verifique se o status está "Ativo"
- Confirme que a URL da imagem está acessível
- Verifique o console do navegador para erros

### Imagem não carrega
- Teste a URL da imagem diretamente no navegador
- Verifique permissões do bucket de storage
- Confirme que o formato é suportado

### Texto não está visível
- Verifique se o overlay está aplicado
- Ajuste a opacidade do overlay se necessário
- Use imagens com áreas mais claras para o texto

## Próximos Passos Sugeridos

1. **Animações**: Adicionar transições suaves ao trocar banners
2. **A/B Testing**: Testar diferentes CTAs e medir conversão
3. **Agendamento**: Permitir agendar banners para datas específicas
4. **Analytics**: Rastrear cliques nos CTAs
5. **Vídeo Background**: Suportar vídeos como fundo dos banners
