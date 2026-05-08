# Kids Block Store - Guia de Configuração Inicial

## 🚀 Primeiros Passos

### 1. Criar sua Conta
1. Acesse a aplicação
2. Clique em "Cadastrar"
3. Preencha seus dados e crie sua conta

### 2. Tornar-se Administrador

⚠️ **IMPORTANTE**: Após criar sua conta, você precisa se tornar administrador para acessar o painel admin.

**Siga o guia completo em:** [SETUP_ADMIN.md](./SETUP_ADMIN.md)

**Resumo rápido:**
1. Acesse o SQL Editor no Supabase Dashboard
2. Execute:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE email = 'seu-email@exemplo.com';
   ```
3. Faça logout e login novamente

### 3. Configurar Integração dos Correios

1. Acesse `/admin/configuracoes`
2. Verifique se o card mostra "Função: admin" ✅
3. Preencha:
   - **Chave API dos Correios**: Obtenha em serviços como Melhor Envio
   - **CEP de Origem**: CEP do seu estoque (formato: 12345-678)
4. Clique em "Salvar Configurações"

### 4. Adicionar Produtos

1. Acesse `/admin/produtos`
2. Clique em "Adicionar Produto"
3. Preencha as informações do produto
4. Faça upload das imagens
5. Salve o produto

## 📚 Documentação

- **[SETUP_ADMIN.md](./SETUP_ADMIN.md)** - Como configurar usuário administrador
- **[TROUBLESHOOTING_SETTINGS.md](./TROUBLESHOOTING_SETTINGS.md)** - Solução de problemas com configurações
- **[FIX_API_KEY_SAVE.md](./FIX_API_KEY_SAVE.md)** - Detalhes técnicos das correções implementadas

## 🛠️ Funcionalidades Administrativas

### Painel Admin (`/admin`)
- **Dashboard**: Visão geral de vendas e estatísticas
- **Produtos**: Gerenciar catálogo de produtos
- **Pedidos**: Acompanhar e gerenciar pedidos
- **Configurações**: Integração com Correios e outras configurações

### Gerenciamento de Produtos
- Adicionar, editar e remover produtos
- Upload de múltiplas imagens
- Organizar por categorias
- Controle de estoque
- Definir preços e promoções

### Gerenciamento de Pedidos
- Visualizar todos os pedidos
- Atualizar status de pedidos
- Filtrar por status e data
- Ver detalhes completos do pedido

## 🔧 Solução de Problemas Comuns

### Não consigo salvar as configurações
➡️ Consulte [TROUBLESHOOTING_SETTINGS.md](./TROUBLESHOOTING_SETTINGS.md)

**Checklist rápido:**
- [ ] Você é administrador? (verifique o card de debug)
- [ ] Fez logout e login após se tornar admin?
- [ ] Limpou o cache do navegador?
- [ ] Verificou o console (F12) por erros?

### Não vejo o menu Admin
➡️ Você precisa ser administrador. Consulte [SETUP_ADMIN.md](./SETUP_ADMIN.md)

### Erro ao fazer upload de imagens
- Verifique o tamanho do arquivo (máximo 5MB)
- Formatos aceitos: JPG, PNG, WebP
- Verifique sua conexão com a internet

### Cálculo de frete não funciona
1. Verifique se a chave API dos Correios está configurada
2. Verifique se o CEP de origem está correto
3. Teste com um CEP válido
4. Verifique o console por erros

## 🎯 Categorias de Produtos

- **Super Heróis**: Personagens de quadrinhos e filmes
- **Roblox**: Personagens do jogo Roblox
- **Séries da TV**: Personagens de séries animadas
- **Aventura**: Temas de aventura e exploração
- **Temáticos**: Temas especiais e sazonais
- **Lançamentos**: Produtos recém-adicionados

## 🎨 Paleta de Cores

- **Azul Primário**: #2196F3
- **Amarelo**: #FFC107
- **Vermelho**: #F44336

## 📱 Suporte

Se você encontrar problemas:

1. **Verifique a documentação** nos arquivos .md
2. **Abra o console do navegador** (F12) e procure por erros
3. **Verifique os logs** no Supabase Dashboard
4. **Consulte os guias de troubleshooting**

## ✅ Checklist de Configuração Inicial

- [ ] Conta criada
- [ ] Usuário configurado como admin (SETUP_ADMIN.md)
- [ ] Logout e login realizados
- [ ] Chave API dos Correios configurada
- [ ] CEP de origem configurado
- [ ] Primeiro produto adicionado
- [ ] Teste de cálculo de frete realizado

## 🔐 Segurança

⚠️ **Importante para Produção:**
- Não compartilhe credenciais de admin
- Use senhas fortes
- Considere implementar 2FA
- Faça backups regulares do banco de dados
- Monitore logs de acesso

## 📊 Usuários Administradores Configurados

Os seguintes usuários já estão configurados como administradores:
- sidneysantosseo@gmail.com
- sid.websp@gmail.com

Para adicionar mais administradores, consulte [SETUP_ADMIN.md](./SETUP_ADMIN.md).

---

**Kids Block Store** - Plataforma de E-commerce Infantil  
Desenvolvido com React, TypeScript, Tailwind CSS, shadcn/ui e Supabase
