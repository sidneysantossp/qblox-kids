# Correção do Sistema de Pedidos Admin - Atualização 2

## Problema Identificado

O dashboard mostrava pedidos pendentes, mas ao clicar neles:
1. A página de detalhes não abria corretamente
2. A página de pedidos mostrava "Nenhum registro encontrado"
3. Não era possível visualizar ou alterar o status dos pedidos

## Causa Raiz Descoberta

1. **Estrutura de Dados**: Os itens do pedido são armazenados como JSONB na coluna `items` da tabela `orders`, não em uma tabela separada `order_items`
2. **Política RLS**: A política RLS original usava uma subquery que pode não funcionar corretamente com o Supabase client
3. **Query Incorreta**: A função `getOrderById` tentava fazer JOIN com uma tabela `order_items` que não existe

## Correções Implementadas

### 1. ✅ Criada função is_admin() no banco de dados
- Função SECURITY DEFINER para verificar se o usuário atual é admin
- Mais confiável que subquery inline nas políticas RLS

### 2. ✅ Recriadas políticas RLS para orders
- Removida política antiga "Admins can view all orders"
- Criada nova política "Admins can view all orders v2" usando is_admin()
- Removida política antiga "Admins can update orders"
- Criada nova política "Admins can update orders v2" usando is_admin()

### 3. ✅ Corrigida função getOrderById()
- Removido JOIN com tabela inexistente order_items
- Adicionada lógica para buscar produtos dos itens do pedido
- Cria array order_items compatível com a interface esperada
- Adicionado logging detalhado

### 4. ✅ Melhorada função getDashboardStats()
- Adicionado logging para debug
- Corrigido cálculo de totalRevenue usando Number()
- Adicionado tratamento de erros

### 5. ✅ Criada página de debug (/admin/debug)
- Testa permissões do usuário atual
- Verifica função is_admin()
- Tenta buscar pedidos
- Mostra resultados em JSON para diagnóstico

## Como Testar

### Passo 1: Verificar Permissões
1. Faça login como admin (Sidney Santos - e0b4ebcf-8d5b-4cbd-a935-6b4e0708f0d5)
2. Acesse: `/admin/debug`
3. Verifique os resultados:
   - `isAdmin` deve ser `true`
   - `is_admin()` deve retornar `true`
   - `ordersQuery.count` deve mostrar 6 pedidos
   - Se houver erros, eles aparecerão nos cards

### Passo 2: Testar Dashboard
1. Acesse: `/admin`
2. Verifique se "Pedidos Recentes" mostra os 5 pedidos
3. Clique em um pedido para abrir os detalhes

### Passo 3: Testar Página de Pedidos
1. Acesse: `/admin/pedidos`
2. Verifique se a lista de pedidos aparece
3. Clique em um pedido para ver detalhes
4. Altere o status do pedido
5. Verifique se a alteração foi salva

### Passo 4: Verificar Usuário
1. Faça login como usuário normal (sidney santos - 27d09b25-6d7f-4e13-9235-a0fdebc2d981)
2. Acesse: `/meus-pedidos`
3. Verifique se o pedido aparece com o status atualizado

## Estrutura de Dados dos Pedidos

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "total_amount": 19.80,
  "status": "pending",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 1,
      "price": 19.80
    }
  ],
  "shipping_address": {
    "name": "Nome",
    "phone": "11996384376",
    "zipCode": "04438030",
    "address": "Rua",
    "number": "108",
    "complement": "",
    "neighborhood": "Bairro",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

## Arquivos Modificados

1. **Database Migration**: `fix_admin_orders_policy`
   - Criada função is_admin()
   - Recriadas políticas RLS

2. **src/db/admin-api.ts**
   - Corrigida getOrderById() para trabalhar com items JSONB
   - Melhorada getDashboardStats() com logging

3. **src/pages/admin/AdminDebugPage.tsx** (NOVO)
   - Página de diagnóstico de permissões

4. **src/routes.tsx**
   - Adicionada rota /admin/debug

## Solução de Problemas

### Se os pedidos ainda não aparecerem:

1. **Verifique o role do usuário**:
   ```sql
   SELECT id, full_name, role FROM profiles WHERE id = 'e0b4ebcf-8d5b-4cbd-a935-6b4e0708f0d5';
   ```
   - Deve retornar role='admin'

2. **Teste a função is_admin()**:
   - Acesse /admin/debug
   - Verifique se "Função is_admin()" retorna true

3. **Verifique os logs do console**:
   - Abra DevTools (F12)
   - Vá para a aba Console
   - Procure por logs com prefixo [admin-api]

4. **Verifique se está logado como admin**:
   - O email deve ser do usuário admin
   - O perfil deve ter role='admin'

### Se a página de detalhes não abrir:

1. Verifique se o ID do pedido está correto na URL
2. Verifique os logs do console para erros
3. Verifique se o pedido tem items no banco de dados

## Próximos Passos

Se o problema persistir após estas correções:
1. Acesse /admin/debug e compartilhe os resultados
2. Verifique os logs do console do navegador
3. Verifique se está logado com o usuário admin correto
