# Guia Rápido - Painel Admin

## 🚀 Acesso Rápido

### 1. Criar Usuário Admin

No Supabase SQL Editor, execute:

```sql
-- Primeiro, crie um usuário ou use um existente
-- Depois, torne-o admin:
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'SEU_USER_ID_AQUI';

-- Ou use o email:
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'seu@email.com'
);
```

### 2. Fazer Login

1. Acesse: `http://localhost:5173/login`
2. Faça login com suas credenciais
3. Após login, acesse: `http://localhost:5173/admin`

### 3. Verificar Acesso Admin

No menu do usuário (canto superior direito), você verá:
- ✅ "Painel Admin" - Se for admin
- ❌ Opção não aparece - Se for usuário comum

## 📋 Módulos Disponíveis

| Módulo | Rota | Descrição |
|--------|------|-----------|
| Dashboard | `/admin` | Visão geral e estatísticas |
| Produtos | `/admin/produtos` | Gerenciar catálogo |
| Pedidos | `/admin/pedidos` | Gerenciar pedidos |
| Usuários | `/admin/usuarios` | Gerenciar usuários |
| Categorias | `/admin/categorias` | Gerenciar categorias |
| Banners | `/admin/banners` | Gerenciar banners hero |
| Seções | `/admin/secoes` | Gerenciar seções home |
| Blog | `/admin/blog` | Gerenciar posts |
| Pagamentos | `/admin/pagamentos` | Gerenciar métodos |
| Relatórios | `/admin/relatorios` | Ver análises |

## 🎯 Funcionalidades Principais

### Categorias (CRUD Completo)
- ✅ Criar nova categoria
- ✅ Editar categoria existente
- ✅ Excluir categoria
- ✅ Ativar/desativar
- ✅ Definir ordem de exibição
- ✅ Adicionar ícone (emoji)

### Produtos
- ✅ Listar todos os produtos
- ✅ Buscar produtos
- ✅ Ver detalhes
- ✅ Gerenciar estoque
- ✅ Upload de imagens

### Pedidos
- ✅ Listar todos os pedidos
- ✅ Filtrar por status
- ✅ Ver detalhes do pedido
- ✅ Atualizar status

### Dashboard
- ✅ Total de produtos
- ✅ Total de pedidos
- ✅ Total de usuários
- ✅ Receita total
- ✅ Pedidos recentes
- ✅ Produtos com estoque baixo

## 🔒 Segurança

- ✅ Autenticação obrigatória
- ✅ Role admin obrigatório
- ✅ Proteção de rotas
- ✅ RLS no Supabase
- ✅ Storage policies

## 📱 Responsividade

- ✅ Desktop: Sidebar fixa
- ✅ Mobile: Menu hambúrguer
- ✅ Tablet: Layout adaptativo

## 🛠️ Troubleshooting

### Não vejo "Painel Admin" no menu
```sql
-- Verifique seu role:
SELECT id, email, role FROM profiles 
WHERE id = auth.uid();

-- Se role não for 'admin', atualize:
UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
```

### Erro 403 ao acessar /admin
- Faça logout e login novamente
- Limpe o cache do navegador
- Verifique se o role foi atualizado

### Erro ao fazer upload de imagem
- Tamanho máximo: 5-10MB
- Formatos aceitos: JPEG, PNG, WebP, GIF
- Verifique as políticas de storage

## 📚 Documentação Completa

- `ADMIN_README.md` - Documentação detalhada
- `ADMIN_IMPLEMENTATION.md` - Detalhes técnicos
- `TODO.md` - Progresso da implementação

## 💡 Dicas

1. **Primeiro Acesso**: Crie algumas categorias antes de adicionar produtos
2. **Imagens**: Use imagens otimizadas para melhor performance
3. **Estoque**: Configure alertas de estoque baixo no dashboard
4. **Pedidos**: Atualize status regularmente para melhor experiência do cliente
5. **Backup**: Exporte dados regularmente via relatórios

## 🎨 Interface

- Design limpo e moderno
- Cores consistentes com a plataforma
- Ícones intuitivos
- Feedback visual (toasts)
- Loading states
- Empty states

## ✅ Checklist de Configuração Inicial

- [ ] Criar usuário admin
- [ ] Fazer login
- [ ] Acessar /admin
- [ ] Criar categorias
- [ ] Configurar métodos de pagamento
- [ ] Adicionar produtos
- [ ] Testar upload de imagens
- [ ] Verificar dashboard

---

**Pronto para usar! 🎉**

Para mais detalhes, consulte `ADMIN_README.md`
