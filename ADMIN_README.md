# Painel Administrativo - QBlox Kids

## Visão Geral

O painel administrativo oferece controle completo sobre todos os aspectos da plataforma QBlox Kids, incluindo gestão de produtos, pedidos, usuários, conteúdo e configurações.

## Acesso ao Painel

### URL
- **Produção**: `https://seu-dominio.com/admin`
- **Desenvolvimento**: `http://localhost:5173/admin`

### Requisitos de Acesso
1. Usuário deve estar autenticado
2. Usuário deve ter role `admin` no banco de dados

### Como Tornar um Usuário Admin

Execute no SQL Editor do Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_AQUI';
```

## Módulos Disponíveis

### 1. Dashboard
- **Rota**: `/admin`
- **Funcionalidades**:
  - Estatísticas gerais (produtos, pedidos, usuários, receita)
  - Pedidos recentes
  - Produtos com estoque baixo
  - Widgets informativos

### 2. Gestão de Produtos
- **Rota**: `/admin/produtos`
- **Funcionalidades**:
  - Listar todos os produtos
  - Criar novo produto
  - Editar produto existente
  - Excluir produto
  - Gerenciar estoque
  - Upload de imagens
  - Filtros e busca

### 3. Gestão de Pedidos
- **Rota**: `/admin/pedidos`
- **Funcionalidades**:
  - Listar todos os pedidos
  - Ver detalhes do pedido
  - Atualizar status do pedido
  - Filtrar por status
  - Buscar pedidos

### 4. Gestão de Usuários
- **Rota**: `/admin/usuarios`
- **Funcionalidades**:
  - Listar todos os usuários
  - Ver detalhes do usuário
  - Alterar role (user/admin)
  - Buscar usuários

### 5. Gestão de Categorias
- **Rota**: `/admin/categorias`
- **Funcionalidades**:
  - Listar categorias
  - Criar nova categoria
  - Editar categoria
  - Excluir categoria
  - Definir ordem de exibição
  - Ativar/desativar categoria

### 6. Gestão de Banners Hero
- **Rota**: `/admin/banners`
- **Funcionalidades**:
  - Listar banners da página inicial
  - Criar novo banner
  - Editar banner
  - Excluir banner
  - Upload de imagens
  - Definir ordem de exibição
  - Ativar/desativar banner

### 7. Gestão de Seções da Home
- **Rota**: `/admin/secoes`
- **Funcionalidades**:
  - Listar seções da página inicial
  - Criar nova seção
  - Editar seção
  - Excluir seção
  - Definir ordem de exibição
  - Ativar/desativar seção

### 8. Gestão de Blog
- **Rota**: `/admin/blog`
- **Funcionalidades**:
  - Listar posts do blog
  - Criar novo post
  - Editar post
  - Excluir post
  - Editor de texto rico
  - Upload de imagens
  - Publicar/despublicar

### 9. Gestão de Métodos de Pagamento
- **Rota**: `/admin/pagamentos`
- **Funcionalidades**:
  - Listar métodos de pagamento
  - Criar novo método
  - Editar método
  - Excluir método
  - Ativar/desativar método

### 10. Relatórios e Análises
- **Rota**: `/admin/relatorios`
- **Funcionalidades**:
  - Relatório de vendas
  - Total de vendas
  - Total de pedidos
  - Ticket médio
  - Exportar relatórios

## Recursos Técnicos

### Autenticação e Autorização
- Proteção de rotas com `ProtectedAdminRoute`
- Verificação de role no AuthContext
- Redirecionamento automático para login se não autenticado
- Redirecionamento para home se não for admin

### Layout
- Sidebar responsiva com navegação
- Menu mobile com Sheet component
- Link para voltar ao site
- Botão de logout

### Componentes Reutilizáveis
- **DataTable**: Tabela com busca, paginação e ações
- **Forms**: Formulários com validação usando react-hook-form
- **Dialogs**: Modais para criar/editar/excluir

### Upload de Imagens
- Supabase Storage buckets:
  - `products`: Imagens de produtos (5MB max)
  - `banners`: Imagens de banners (10MB max)
  - `blog`: Imagens de posts (5MB max)
- Formatos aceitos: JPEG, PNG, WebP, GIF
- URLs públicas geradas automaticamente

### API
- Todas as funções em `/src/db/admin-api.ts`
- Tratamento de erros
- Validação de dados
- Políticas RLS no Supabase

## Segurança

### Row Level Security (RLS)
Todas as tabelas administrativas têm políticas RLS que:
- Permitem leitura pública quando apropriado
- Restringem escrita apenas para admins
- Verificam role do usuário autenticado

### Storage Policies
- Leitura pública para todos os buckets
- Upload/delete apenas para admins
- Validação de tipos de arquivo
- Limite de tamanho de arquivo

## Desenvolvimento

### Adicionar Novo Módulo Admin

1. **Criar página** em `/src/pages/admin/`
2. **Adicionar rota** em `/src/routes.tsx`
3. **Adicionar item** no menu do `AdminLayout.tsx`
4. **Criar funções API** em `/src/db/admin-api.ts`
5. **Atualizar tipos** em `/src/types/index.ts` se necessário

### Estrutura de Arquivos
```
src/
├── pages/admin/
│   ├── AdminDashboard.tsx
│   ├── AdminProducts.tsx
│   ├── AdminOrders.tsx
│   ├── AdminUsers.tsx
│   ├── AdminCategories.tsx
│   ├── AdminBanners.tsx
│   ├── AdminSections.tsx
│   ├── AdminBlog.tsx
│   ├── AdminPayments.tsx
│   └── AdminReports.tsx
├── components/
│   ├── admin/
│   │   ├── ProtectedAdminRoute.tsx
│   │   └── DataTable.tsx
│   └── layouts/
│       └── AdminLayout.tsx
└── db/
    └── admin-api.ts
```

## Troubleshooting

### Não consigo acessar o painel admin
- Verifique se está autenticado
- Verifique se seu usuário tem role `admin` no banco de dados
- Limpe o cache do navegador

### Erro ao fazer upload de imagem
- Verifique o tamanho do arquivo (max 5-10MB)
- Verifique o formato (JPEG, PNG, WebP, GIF)
- Verifique as políticas de storage no Supabase

### Erro ao salvar dados
- Verifique as políticas RLS no Supabase
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique o console do navegador para erros

## Suporte

Para problemas ou dúvidas sobre o painel administrativo, consulte:
- Documentação do Supabase: https://supabase.com/docs
- Documentação do shadcn/ui: https://ui.shadcn.com
- Documentação do React Router: https://reactrouter.com
