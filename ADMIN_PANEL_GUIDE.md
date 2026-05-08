# Painel Administrativo - Kids Block Store

## Visão Geral

O painel administrativo da Kids Block Store é uma interface completa para gerenciar todos os aspectos da loja online, incluindo produtos, pedidos, usuários e configurações.

## Acesso ao Painel

### URL
```
https://seu-dominio.com/admin
```

### Requisitos
- Conta de usuário registrada
- Permissão de administrador (role: 'admin')

### Primeiro Acesso
O primeiro usuário a se registrar no sistema automaticamente recebe permissão de administrador. Usuários subsequentes precisam ter suas permissões alteradas por um administrador existente.

## Estrutura do Painel

### Layout
O painel utiliza um layout responsivo com:
- **Sidebar** (desktop): Menu lateral fixo com navegação
- **Menu Hambúrguer** (mobile): Menu deslizante acessível via botão
- **Área de Conteúdo**: Espaço principal para gerenciamento

### Navegação Principal
1. **Dashboard** - Visão geral e estatísticas
2. **Produtos** - Gerenciamento do catálogo
3. **Pedidos** - Acompanhamento de vendas
4. **Usuários** - Gerenciamento de clientes
5. **Categorias** - Organização de produtos
6. **Banners Hero** - Carrossel da página inicial
7. **Seções Home** - Configuração da homepage
8. **Blog** - Gerenciamento de conteúdo
9. **Pagamentos** - Configurações de pagamento
10. **Relatórios** - Análises e métricas

## Funcionalidades Principais

### 1. Gerenciamento de Produtos

#### Listar Produtos (`/admin/produtos`)
- Visualização em tabela com paginação
- Busca por nome de produto
- Informações exibidas:
  - Imagem do produto
  - Nome e categoria
  - Preço
  - Estoque (com alertas visuais)
  - Status de destaque
- Clique em qualquer linha para editar

#### Criar Produto (`/admin/produtos/novo`)
**Informações Básicas:**
- Nome do produto (mínimo 3 caracteres)
- Descrição detalhada (mínimo 10 caracteres)
- Categoria (seleção de categorias existentes)

**Preços e Estoque:**
- Preço atual (obrigatório)
- Preço original (opcional, para mostrar desconto)
- Quantidade em estoque

**Imagens:**
- Imagem principal (obrigatória)
- Até 8 imagens adicionais
- Upload direto para Supabase Storage
- Limite de 1MB por imagem
- Formatos aceitos: JPG, PNG, WebP

**Status:**
- ✅ Destaque - Exibir na seção de produtos em destaque
- ✅ Mais Vendido - Exibir na seção de mais vendidos
- ✅ Em Promoção - Exibir na seção de ofertas

#### Editar Produto (`/admin/produtos/:id`)
- Mesmos campos da criação
- Botão adicional para excluir produto
- Confirmação antes de excluir

### 2. Gerenciamento de Pedidos

#### Listar Pedidos (`/admin/pedidos`)
- Visualização em tabela com paginação
- Busca por ID do pedido
- Informações exibidas:
  - ID do pedido (8 primeiros caracteres)
  - Data de criação
  - Cliente (nome e email)
  - Método de pagamento
  - Valor total
  - Status com badge colorido
- Clique em qualquer linha para ver detalhes

#### Detalhes do Pedido (`/admin/pedidos/:id`)
**Informações do Pedido:**
- Lista completa de itens com imagens
- Quantidade e preços individuais
- Subtotal, frete e total

**Informações do Cliente:**
- Nome completo
- Email
- Telefone (se disponível)

**Endereço de Entrega:**
- Endereço completo formatado
- CEP, cidade e estado

**Gerenciamento:**
- Atualização de status do pedido:
  - Pendente
  - Processando
  - Enviado
  - Entregue
  - Cancelado
  - Reembolsado

**Informações de Pagamento:**
- Método utilizado (Cartão, PIX, Boleto)
- IDs de transação (Stripe ou Asaas)
- Links para comprovantes (quando aplicável)

### 3. Gerenciamento de Usuários

#### Listar Usuários (`/admin/usuarios`)
- Visualização em tabela com paginação
- Busca por nome
- Informações exibidas:
  - Nome completo
  - Nome de usuário
  - Telefone
  - Função (Admin/Usuário)
  - Data de cadastro
- Clique em qualquer linha para ver detalhes

#### Detalhes do Usuário (`/admin/usuarios/:id`)
**Informações do Usuário:**
- Nome completo
- Nome de usuário
- Telefone
- Data de cadastro
- ID do usuário

**Gerenciamento de Função:**
- Alternar entre "Usuário" e "Administrador"
- Atualização instantânea

**Histórico de Pedidos:**
- Lista de todos os pedidos do usuário
- Status e valores
- Clique para ver detalhes do pedido

**Estatísticas:**
- Total de pedidos realizados
- Total gasto
- Ticket médio

### 4. Gerenciamento de Categorias

#### Funcionalidades (`/admin/categorias`)
- Criar nova categoria
- Editar categoria existente
- Excluir categoria
- Definir ordem de exibição
- Ativar/desativar categoria

**Campos:**
- Nome da categoria
- Slug (URL amigável)
- Descrição
- Ícone (emoji ou URL)
- Ordem de exibição
- Status (ativo/inativo)

### 5. Dashboard

#### Métricas Principais (`/admin`)
- Total de produtos cadastrados
- Total de pedidos
- Total de usuários registrados
- Receita total

**Pedidos Recentes:**
- Últimos pedidos realizados
- Status e valores
- Acesso rápido aos detalhes

**Produtos com Estoque Baixo:**
- Alertas de produtos com estoque <= 10 unidades
- Acesso rápido para edição

## Recursos Técnicos

### Componentes Reutilizáveis

#### DataTable
Componente de tabela com:
- Paginação automática (10 itens por página)
- Busca integrada
- Ordenação
- Clique em linha para ação
- Coluna de ações customizável

#### AdminLayout
Layout padrão com:
- Sidebar responsiva
- Menu mobile com Sheet
- Navegação destacada
- Botões de ação (Ver Site, Sair)

#### ProtectedAdminRoute
Proteção de rotas que:
- Verifica autenticação
- Verifica permissão de admin
- Redireciona não autorizados

### Validação de Formulários

Todos os formulários utilizam:
- **react-hook-form** - Gerenciamento de estado
- **zod** - Validação de schema
- **shadcn/ui Form** - Componentes de formulário

### Upload de Imagens

Sistema de upload integrado:
- Validação de tamanho (máx. 1MB)
- Validação de formato
- Upload para Supabase Storage
- Preview antes do envio
- Gerenciamento de múltiplas imagens

### Notificações

Sistema de toast (sonner):
- Sucesso em operações
- Erros com mensagens claras
- Feedback instantâneo

## Permissões e Segurança

### Níveis de Acesso

**Administrador:**
- Acesso total ao painel admin
- Gerenciar produtos, pedidos, usuários
- Alterar permissões de outros usuários
- Visualizar relatórios e estatísticas

**Usuário:**
- Acesso apenas à área do cliente
- Visualizar próprios pedidos
- Gerenciar próprio perfil
- Realizar compras

### Proteção de Rotas

Todas as rotas `/admin/*` são protegidas por:
1. Verificação de autenticação
2. Verificação de role = 'admin'
3. Redirecionamento automático se não autorizado

### Políticas de Banco de Dados (RLS)

O Supabase Row Level Security garante que:
- Apenas admins podem modificar dados sensíveis
- Usuários só acessam seus próprios dados
- Operações são auditadas

## Fluxo de Trabalho Recomendado

### Configuração Inicial
1. Registrar primeiro usuário (torna-se admin automaticamente)
2. Criar categorias de produtos
3. Configurar métodos de pagamento
4. Adicionar banners da homepage

### Gerenciamento Diário
1. Verificar novos pedidos no Dashboard
2. Atualizar status dos pedidos
3. Responder a questões de clientes
4. Monitorar estoque baixo

### Adição de Produtos
1. Preparar imagens (máx. 1MB cada)
2. Acessar `/admin/produtos/novo`
3. Preencher informações básicas
4. Fazer upload das imagens
5. Configurar preços e estoque
6. Definir status (destaque, promoção, etc.)
7. Salvar produto

### Processamento de Pedidos
1. Acessar `/admin/pedidos`
2. Clicar no pedido para ver detalhes
3. Verificar itens e pagamento
4. Atualizar status conforme processamento:
   - Pendente → Processando
   - Processando → Enviado
   - Enviado → Entregue

## Solução de Problemas

### Não consigo acessar o painel admin
- Verifique se está logado
- Confirme que sua conta tem role = 'admin'
- Peça a outro admin para alterar suas permissões

### Erro ao fazer upload de imagem
- Verifique o tamanho (máx. 1MB)
- Confirme o formato (JPG, PNG, WebP)
- Tente uma imagem diferente
- Verifique conexão com internet

### Produto não aparece no site
- Confirme que o estoque > 0
- Verifique se a categoria está ativa
- Aguarde alguns segundos para cache atualizar

### Pedido não atualiza status
- Verifique conexão com internet
- Tente recarregar a página
- Confirme que tem permissão de admin

## Suporte Técnico

Para problemas técnicos ou dúvidas:
1. Consulte esta documentação
2. Verifique os logs do navegador (F12)
3. Entre em contato com o suporte técnico

## Atualizações Futuras

Funcionalidades planejadas:
- [ ] Editor visual de banners
- [ ] Sistema de cupons de desconto
- [ ] Relatórios avançados com gráficos
- [ ] Exportação de dados (CSV, PDF)
- [ ] Notificações por email
- [ ] Chat com clientes
- [ ] Gestão de estoque automática
- [ ] Integração com transportadoras

---

**Versão:** 1.0.0  
**Última Atualização:** Dezembro 2025  
**Desenvolvido para:** Kids Block Store
