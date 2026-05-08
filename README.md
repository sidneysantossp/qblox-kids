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
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

O arquivo `.env` já está configurado com:

```env
VITE_APP_ID=app-8f4dwzp7bfup
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
```

### 2. Configurar Stripe

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Acesse o Dashboard do Stripe
3. Vá em **Developers** > **API keys**
4. Copie a **Publishable key** (começa com `pk_test_` ou `pk_live_`)
5. Substitua `pk_test_placeholder` no arquivo `.env` pela sua chave

**Importante**: 
- Use `pk_test_` para ambiente de testes
- Use `pk_live_` apenas em produção
- Nunca compartilhe suas chaves secretas (Secret key)

### 3. Banco de Dados Supabase

O projeto já está configurado com as seguintes tabelas:

- `products` - Produtos do catálogo
- `cart_items` - Itens do carrinho
- `profiles` - Perfis de usuários com endereço
- `coupons` - Cupons de desconto
- `orders` - Pedidos realizados (com integração Stripe)
  - Campos Stripe: `stripe_session_id`, `stripe_payment_intent_id`
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

### Stripe Integration

O pagamento é processado via Stripe com os seguintes passos:

1. **Checkout**: Usuário clica em "Finalizar Compra" no carrinho
2. **Redirecionamento**: Sistema cria uma sessão de checkout no Stripe e redireciona o usuário
3. **Pagamento Seguro**: Usuário insere dados do cartão na página segura do Stripe
4. **Verificação**: Após pagamento, sistema verifica e confirma a transação
5. **Confirmação**: Pedido é marcado como concluído e usuário recebe confirmação
6. **Histórico**: Pedido fica disponível em "Meus Pedidos"

### Funcionalidades de Pagamento

- ✅ **Checkout Seguro**: Processamento via Stripe Checkout
- ✅ **Verificação Automática**: Confirmação de pagamento em tempo real
- ✅ **Histórico de Pedidos**: Página "Meus Pedidos" para acompanhamento
- ✅ **Retry de Pagamento**: Possibilidade de retentar pagamento de pedidos pendentes
- ✅ **Atualização Manual**: Botão para atualizar status de pedidos pendentes
- ✅ **Painel Admin**: Visualização de todos os pedidos com detalhes de pagamento
- ✅ **Múltiplas Moedas**: Suporte a BRL e outras moedas
- ✅ **Guest Checkout**: Compra sem necessidade de cadastro (opcional)

### Configuração do Stripe

Para configurar o sistema de pagamentos, siga o guia completo em [STRIPE_SETUP.md](./STRIPE_SETUP.md).

**Resumo rápido**:

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Obtenha sua **Secret Key** (sk_test_... ou sk_live_...)
3. Configure no Supabase:
   - Acesse **Settings** → **Edge Functions** → **Secrets**
   - Adicione `STRIPE_SECRET_KEY` com sua chave
4. Teste com cartões de teste do Stripe

**Cartões de Teste**:
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`

**Nota**: O sistema usa Supabase Edge Functions para processar pagamentos de forma segura, mantendo as chaves secretas protegidas no servidor.

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
