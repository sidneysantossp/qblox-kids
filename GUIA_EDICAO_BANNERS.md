# 📝 Guia Completo: Como Editar Banners

## 🎯 Visão Geral

A página de gerenciamento de banners possui **3 ícones de ação** em cada linha da tabela, permitindo editar, ativar/desativar e excluir banners de forma rápida e intuitiva.

---

## 🔍 Localização dos Ícones

Os ícones estão localizados na **última coluna** da tabela, chamada **"Ações"**.

```
┌──────────────────────────────────────────────────────────────────┐
│ Imagem │ Título              │ CTA │ Ordem │ Status │ Ações     │
├──────────────────────────────────────────────────────────────────┤
│ [img]  │ Novos Bonecos...    │ Ver │   1   │ Ativo  │ [✏️][👁️][🗑️]│
│ [img]  │ Monte Sua Coleção...│ Ver │   2   │ Ativo  │ [✏️][👁️][🗑️]│
│ [img]  │ Lançamentos...      │ Ver │   3   │ Inativo│ [✏️][👁️][🗑️]│
└──────────────────────────────────────────────────────────────────┘
                                                      ↑
                                              Coluna de Ações
```

---

## 🎨 Identificação dos Ícones

### 1️⃣ Ícone de Editar (Lápis Azul)
```
┌─────┐
│ ✏️  │  ← Cor: AZUL
└─────┘
```
- **Cor**: Azul (#2563eb)
- **Função**: Editar banner
- **Tooltip**: "Editar banner"

### 2️⃣ Ícone de Ativar/Desativar (Olho Verde/Cinza)
```
Banner Ativo:          Banner Inativo:
┌─────┐               ┌─────┐
│ 👁️  │  VERDE        │ 👁️  │  CINZA
└─────┘               └─────┘
Olho aberto           Olho fechado
```
- **Ativo**: Verde (#16a34a) + Olho aberto
- **Inativo**: Cinza (#9ca3af) + Olho fechado
- **Função**: Alternar status do banner
- **Tooltip**: "Desativar banner" ou "Ativar banner"

### 3️⃣ Ícone de Excluir (Lixeira Vermelha)
```
┌─────┐
│ 🗑️  │  ← Cor: VERMELHO
└─────┘
```
- **Cor**: Vermelho (#dc2626)
- **Função**: Excluir banner
- **Tooltip**: "Excluir banner"

---

## 📖 Como Usar Cada Função

### ✏️ Como Editar um Banner

#### Passo a Passo:

1. **Localize o banner** que deseja editar na tabela
2. **Passe o mouse** sobre o ícone de lápis azul (primeiro ícone)
3. **Clique no ícone azul** ✏️
4. **Diálogo de edição abre** com todos os campos preenchidos:
   - Título (Headline)
   - Subtítulo (Subheadline)
   - Imagem do Banner
   - Texto do Botão (CTA)
   - Link do Botão
   - Ordem de Exibição
   - Status (Ativo/Inativo)
5. **Modifique os campos** desejados
6. **Clique em "Salvar"**
7. **Confirmação**: Toast "Banner atualizado com sucesso" ✓
8. **Tabela atualiza** automaticamente

#### Exemplo Visual:
```
Tabela:
┌────────────────────────────────────────────┐
│ [img] │ Novos Bonecos... │ 1 │ Ativo │ [✏️] │ ← Clique aqui
└────────────────────────────────────────────┘
                    ↓
Diálogo de Edição:
┌─────────────────────────────────────────────┐
│ Editar Banner                          [X]  │
├─────────────────────────────────────────────┤
│ Título: [Novos Bonecos de Super Heróis!]   │
│ Subtítulo: [Descubra nossa coleção...]     │
│ Imagem: [Upload/URL]                        │
│ Texto do Botão: [Ver Produtos]             │
│ Link: [/categoria/Super Heróis]            │
│ Ordem: [1]                                  │
│ Status: [✓] Ativo                           │
│                                             │
│         [Cancelar]  [Salvar]                │
└─────────────────────────────────────────────┘
```

---

### 👁️ Como Ativar/Desativar um Banner

#### Passo a Passo:

1. **Localize o banner** na tabela
2. **Identifique o status atual**:
   - 👁️ Verde (olho aberto) = Banner ATIVO
   - 👁️ Cinza (olho fechado) = Banner INATIVO
3. **Clique no ícone de olho** (segundo ícone)
4. **Status inverte instantaneamente**:
   - Ativo → Inativo
   - Inativo → Ativo
5. **Confirmação**: Toast aparece
   - "Banner desativado" (se estava ativo)
   - "Banner ativado" (se estava inativo)
6. **Ícone muda automaticamente**:
   - Verde → Cinza (e olho fecha)
   - Cinza → Verde (e olho abre)
7. **Badge de status atualiza**:
   - [Ativo] → [Inativo]
   - [Inativo] → [Ativo]

#### Exemplo Visual:

**Desativar Banner:**
```
ANTES:
┌────────────────────────────────────────────┐
│ [img] │ Novos Bonecos... │ 1 │ [Ativo] │ [👁️] │ ← Verde
└────────────────────────────────────────────┘
                    ↓ Clique
DEPOIS:
┌────────────────────────────────────────────┐
│ [img] │ Novos Bonecos... │ 1 │ [Inativo] │ [👁️] │ ← Cinza
└────────────────────────────────────────────┘

Toast: "Banner desativado" ✓
```

**Ativar Banner:**
```
ANTES:
┌────────────────────────────────────────────┐
│ [img] │ Lançamentos... │ 3 │ [Inativo] │ [👁️] │ ← Cinza
└────────────────────────────────────────────┘
                    ↓ Clique
DEPOIS:
┌────────────────────────────────────────────┐
│ [img] │ Lançamentos... │ 3 │ [Ativo] │ [👁️] │ ← Verde
└────────────────────────────────────────────┘

Toast: "Banner ativado" ✓
```

---

### 🗑️ Como Excluir um Banner

#### Passo a Passo:

1. **Localize o banner** que deseja excluir
2. **Passe o mouse** sobre o ícone de lixeira vermelho (terceiro ícone)
3. **Clique no ícone vermelho** 🗑️
4. **Diálogo de confirmação aparece**:
   ```
   ┌─────────────────────────────────────┐
   │ Tem certeza que deseja excluir      │
   │ este banner?                        │
   │                                     │
   │     [Cancelar]  [OK]                │
   └─────────────────────────────────────┘
   ```
5. **Escolha uma opção**:
   - **Cancelar**: Nada acontece, banner permanece
   - **OK**: Banner é excluído
6. **Se confirmar**:
   - Banner é removido do banco de dados
   - Toast "Banner excluído com sucesso" ✓
   - Tabela atualiza (banner desaparece)

#### Exemplo Visual:
```
Tabela ANTES:
┌────────────────────────────────────────────┐
│ [img] │ Banner 1 │ 1 │ Ativo   │ [✏️][👁️][🗑️] │
│ [img] │ Banner 2 │ 2 │ Ativo   │ [✏️][👁️][🗑️] │ ← Excluir este
│ [img] │ Banner 3 │ 3 │ Inativo │ [✏️][👁️][🗑️] │
└────────────────────────────────────────────┘
                    ↓ Clique em 🗑️
Confirmação:
┌─────────────────────────────────────┐
│ Tem certeza que deseja excluir?     │
│     [Cancelar]  [OK]                │ ← Clique OK
└─────────────────────────────────────┘
                    ↓
Tabela DEPOIS:
┌────────────────────────────────────────────┐
│ [img] │ Banner 1 │ 1 │ Ativo   │ [✏️][👁️][🗑️] │
│ [img] │ Banner 3 │ 3 │ Inativo │ [✏️][👁️][🗑️] │
└────────────────────────────────────────────┘
(Banner 2 foi removido)

Toast: "Banner excluído com sucesso" ✓
```

---

## 🎯 Dicas de Uso

### ✅ Boas Práticas

1. **Desative em vez de excluir**: Se não quer mostrar um banner temporariamente, use o toggle (👁️) em vez de excluir
2. **Teste antes de ativar**: Edite e revise o banner antes de ativá-lo
3. **Ordem importa**: Use o campo "Ordem" para controlar a sequência dos banners no carrossel
4. **Confirme antes de excluir**: A exclusão é permanente!

### ⚠️ Avisos Importantes

- ❌ **Exclusão é permanente**: Não há como recuperar um banner excluído
- ⚡ **Toggle é instantâneo**: Não há confirmação ao ativar/desativar
- 🔄 **Atualização automática**: A tabela atualiza sozinha após cada ação
- 📱 **Responsivo**: Os ícones funcionam em desktop, tablet e mobile

---

## 🔧 Resolução de Problemas

### Problema: "Não vejo os ícones de ação"

**Possíveis causas e soluções:**

1. **Tabela vazia**
   - Verifique se há banners cadastrados
   - Clique em "Novo Banner" para criar um

2. **Coluna "Ações" não aparece**
   - Atualize a página (F5)
   - Limpe o cache do navegador

3. **Ícones não clicáveis**
   - Verifique se você tem permissão de administrador
   - Tente em outro navegador

### Problema: "Cliquei mas nada aconteceu"

**Soluções:**

1. **Verifique o console do navegador** (F12)
   - Procure por erros em vermelho
   - Anote a mensagem de erro

2. **Tente novamente**
   - Atualize a página
   - Faça logout e login novamente

3. **Verifique a conexão**
   - Certifique-se de estar conectado à internet
   - Verifique se o servidor está online

### Problema: "Toast não aparece"

**Soluções:**

1. **Verifique se a ação foi executada**
   - Olhe se a tabela atualizou
   - Recarregue a página para confirmar

2. **Configuração do navegador**
   - Verifique se notificações estão habilitadas
   - Desative bloqueadores de pop-up

---

## 📊 Resumo Rápido

| Ícone | Cor | Função | Confirmação? | Reversível? |
|-------|-----|--------|--------------|-------------|
| ✏️ Lápis | Azul | Editar | Sim (Salvar) | Sim |
| 👁️ Olho | Verde/Cinza | Ativar/Desativar | Não | Sim |
| 🗑️ Lixeira | Vermelho | Excluir | Sim (OK) | ❌ Não |

---

## 🎬 Fluxo Completo de Edição

### Cenário: Atualizar título e desativar banner

```
1. Localizar banner na tabela
   ↓
2. Clicar no ícone azul ✏️
   ↓
3. Diálogo abre
   ↓
4. Modificar campo "Título"
   ↓
5. Clicar em "Salvar"
   ↓
6. Toast: "Banner atualizado com sucesso" ✓
   ↓
7. Diálogo fecha
   ↓
8. Tabela atualiza com novo título
   ↓
9. Clicar no ícone verde 👁️
   ↓
10. Ícone muda para cinza
    ↓
11. Badge muda para [Inativo]
    ↓
12. Toast: "Banner desativado" ✓
    ↓
13. Concluído! ✓
```

---

## 🖼️ Referência Visual Completa

### Tabela Completa com Ícones

```
┌──────────────────────────────────────────────────────────────────────┐
│                        BANNERS HERO                                  │
│ Gerencie os banners da página inicial                [+ Novo Banner] │
├──────────────────────────────────────────────────────────────────────┤
│ 🔍 Buscar banner...                                                  │
├──────────────────────────────────────────────────────────────────────┤
│ Imagem    │ Título              │ CTA  │ Ordem │ Status │ Ações     │
├──────────────────────────────────────────────────────────────────────┤
│ [img]     │ Novos Bonecos de    │ Ver  │   1   │ Ativo  │ [✏️][👁️][🗑️]│
│           │ Super Heróis!       │      │       │        │ Azul Verde Vermelho│
├──────────────────────────────────────────────────────────────────────┤
│ [img]     │ Monte Sua Coleção   │ Ver  │   2   │ Ativo  │ [✏️][👁️][🗑️]│
│           │ Personalizada       │      │       │        │ Azul Verde Vermelho│
├──────────────────────────────────────────────────────────────────────┤
│ [img]     │ Lançamentos         │ Ver  │   3   │ Inativo│ [✏️][👁️][🗑️]│
│           │ Exclusivos          │      │       │        │ Azul Cinza Vermelho│
└──────────────────────────────────────────────────────────────────────┘
│ Mostrando 1 a 3 de 3 registros          [<] Página 1 de 1 [>]       │
└──────────────────────────────────────────────────────────────────────┘
```

### Hover States

```
Normal:                    Hover:
┌─────┐                   ┌─────────┐
│ ✏️  │  ────────────→   │   ✏️    │
└─────┘                   └─────────┘
Azul                      Azul + Fundo azul claro

┌─────┐                   ┌─────────┐
│ 👁️  │  ────────────→   │   👁️    │
└─────┘                   └─────────┘
Verde                     Verde + Fundo verde claro

┌─────┐                   ┌─────────┐
│ 🗑️  │  ────────────→   │   🗑️    │
└─────┘                   └─────────┘
Vermelho                  Vermelho + Fundo vermelho claro
```

---

## 📞 Suporte

Se você ainda tiver dúvidas ou problemas:

1. **Verifique este guia novamente**
2. **Consulte a documentação técnica**: `BANNER_ACTION_ICONS.md`
3. **Veja a comparação antes/depois**: `BANNER_ICONS_COMPARISON.md`
4. **Entre em contato com o suporte técnico**

---

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Estou na página correta? (Admin → Banners Hero)
- [ ] Há banners cadastrados na tabela?
- [ ] Vejo a coluna "Ações" na tabela?
- [ ] Os ícones estão visíveis? (✏️ 👁️ 🗑️)
- [ ] Tentei atualizar a página? (F5)
- [ ] Tentei em outro navegador?
- [ ] Verifiquei o console do navegador? (F12)
- [ ] Tenho permissão de administrador?

---

## 🎉 Conclusão

Agora você sabe como usar todos os recursos de edição de banners:

✅ **Editar**: Clique no lápis azul ✏️
✅ **Ativar/Desativar**: Clique no olho verde/cinza 👁️
✅ **Excluir**: Clique na lixeira vermelha 🗑️

**Dica Final**: Use o toggle (👁️) para ativar/desativar banners rapidamente sem precisar abrir o diálogo de edição!

---

**Última atualização**: 2025-01-27
**Versão**: 1.0
**Status**: ✅ Funcional e testado
