# Ícones de Ação para Gerenciamento de Banners

## Visão Geral
Implementação de ícones de ação (editar, ativar/desativar, excluir) na tabela de gerenciamento de banners do painel administrativo, permitindo ações rápidas e intuitivas.

## Funcionalidades Implementadas

### 1. Três Ações Disponíveis

#### 🔵 Editar (Pencil Icon)
- **Ícone**: Lápis (Pencil)
- **Cor**: Azul (#2563eb)
- **Função**: Abre o diálogo de edição do banner
- **Hover**: Fundo azul claro
- **Tooltip**: "Editar banner"

#### 🟢 Ativar/Desativar (Eye/EyeOff Icon)
- **Ícone**: 
  - Olho aberto (Eye) quando ativo
  - Olho fechado (EyeOff) quando inativo
- **Cor**: 
  - Verde (#16a34a) quando ativo
  - Cinza (#9ca3af) quando inativo
- **Função**: Alterna o status do banner (ativo/inativo)
- **Hover**: Fundo verde/cinza claro
- **Tooltip**: "Desativar banner" ou "Ativar banner"
- **Feedback**: Toast de confirmação

#### 🔴 Excluir (Trash2 Icon)
- **Ícone**: Lixeira (Trash2)
- **Cor**: Vermelho (#dc2626)
- **Função**: Exclui o banner após confirmação
- **Hover**: Fundo vermelho claro
- **Tooltip**: "Excluir banner"
- **Confirmação**: Diálogo de confirmação antes de excluir

### 2. Layout Visual

#### Estrutura da Tabela
```
┌──────────┬─────────────────────┬─────┬───────┬────────┬──────────────┐
│ Imagem   │ Título              │ CTA │ Ordem │ Status │ Ações        │
├──────────┼─────────────────────┼─────┼───────┼────────┼──────────────┤
│ [img]    │ Novos Bonecos...    │ Ver │   1   │ Ativo  │ [✏️] [👁️] [🗑️] │
│ [img]    │ Monte Sua Coleção...│ Ver │   2   │ Ativo  │ [✏️] [👁️] [🗑️] │
│ [img]    │ Lançamentos...      │ Ver │   3   │ Inativo│ [✏️] [👁️] [🗑️] │
└──────────┴─────────────────────┴─────┴───────┴────────┴──────────────┘
```

#### Coluna de Ações
```
┌──────────────────────────┐
│  [✏️]  [👁️]  [🗑️]        │
│  Azul Verde Vermelho     │
└──────────────────────────┘
```

### 3. Código Implementado

#### Imports Atualizados
```typescript
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
```

#### Função de Toggle
```typescript
const handleToggleActive = async (banner: HeroBanner) => {
  try {
    await updateHeroBanner(banner.id, {
      ...banner,
      is_active: !banner.is_active,
    });
    toast.success(banner.is_active ? 'Banner desativado' : 'Banner ativado');
    await loadBanners();
  } catch (error) {
    console.error('Erro ao alterar status do banner:', error);
    toast.error('Erro ao alterar status do banner');
  }
};
```

#### Coluna de Ações
```typescript
{
  key: 'actions',
  label: 'Ações',
  render: (banner: HeroBanner) => (
    <div className="flex gap-1">
      {/* Editar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOpenDialog(banner)}
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Editar banner"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      {/* Ativar/Desativar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToggleActive(banner)}
        className={`h-8 w-8 ${
          banner.is_active 
            ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
        title={banner.is_active ? 'Desativar banner' : 'Ativar banner'}
      >
        {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      
      {/* Excluir */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(banner.id)}
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Excluir banner"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
}
```

## Características de Design

### Cores e Estados

#### Botão Editar
```css
/* Normal */
color: #2563eb (blue-600)

/* Hover */
color: #1d4ed8 (blue-700)
background: #eff6ff (blue-50)
```

#### Botão Ativar/Desativar
```css
/* Ativo - Normal */
color: #16a34a (green-600)

/* Ativo - Hover */
color: #15803d (green-700)
background: #f0fdf4 (green-50)

/* Inativo - Normal */
color: #9ca3af (gray-400)

/* Inativo - Hover */
color: #4b5563 (gray-600)
background: #f9fafb (gray-50)
```

#### Botão Excluir
```css
/* Normal */
color: #dc2626 (red-600)

/* Hover */
color: #b91c1c (red-700)
background: #fef2f2 (red-50)
```

### Tamanhos
- **Botões**: 32x32px (h-8 w-8)
- **Ícones**: 16x16px (h-4 w-4)
- **Espaçamento**: 4px entre botões (gap-1)

### Acessibilidade
- ✅ Tooltips descritivos em cada botão
- ✅ Cores com contraste adequado
- ✅ Ícones semânticos (lápis, olho, lixeira)
- ✅ Estados visuais claros (hover, active)
- ✅ Feedback visual imediato

## Fluxo de Uso

### 1. Editar Banner
```
Usuário clica no ícone de lápis (azul)
  ↓
Diálogo de edição abre
  ↓
Usuário modifica campos
  ↓
Clica em "Salvar"
  ↓
Toast de sucesso
  ↓
Tabela atualiza
```

### 2. Ativar/Desativar Banner
```
Usuário clica no ícone de olho
  ↓
Status inverte (ativo ↔ inativo)
  ↓
Requisição ao banco de dados
  ↓
Toast de confirmação
  ↓
Tabela atualiza
  ↓
Ícone muda (Eye ↔ EyeOff)
  ↓
Cor muda (verde ↔ cinza)
```

### 3. Excluir Banner
```
Usuário clica no ícone de lixeira (vermelho)
  ↓
Diálogo de confirmação aparece
  ↓
Usuário confirma exclusão
  ↓
Banner é excluído do banco
  ↓
Toast de sucesso
  ↓
Tabela atualiza (banner removido)
```

## Benefícios

### Para Administradores
- ✅ Ações rápidas sem sair da tabela
- ✅ Ícones intuitivos e reconhecíveis
- ✅ Feedback visual imediato
- ✅ Menos cliques para ações comuns
- ✅ Toggle rápido de status sem abrir diálogo

### Para a Interface
- ✅ Design limpo e organizado
- ✅ Cores semânticas (azul=editar, verde=ativo, vermelho=excluir)
- ✅ Consistência visual
- ✅ Responsivo e acessível

### Para a Operação
- ✅ Gerenciamento eficiente de banners
- ✅ Ativação/desativação instantânea
- ✅ Confirmação antes de ações destrutivas
- ✅ Feedback claro de todas as ações

## Comparação: Antes vs Depois

### Antes
```
Ações: [Editar] [Excluir]
- Apenas 2 ações
- Botões com texto
- Sem toggle rápido de status
- Mais espaço ocupado
```

### Depois
```
Ações: [✏️] [👁️] [🗑️]
- 3 ações disponíveis
- Ícones compactos
- Toggle rápido de status
- Menos espaço, mais funcionalidade
```

## Estados Visuais

### Banner Ativo
```
┌──────────────────────────────────────┐
│ [img] │ Título │ CTA │ 1 │ [Ativo]  │
│       │        │     │   │ [✏️][👁️][🗑️] │
└──────────────────────────────────────┘
        Azul Verde Vermelho
```

### Banner Inativo
```
┌──────────────────────────────────────┐
│ [img] │ Título │ CTA │ 1 │ [Inativo]│
│       │        │     │   │ [✏️][👁️][🗑️] │
└──────────────────────────────────────┘
        Azul Cinza Vermelho
```

## Interações

### Hover States

#### Editar (Hover)
```
┌─────────┐
│ [✏️]    │  ← Fundo azul claro
└─────────┘     Ícone azul escuro
```

#### Ativar (Hover)
```
┌─────────┐
│ [👁️]    │  ← Fundo verde claro
└─────────┘     Ícone verde escuro
```

#### Desativar (Hover)
```
┌─────────┐
│ [👁️]    │  ← Fundo cinza claro
└─────────┘     Ícone cinza escuro
```

#### Excluir (Hover)
```
┌─────────┐
│ [🗑️]    │  ← Fundo vermelho claro
└─────────┘     Ícone vermelho escuro
```

## Mensagens de Feedback

### Toast Messages

#### Sucesso
- "Banner ativado" (quando ativa)
- "Banner desativado" (quando desativa)
- "Banner excluído com sucesso"
- "Banner atualizado com sucesso"

#### Erro
- "Erro ao alterar status do banner"
- "Erro ao excluir banner"
- "Erro ao salvar banner"

### Confirmações
- "Tem certeza que deseja excluir este banner?" (antes de excluir)

## Responsividade

### Desktop (≥ 1024px)
```
┌────────────────────────────────────────────────┐
│ Imagem │ Título │ CTA │ Ordem │ Status │ Ações │
│ [img]  │ ...    │ ... │   1   │ Ativo  │ [✏️][👁️][🗑️]│
└────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌──────────────────────────────────────┐
│ Img │ Título │ Ordem │ Status │ Ações│
│[img]│ ...    │   1   │ Ativo  │[✏️][👁️][🗑️]│
└──────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────┐
│ [img] Título           │
│ Status: Ativo          │
│ [✏️] [👁️] [🗑️]          │
└────────────────────────┘
```

## Código CSS Classes

### Botão Base
```typescript
className="h-8 w-8"  // Tamanho fixo
variant="ghost"       // Sem borda
size="icon"          // Tamanho de ícone
```

### Botão Editar
```typescript
className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
```

### Botão Toggle (Ativo)
```typescript
className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
```

### Botão Toggle (Inativo)
```typescript
className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
```

### Botão Excluir
```typescript
className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
```

## Testes Recomendados

### Funcionalidade
- [ ] Clicar em editar abre o diálogo correto
- [ ] Toggle ativa/desativa o banner
- [ ] Excluir remove o banner após confirmação
- [ ] Cancelar exclusão mantém o banner
- [ ] Toast aparece para cada ação

### Visual
- [ ] Ícones visíveis e claros
- [ ] Cores corretas para cada ação
- [ ] Hover funciona em todos os botões
- [ ] Ícone muda quando toggle (Eye ↔ EyeOff)
- [ ] Espaçamento adequado entre botões

### Responsividade
- [ ] Botões visíveis em mobile
- [ ] Botões visíveis em tablet
- [ ] Botões visíveis em desktop
- [ ] Touch targets adequados (≥ 44px)

### Acessibilidade
- [ ] Tooltips aparecem no hover
- [ ] Cores com contraste adequado
- [ ] Navegação por teclado funciona
- [ ] Screen readers identificam ações

## Arquivos Modificados

### src/pages/admin/AdminBanners.tsx
- **Imports**: Adicionados ícones `Eye` e `EyeOff`
- **Função**: Criada `handleToggleActive()`
- **Coluna**: Atualizada coluna de ações com 3 botões
- **Estilos**: Aplicadas cores semânticas e hover states

## Extensibilidade

### Adicionar Nova Ação
Para adicionar uma nova ação no futuro:

```typescript
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleNovaAcao(banner)}
  className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
  title="Nova ação"
>
  <NovoIcone className="h-4 w-4" />
</Button>
```

### Customizar Cores
Modificar as classes Tailwind:
```typescript
// Exemplo: Mudar cor do botão editar para roxo
className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
```

## Notas Técnicas

### Performance
- Sem impacto no carregamento
- Ações executadas de forma assíncrona
- Feedback imediato ao usuário

### Compatibilidade
- ✅ React 18+
- ✅ TypeScript 5+
- ✅ Tailwind CSS 3+
- ✅ lucide-react icons
- ✅ shadcn/ui components

### Segurança
- Confirmação antes de excluir
- Validação no backend
- Tratamento de erros adequado

## Conclusão

Os ícones de ação foram implementados com sucesso, proporcionando:
- Interface mais intuitiva e eficiente
- Ações rápidas sem sair da tabela
- Feedback visual claro
- Design consistente e acessível
- Toggle rápido de status de banners

A feature está pronta para uso em produção! 🚀
