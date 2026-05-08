# Correção da Página de Detalhes de Pedidos

## Problemas Identificados e Corrigidos

### 1. **Problema com Foreign Key Inexistente**
**Problema:** A função `getOrderById` estava tentando usar a sintaxe de relacionamento do Supabase (`profiles:user_id`) para buscar dados do perfil do usuário, mas não existe uma foreign key definida entre `orders.user_id` e `profiles.id`.

**Solução:** Reescrevemos a função para fazer queries separadas:
- Primeiro busca o pedido
- Depois busca o perfil do usuário (se existir user_id)
- Por fim busca os produtos relacionados aos items do pedido
- Combina todos os dados manualmente

### 2. **Políticas RLS Faltando**
**Problema:** Faltavam políticas de Row Level Security (RLS) que permitissem admins acessarem:
- Perfis de outros usuários (tabela `profiles`)
- Produtos (tabela `products` só tinha política para admins gerenciarem, mas não para leitura pública)

**Solução:** Adicionamos duas novas políticas:
```sql
-- Permite admins visualizarem todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON profiles FOR SELECT TO public
USING (is_admin());

-- Permite leitura pública de produtos
CREATE POLICY "Todos podem visualizar produtos"
ON products FOR SELECT TO public
USING (true);
```

### 3. **Tratamento de Erros Melhorado**
**Problema:** Quando ocorria um erro, a mensagem era genérica e o usuário era redirecionado imediatamente.

**Solução:** 
- Adicionamos mensagens de erro mais específicas
- Delay de 3 segundos antes de redirecionar para o usuário poder ler o erro
- Logs detalhados em cada etapa do processo de busca

### 4. **Logs de Debug Adicionados**
Adicionamos logs extensivos para facilitar o diagnóstico de problemas:
- Log quando o componente é renderizado
- Log em cada etapa da busca do pedido
- Log quando busca perfil do usuário
- Log quando busca produtos
- Log de erros detalhados

## Arquivos Modificados

1. **`/src/db/admin-api.ts`**
   - Função `getOrderById` completamente reescrita
   - Queries separadas para order, profile e products
   - Logs detalhados em cada etapa
   - Melhor tratamento de erros

2. **`/src/pages/admin/AdminOrderDetailPage.tsx`**
   - Melhor tratamento de erros com mensagens específicas
   - Delay antes de redirecionar
   - Logs de debug adicionados
   - Validação de ID do pedido

3. **Banco de Dados (Migrations)**
   - Nova política RLS para admins verem perfis
   - Nova política RLS para leitura pública de produtos

## Como Testar

1. Faça login como administrador
2. Acesse a página de pedidos (`/admin/pedidos`)
3. Clique no ícone de olho (👁️) em qualquer pedido
4. A página de detalhes deve carregar mostrando:
   - Informações do pedido (número, data, valor, status)
   - Produtos comprados (com imagem, nome, quantidade, preço)
   - Informações do cliente (se houver)
   - Endereço de entrega
   - Método de pagamento

## Logs para Verificar

Abra o Console do navegador (F12) e procure por logs começando com:
- `[AdminOrderDetailPage]` - Logs do componente
- `[admin-api] getOrderById` - Logs da função de busca

Se ainda houver problemas, os logs mostrarão exatamente onde está falhando.

## Próximos Passos (Se Ainda Não Funcionar)

Se a página ainda não abrir, verifique:

1. **Autenticação do Admin:**
   - Confirme que o usuário está logado
   - Verifique se o perfil tem `role = 'admin'`
   - Query para verificar: `SELECT id, username, role FROM profiles WHERE id = auth.uid();`

2. **Permissões do Banco:**
   - Verifique se RLS está habilitado nas tabelas
   - Confirme que as políticas foram criadas corretamente
   - Teste as queries manualmente no SQL Editor do Supabase

3. **Dados do Pedido:**
   - Verifique se o pedido existe
   - Confirme que o campo `items` é um array JSON válido
   - Verifique se os product_ids nos items existem na tabela products
