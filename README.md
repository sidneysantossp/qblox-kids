# QBlox Kids - E-commerce Infantil

Plataforma de e-commerce especializada na venda de bonecos de montar tipo LEGO para o público infantil.

## 🚀 Funcionalidades

### Catálogo de Produtos
- Navegação por categorias (Super Heróis, Roblox, Séries da TV, Aventura, Temáticos, Lançamentos)
- Página inicial com carrosséis de produtos
- Página de detalhes do produto com galeria de imagens
- Sistema de busca
- Filtros por categoria

### Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de frete (grátis acima de R$ 99)
- Notificações com fundo verde claro ao adicionar produtos
- Breadcrumb de navegação

### Autenticação
- Sistema de login e registro
- Perfil de usuário com dados de endereço
- Auto-preenchimento de endereço via CEP (API ViaCEP)
- Foco automático no campo de número após preencher CEP

### Checkout e Pagamento
- Verificação de autenticação (redireciona para login se necessário)
- Auto-preenchimento de dados do usuário
- Integração com Stripe para pagamentos
- Sistema de cupons de desconto
- Cálculo automático de frete
- Breadcrumb de navegação

### Cupons Disponíveis
- `BEMVINDO10` - 10% de desconto
- `FRETE20` - R$ 20,00 de desconto
- `NATAL15` - 15% de desconto

## 🎨 Design
- Cores vibrantes: Laranja (#FF6B35), Azul (#2196F3), Amarelo (#FFC107), Vermelho (#F44336)
- Layout responsivo com grid
- Carrosséis rotativos
- Animações suaves
- Bordas arredondadas (12px)

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Roteamento**: React Router
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Pagamentos**: Stripe
- **API Externa**: ViaCEP (auto-completar endereço)

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Validar build localmente
pnpm preview
```

## 🚀 Deploy em Apache/XAMPP

A aplicação é uma SPA React + Vite publicada como arquivos estáticos.

### Fluxo recomendado

```bash
pnpm build
```

Depois publique o conteúdo da pasta `dist/` na raiz do domínio configurado no Apache.

### Rewrite para SPA

O arquivo `public/.htaccess` já inclui o fallback necessário para rotas como:

- `/checkout`
- `/produto/:id`
- `/admin`
- `/central-de-ajuda`

Sem esse rewrite, refresh e acesso direto a rotas internas retornarão 404 no Apache.

## ⚙️ Configuração

### 1. Variáveis de Ambiente

O arquivo `.env` já está configurado com:

```env
VITE_APP_ID=app-8f4dwzp7bfup
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
```

### 2. Configurar Pagamentos

#### Asaas (gateway principal no lançamento)

1. Acesse `/admin/pagamentos`
2. Preencha `asaas_api_key`
3. Escolha `sandbox` ou `production`
4. Salve as configurações

O checkout principal usa Asaas para PIX, boleto e cartão.

#### Stripe (suporte legado)

O projeto ainda contém integração com Stripe, mas ela não é o fluxo principal do go-live.

### 3. Banco de Dados Supabase

O projeto já está configurado com as seguintes tabelas:

- `products` - Produtos do catálogo
- `cart_items` - Itens do carrinho
- `profiles` - Perfis de usuários com endereço
- `coupons` - Cupons de desconto
- `orders` - Pedidos realizados
  - Campos Stripe legados: `stripe_session_id`, `stripe_payment_intent_id`
  - Campos Asaas: `asaas_payment_id`, `asaas_invoice_url`, `asaas_bank_slip_url`, `asaas_pix_qr_code`, `asaas_pix_copy_paste`
  - Informações do cliente: `customer_email`, `customer_name`
  - Status: `pending`, `completed`, `cancelled`, `refunded`
  - Timestamps: `created_at`, `updated_at`, `completed_at`

As migrações são aplicadas automaticamente.

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Checkout sem login**: Usuário é redirecionado para `/login`
2. **Login**: Usuário faz login e retorna para o checkout
3. **Registro**: Novo usuário preenche dados pessoais e endereço
4. **Auto-preenchimento**: Dados são carregados automaticamente no checkout

### CEP Auto-complete

Ao digitar o CEP no formulário de registro:
1. Sistema busca o endereço na API ViaCEP
2. Preenche automaticamente: rua, bairro, cidade e estado
3. Foco é movido para o campo "Número"
4. Usuário completa apenas número e complemento

## 💳 Sistema de Pagamento

### Asaas Integration

O checkout principal usa Asaas com os seguintes passos:

1. **Checkout**: Usuário informa entrega, frete e método de pagamento
2. **Criação da cobrança**: O frontend chama a Edge Function `create_asaas_payment`
3. **Pagamento**: O cliente conclui PIX, boleto ou cartão
4. **Verificação**: A página `/pagamento-asaas` consulta o status da cobrança
5. **Confirmação**: O pedido é atualizado conforme o retorno do Asaas
6. **Histórico**: O pedido fica disponível em "Meus Pedidos"

### Funcionalidades de Pagamento

- ✅ **PIX, boleto e cartão** via Asaas
- ✅ **Verificação de pagamento** via Edge Function
- ✅ **Histórico de pedidos** com dados do gateway principal
- ✅ **Painel Admin** para configurar credenciais do Asaas
- ✅ **Fluxo de pagamento hospedado pelo backend Supabase**

### Stripe (legado)

O projeto ainda contém integração com Stripe para compatibilidade, mas o lançamento inicial deve operar com Asaas como fluxo principal.

## 🎫 Sistema de Cupons

### Como Usar

1. Na página de checkout, localize o campo "Cupom de Desconto"
2. Digite o código do cupom (ex: `BEMVINDO10`)
3. Clique em "Aplicar"
4. Desconto será aplicado automaticamente no total

### Tipos de Desconto

- **Percentual**: Desconto em % sobre o subtotal
- **Fixo**: Valor fixo em R$ de desconto

## 📱 Páginas

- `/` - Página inicial
- `/produto/:id` - Detalhes do produto
- `/categoria/:category` - Produtos por categoria
- `/busca` - Busca de produtos
- `/carrinho` - Carrinho de compras
- `/checkout` - Finalizar compra (requer login)
- `/login` - Login
- `/registro` - Criar conta

## 🎯 Próximos Passos

Para colocar em produção:

1. **Stripe Backend**: Implementar Edge Function para processar pagamentos
2. **Webhooks**: Configurar webhooks do Stripe para atualizar status dos pedidos
3. **E-mail**: Enviar confirmação de pedido por e-mail
4. **Rastreamento**: Sistema de rastreamento de pedidos
5. **Admin Panel**: Painel administrativo para gerenciar produtos e pedidos
6. **Estoque**: Controle de estoque em tempo real
7. **Avaliações**: Sistema de avaliações de produtos

## 📄 Licença

© 2025 QBlox Kids - Todos os direitos reservados
