# Integração de Frete dos Correios

## Visão Geral
Sistema completo de cálculo de frete integrado com os Correios brasileiros, permitindo cálculo em tempo real de valores e prazos de entrega.

## Componentes Implementados

### 1. Banco de Dados

#### Tabela `settings`
Armazena configurações do sistema, incluindo:
- `correios_api_key`: Chave de API dos Correios
- `correios_cep_origem`: CEP de origem para cálculo de frete

#### Tabela `products` (atualizada)
Novos campos adicionados:
- `weight`: Peso em gramas (padrão: 500g)
- `length`: Comprimento em cm (padrão: 20cm)
- `height`: Altura em cm (padrão: 10cm)
- `width`: Largura em cm (padrão: 15cm)

### 2. Edge Function: `calculate-shipping`

**Localização**: `/supabase/functions/calculate-shipping/index.ts`

**Funcionalidade**:
- Recebe CEP de destino e dimensões do produto
- Busca configurações (API key e CEP origem) do banco
- Calcula frete para SEDEX e PAC
- Retorna valores e prazos de entrega

**Parâmetros de Entrada**:
```typescript
{
  cep_destino: string,  // CEP de destino (formato: 00000-000)
  peso: number,         // Peso em gramas
  comprimento: number,  // Comprimento em cm
  altura: number,       // Altura em cm
  largura: number       // Largura em cm
}
```

**Resposta**:
```typescript
{
  opcoes: [
    {
      servico: string,  // Código do serviço (04014=SEDEX, 04510=PAC)
      nome: string,     // Nome do serviço
      valor: number,    // Valor do frete em R$
      prazo: number,    // Prazo em dias úteis
      erro?: string     // Mensagem de erro (se houver)
    }
  ]
}
```

### 3. Painel Admin - Configurações

**Rota**: `/admin/configuracoes`

**Funcionalidades**:
- Configurar chave de API dos Correios
- Definir CEP de origem (localização do estoque)
- Validação de formato de CEP
- Salvamento seguro no banco de dados

**Acesso**: Apenas administradores

### 4. Componente ShippingCalculator

**Localização**: `/src/components/shipping/ShippingCalculator.tsx`

**Uso**:
```tsx
<ShippingCalculator
  peso={500}           // em gramas
  comprimento={20}     // em cm
  altura={10}          // em cm
  largura={15}         // em cm
  onSelectShipping={(option) => {
    // Callback quando usuário seleciona uma opção
    console.log(option);
  }}
/>
```

**Funcionalidades**:
- Input de CEP com formatação automática
- Cálculo de frete em tempo real
- Exibição de opções (SEDEX e PAC)
- Seleção de opção de frete
- Tratamento de erros

### 5. Integração na Página do Produto

**Localização**: `/src/pages/ProductDetailPage.tsx`

O componente ShippingCalculator foi integrado na seção de informações de entrega, permitindo que os clientes calculem o frete antes de adicionar ao carrinho.

### 6. Formulário de Produto (Admin)

**Localização**: `/src/pages/admin/ProductFormPage.tsx`

**Novos Campos**:
- Peso (gramas)
- Comprimento (cm)
- Altura (cm)
- Largura (cm)

Estes campos são obrigatórios para o cálculo correto do frete.

## Como Configurar

### Passo 1: Obter Chave de API dos Correios

Existem duas opções principais:

#### Opção A: API Oficial dos Correios
1. Acesse o portal dos Correios
2. Cadastre-se como empresa
3. Solicite acesso à API de Preço e Prazo
4. Aguarde aprovação e receba suas credenciais

#### Opção B: Melhor Envio (Recomendado)
1. Acesse https://melhorenvio.com.br
2. Crie uma conta gratuita
3. Acesse "Configurações" > "API"
4. Gere um token de API
5. Use este token como chave de API

### Passo 2: Configurar no Painel Admin

1. Faça login como administrador
2. Acesse "Configurações" no menu lateral
3. Insira a chave de API dos Correios
4. Insira o CEP de origem (seu estoque/loja)
5. Clique em "Salvar Configurações"

### Passo 3: Configurar Dimensões dos Produtos

1. Acesse "Produtos" no painel admin
2. Edite cada produto
3. Preencha os campos de dimensões:
   - Peso (em gramas)
   - Comprimento, Altura e Largura (em cm)
4. Salve as alterações

## Fluxo de Uso

### Para o Cliente:

1. Acessa a página de detalhes do produto
2. Localiza a seção "Calcular Frete e Prazo"
3. Insere o CEP de destino
4. Clica em "Calcular Frete"
5. Visualiza opções de frete (SEDEX e PAC) com valores e prazos
6. Seleciona a opção desejada
7. Adiciona o produto ao carrinho

### Para o Administrador:

1. Configura a integração uma única vez
2. Cadastra produtos com dimensões corretas
3. O sistema calcula automaticamente o frete para os clientes

## Segurança

- **RLS (Row Level Security)**: Apenas administradores podem ler/modificar configurações
- **Edge Function**: API key nunca é exposta ao cliente
- **Validações**: CEP e dimensões são validados antes do cálculo

## Tratamento de Erros

O sistema possui tratamento robusto de erros:

1. **API Indisponível**: Retorna valores estimados
2. **CEP Inválido**: Valida formato antes de enviar
3. **Configuração Ausente**: Informa ao usuário para configurar no admin
4. **Dimensões Inválidas**: Valida valores mínimos

## Valores Padrão

Caso a API dos Correios esteja indisponível, o sistema retorna valores estimados:

- **SEDEX**: R$ 25,00 - 2 dias úteis
- **PAC**: R$ 15,00 - 5 dias úteis

## Observações Importantes

1. **Dimensões Mínimas**: Os Correios possuem dimensões mínimas e máximas. Certifique-se de que os produtos estão dentro dos limites.

2. **Peso**: Sempre em gramas. Exemplo: 1kg = 1000g

3. **CEP**: Aceita formato com ou sem hífen (00000-000 ou 00000000)

4. **Atualização de Preços**: Os valores são calculados em tempo real pela API dos Correios

5. **Testes**: Recomenda-se testar com CEPs reais para validar os cálculos

## Próximos Passos (Opcional)

- Adicionar mais modalidades de frete (SEDEX 10, SEDEX Hoje)
- Integrar com outras transportadoras
- Salvar opção de frete selecionada no carrinho
- Adicionar rastreamento de pedidos
- Implementar cálculo de frete para múltiplos produtos

## Suporte

Para problemas com a integração:
1. Verifique se a chave de API está correta
2. Confirme que o CEP de origem está configurado
3. Valide as dimensões dos produtos
4. Consulte os logs da Edge Function no Supabase
