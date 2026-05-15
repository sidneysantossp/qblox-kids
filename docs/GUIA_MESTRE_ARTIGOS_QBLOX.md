# Guia Mestre de Produção Editorial — QBLOX

## Objetivo deste documento

Este documento define o padrão obrigatório para qualquer artigo, guia, página satélite ou conteúdo editorial da QBLOX que tenha objetivo de ranqueamento orgânico, descoberta por mecanismos generativos, apoio à navegação interna e conversão assistida para categorias e produtos.

Ele existe para garantir consistência entre todos os conteúdos, evitar padrões fracos de escrita, reduzir sinais típicos de texto automático e criar uma malha editorial forte entre:

- artigos e guias
- páginas de categorias
- páginas de produtos
- páginas pilar
- página de autor

---

## Artigo de referência

O padrão de referência atual é:

- `src/pages/GuideByAgePage.tsx`
- rota: `/guia/como-escolher-bonecos-de-montar-por-idade`

Esse artigo é a base estrutural para todos os demais guias.

---

## Objetivo editorial de todos os artigos

Todo artigo da QBLOX precisa cumprir simultaneamente 4 funções:

1. **Responder uma intenção de busca real**
   - Ex.: presente, faixa etária, coleção, tema, comparação, orçamento, lançamentos.

2. **Organizar a tomada de decisão do usuário**
   - O artigo não pode apenas informar; ele precisa ajudar a comparar e decidir.

3. **Distribuir navegação interna com lógica comercial**
   - O usuário precisa sair do artigo naturalmente para categorias, produtos e outros guias.

4. **Criar contexto suficiente para ser compreendido e citado por LLMs e sistemas generativos**
   - Isso exige clareza semântica, boa densidade, relação entre entidades e estrutura forte de headings, FAQ, autoria e links internos.

---

## O que um redator precisa obedecer

### 1. O artigo deve ser escrito como texto editorial humano

Obrigatório:
- transição natural entre tópicos
- cadência de argumento progressiva
- variação de ritmo textual
- explicação com contexto, não só afirmações secas
- vocabulário claro, mas não simplista demais
- tom consultivo e confiante

Proibido:
- blocos telegráficos
- frases excessivamente curtas em sequência
- seções que parecem checklist mecânico
- encerramento genérico de IA
- títulos como `Conclusão`
- repetições de fórmula como “em resumo”, “por fim”, “portanto” em todos os artigos

### 2. O artigo precisa ter densidade suficiente

Padrão mínimo:
- **2.200 palavras totais** como base editorial
- recomendado: **2.200 a 3.000 palavras** dependendo do tema

Padrão por seção:
- cada seção principal deve ter **2 parágrafos analíticos reais**
- cada parágrafo analítico deve ter, como referência editorial, **180 a 220 palavras**
- exceções permitidas:
  - parágrafos introdutórios curtos antes de lista
  - frases curtas de respiro depois de listas
  - respostas de FAQ

Regra prática:
- se o texto puder ser resumido sem perda por um concorrente em 2 linhas, ele ainda está fraco
- se um tópico não sustentar 2 parágrafos densos, o subtítulo está genérico demais e deve ser reformulado

### 3. O artigo precisa cobrir semântica real do tema

Todo artigo precisa trabalhar:
- palavra-chave foco
- palavras relacionadas
- variações naturais da intenção
- entidades complementares (tema, categoria, ocasião, perfil de compra, tipo de uso)

Exemplo:
Se a keyword foco for `como escolher bonecos de montar por idade`, o texto também deve trabalhar naturalmente termos como:
- bonecos de montar para crianças
- bonecos de montar para presente
- melhor categoria para iniciantes
- temas mais fáceis de escolher
- personagens reconhecíveis
- comparação entre categorias

### 4. O texto deve usar negrito com intenção editorial

Obrigatório:
- aplicar **negrito** nas palavras-chave foco e em termos de alta importância semântica
- usar negrito de forma pontual, não excessiva

Onde usar:
- na keyword principal do artigo
- em termos relacionados importantes
- em nomes de categorias estratégicas
- em pontos de decisão importantes

Proibido:
- usar negrito em bloco inteiro
- destacar termos irrelevantes
- marcar palavras só para “parecer SEO”

### 5. O artigo deve conter listas úteis

Obrigatório:
- cada artigo precisa ter pelo menos **2 listas reais**
- listas devem servir para:
  - benefícios
  - sinais de escolha
  - critérios de comparação
  - erros comuns
  - vantagens de um tema
  - o que observar antes de comprar

Proibido:
- listas decorativas
- listas redundantes que repetem o parágrafo anterior sem agregar nada

---

## Estrutura obrigatória do artigo

Cada guia deve conter, no mínimo:

### Bloco 1 — Hero editorial
- H1 forte
- descrição curta abaixo do H1
- autor
- data de atualização
- tempo de leitura
- imagem destacada
- ícones de compartilhamento social

### Bloco 2 — Corpo principal do artigo
Mínimo obrigatório:
- **8 subtítulos H2**
- recomendado: **8 a 10 H2**
- cada H2 com desenvolvimento real
- sem numeração nos subtítulos

Regras:
- os tópicos devem evoluir com naturalidade
- um subtítulo deve preparar o próximo
- a leitura não pode parecer uma sequência de caixas independentes

### Bloco 3 — Links internos contextuais no meio do texto
Obrigatório no corpo do artigo:
- pelo menos **3 links para páginas de produtos específicos**
- pelo menos **3 links para páginas de categorias ou pilares**
- pelo menos **2 links para outros guias relacionados**

Prioridade de linkagem:
1. categorias da loja
2. páginas pilar
3. produtos específicos
4. guias relacionados
5. blog geral

### Bloco 4 — FAQ em sanfona
Obrigatório:
- mínimo **8 perguntas**
- formato sanfona / accordion
- respostas objetivas, úteis e sem enrolação
- compatível com mobile

### Bloco 5 — Conteúdo relacionado
Obrigatório:
- carrossel de guias relacionados
- se possível, carrossel de produtos recomendados

### Bloco 6 — Assinatura do autor
Obrigatório:
- bloco de assinatura ao final
- link para página do autor
- linguagem institucional neutra

---

## O que não pode faltar

Checklist obrigatório por artigo:

- [ ] H1 claro e específico
- [ ] descrição curta forte abaixo do título
- [ ] imagem destacada
- [ ] botões de compartilhamento social
- [ ] 8 a 10 H2
- [ ] desenvolvimento textual denso em cada tópico
- [ ] pelo menos 2 listas úteis
- [ ] negrito aplicado nas palavras-chave foco e relacionadas
- [ ] pelo menos 3 links para produtos específicos
- [ ] pelo menos 3 links para categorias/páginas pilar
- [ ] pelo menos 2 links para guias relacionados
- [ ] FAQ com 8 perguntas em sanfona
- [ ] carrossel de guias relacionados
- [ ] assinatura do autor
- [ ] link para página do autor
- [ ] SEO completo
- [ ] schema/article
- [ ] schema/faq
- [ ] breadcrumb schema
- [ ] item list schema quando houver seleção de produtos

---

## Cuidados importantes

### 1. Não expor estratégia interna

O artigo, a assinatura do autor e a página do autor **não podem** mencionar:
- estratégia de conteúdo
- cluster editorial
- critérios internos de atualização
- metodologia de produção
- sinais de confiança usados como tática
- objetivo de ranqueamento em linguagem explícita
- “otimizado para IA” como frase promocional interna

A linguagem deve ser externa, pública e neutra.

### 2. Evitar sinais clássicos de texto de IA

Evitar:
- subtítulos numerados
- encerramento com “Conclusão”
- parágrafos muito curtos em sequência
- repetição de estrutura previsível em todos os tópicos
- blocos excessivamente simétricos
- frases genéricas sem concretude

### 3. Não escrever apenas para SEO

O artigo precisa ser útil para quem compra.
Se o texto só serve para rankear, ele falha.
Se ele ajuda o usuário a entender melhor o catálogo e avançar de página, ele está no caminho certo.

### 4. Toda interligação precisa ser coerente

Não basta linkar por linkar.
Cada link interno deve existir por um destes motivos:
- aprofundar um tema citado
- comparar uma categoria mencionada
- levar a um produto compatível com o argumento do parágrafo
- continuar a jornada de decisão

---

## Estrutura técnica obrigatória

Todo artigo deve implementar:

### SEO
- `SEO` component com:
  - title
  - description
  - canonical
  - url
  - image
  - type="article"
  - keywords quando fizer sentido

### Schema
Obrigatório:
- `Article schema`
- `Breadcrumb schema`
- `FAQ schema`

Condicional:
- `ItemList schema` quando o artigo exibir seleção de produtos recomendados

### Autor
Obrigatório:
- `author`
- `authorUrl`
- link visível para página do autor

---

## Proporção editorial mínima a seguir

### Proporção base
Para novos guias, seguir esta estrutura mínima:

- total do artigo: **2.200 palavras ou mais**
- H2 principais: **8 a 10**
- parágrafos principais por H2: **2**
- palavras por parágrafo principal: **180 a 220**
- listas úteis: **2 a 4**
- FAQ: **8 perguntas**
- produtos específicos linkados: **3 ou mais**
- categorias/pilares linkados: **3 ou mais**
- guias relacionados linkados: **2 ou mais**

### Observação de proporção
A página de referência atual já define a malha estrutural do padrão, mas a densidade ideal daqui para frente deve seguir este alvo editorial de 180 a 220 palavras para os parágrafos principais. Ou seja: a estrutura da página de referência é válida, e a densidade futura deve seguir este padrão mínimo mais robusto.

---

## Mapeamento atual do backlog editorial

### Guias estáticos já mapeados
Total: **8 guias estáticos**

1. `GuideByAgePage.tsx` — já atualizado para o novo padrão base
2. `BeginnersGuidePage.tsx` — pendente de atualização completa
3. `GiftGuidePage.tsx` — pendente de atualização completa
4. `GiftByPriceGuidePage.tsx` — pendente de atualização completa
5. `MostWantedSuperHeroesGuidePage.tsx` — pendente de atualização completa
6. `RobloxCollectionGuidePage.tsx` — pendente de atualização completa
7. `LaunchesGuidePage.tsx` — pendente de atualização completa
8. `ThemesComparisonGuidePage.tsx` — pendente de atualização completa

### Status
- atualizados no novo padrão: **1**
- pendentes no novo padrão: **7**

### Artigos de blog em seed que também precisam migrar para esse padrão
Total identificado nos seeds: **6**

1. `bonecos-de-montar-como-escolher`
2. `ninjago-sucesso-criancas-colecionadores`
3. `beneficios-bonecos-de-montar-para-criancas`
4. `bonecos-de-montar-ninjago-guia-para-comecar`
5. `ninjago-para-presente-o-que-considerar-antes-de-comprar`
6. `bonecos-de-montar-colecionaveis-como-organizar-e-conservar`

### Backlog editorial total mapeado
- guias estáticos pendentes: **7**
- artigos de blog pendentes: **6**
- total pendente: **13 conteúdos editoriais**

---

## Ordem recomendada de atualização

### Prioridade 1 — Guias estáticos de alta intenção comercial
1. `BeginnersGuidePage.tsx`
2. `GiftGuidePage.tsx`
3. `GiftByPriceGuidePage.tsx`
4. `ThemesComparisonGuidePage.tsx`

### Prioridade 2 — Guias temáticos estratégicos
5. `MostWantedSuperHeroesGuidePage.tsx`
6. `RobloxCollectionGuidePage.tsx`
7. `LaunchesGuidePage.tsx`

### Prioridade 3 — Blog editorial longo
8. `bonecos-de-montar-como-escolher`
9. `beneficios-bonecos-de-montar-para-criancas`
10. `bonecos-de-montar-colecionaveis-como-organizar-e-conservar`
11. `ninjago-sucesso-criancas-colecionadores`
12. `bonecos-de-montar-ninjago-guia-para-comecar`
13. `ninjago-para-presente-o-que-considerar-antes-de-comprar`

---

## Regra final de interligação

Ao terminar a atualização de todos os conteúdos:

### Todos os artigos precisam estar interligados com
- outros guias relacionados
- páginas pilar
- páginas de categorias
- páginas de produtos específicos
- página do autor

### A prioridade da malha interna deve ser
1. categorias da loja
2. páginas pilar
3. produtos citados ao longo do texto
4. guias relacionados
5. blog geral

Se um conteúdo atualizado não empurrar o usuário naturalmente para categorias, produtos e outros guias, ele ainda não está pronto.
