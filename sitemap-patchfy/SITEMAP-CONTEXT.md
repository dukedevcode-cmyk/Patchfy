# Contexto — Sitemap Patchfy

Lê o `CLAUDE.md` e o ficheiro `sitemap-patchfy/HOME-IMPLEMENTATION-BRIEF.md` para teres contexto do projecto.

Estamos a desenvolver o **sitemap interactivo da loja Patchfy** em `sitemap-patchfy/` (HTML + CSS + JS puro, sem framework). O sitemap tem um layout de painel esquerdo com navegação e painel direito com as views.

---

## Setup

| Item | Detalhe |
|---|---|
| Branch de trabalho | `dev-duke` |
| Ficheiros do sitemap | `sitemap-patchfy/sitemap-patchfy.html` + `.css` + `.js` |
| GitHub Action | `.github/workflows/sync-sitemap.yml` — sincroniza para `Patchfy-sitemap` a cada push |
| GitHub Pages | https://dukedevcode-cmyk.github.io/Patchfy/ |
| Sync manual | `bash sync-sitemap.sh` |
| Loja Shopify | https://cd9cp1-ga.myshopify.com/ |
| Cache-busting actual | CSS `?v=10` · JS `?v=9` — incrementar sempre que editar cada ficheiro |

---

## Estado actual do sitemap

### Navegação (painel esquerdo — 3 secções)

**Secção Projeto**
| Item | Tipo | Nota |
|---|---|---|
| 🛒 Ver Loja ↗ | Link externo | Abre `cd9cp1-ga.myshopify.com` em nova aba |
| 📋 Briefing | View (activa por defeito) | Apresentação para o cliente — 4 cards |
| 📸 Referências Visuais | View | Upload Cloudinary + PIN gate |
| 📅 Progresso | View | Carousel de timeline diária |

**Secção Estrutura**
| Item | Tipo | Nota |
|---|---|---|
| 🗺️ Árvore de Navegação | View | 6 ramos colapsados por defeito |
| 🏠 Anatomia da Home | View | Toggle Lista / Wireframe |
| 🛍️ Customizador Patchfy | View | Anatomia da PDP em 2 colunas |
| 🛒 Fluxo de Compra | View | 5 etapas sequenciais |
| 📄 Footer & Legais | View | 7 cards em grid |
| 🌍 Mercados & Idiomas | View | 4 mercados + card Worldwide |

**Secção Referência**
| Item | Tipo | Nota |
|---|---|---|
| 📖 Legenda | View | Referência visual dos tipos de elementos |
| 📊 Estado | View | Tracker de progresso (4 grupos, 30 tarefas) |

---

### Funcionalidades implementadas

**Layout & navegação**
- Mobile responsive — navbar superior fixa (52px) com hamburger animado (→ X), painel esquerdo deslizante (`position: fixed; translateX`), overlay com backdrop-filter, breakpoint 768px
- Label dinâmica na topbar mobile — actualiza com o nome da view activa ao navegar
- Scrollbars custom: painel esquerdo 4px, painel direito 5px, cor `#222`, track transparente

**Views existentes**
- Toggle Lista/Wireframe na Anatomia da Home
- Árvore colapsada por defeito (6 ramos, `class="vbranch collapsed"`)
- Card Worldwide na view Mercados — full-width, borda dourada

**View Referências Visuais**
- PIN gate com sessionStorage (`patchfy-refs-auth`, PIN: `1469`), shake animation no erro
- Upload via Cloudinary Upload Widget — cloud: `dhwknfiza`, preset: `Patchfy`, palette dark branded
- Galeria em localStorage (`patchfy-refs`) — cards com thumbnail (w_400,c_fill), copiar URL, remover
- Header com contagem de imagens, botão "Limpar galeria"

**View Progresso — Carousel**
- `TL_DAYS` array com 5 dias (2026-05-14 a 2026-05-18) definido em `sitemap-patchfy.js`
- Carousel de 3 cards (prev · **center** · next), grid `1fr 1.35fr 1fr`
- Setas ← → desactivadas nos extremos; fade de 150ms entre navegações
- Mini-track: barra verde com glow + 5 dots clicáveis para saltar directamente a um dia
- Botão 📅 abre popup com lista de todos os dias para navegação directa
- `lockTLHeight()` — mede a stage quando a view fica visível, guarda em `tlStageMinH`, nunca diminui → setas verticalmente estáveis
- Mobile (≤768px): prev/next `display:none`, stage em `grid-template-columns: 1fr`, 1 card por vez

**Estado actual dos TL_DAYS**
| Dia | Data | Estado | Tarefas concluídas |
|---|---|---|---|
| Dia 1 | 2026-05-14 (Qui) | Concluído | Sitemap · Domínio · Hospedagem Shopify |
| Dia 2 | 2026-05-15 (Sex) | Concluído | Refs Visuais · Briefing · início Customizador Shopify |
| Dia 3 | 2026-05-16 (Sáb) | Em progresso | Progresso + tasklist · Mobile · Briefing update |
| Dia 3 | — | Pendente | Formatação do layout da Home no Shopify |
| Dia 4 | 2026-05-17 (Dom) | A planear | — |
| Dia 5 | 2026-05-18 (Seg) | A planear | — |

---

### View Briefing — conteúdo actual
Documento orientado ao cliente (dono da Patchfy). Abre por defeito. Contém:
1. Intro com badge "Documento preparado para o cliente Patchfy"
2. Card — O que é um sitemap? (analogia com planta de arquitectura)
3. Card — A Patchfy online (o que vai ser possível fazer)
4. Card — O que está mapeado — **reorganizado em 2 secções**:
   - *Projeto:* Referências Visuais + Progresso (com ícone emoji, sem numeração)
   - *Estrutura:* ① a ⑥ Árvore · Home · Customizador · Fluxo · Footer · Mercados
5. Card — Como navegar (inclui instruções para Refs Visuais e Progresso)
6. Rodapé com contacto `dukedevcode@gmail.com` e versão `Sitemap v1.0 · Mai 2026`

### View Estado — progresso actual
| Grupo | Progresso |
|---|---|
| Sitemap Interactivo | 9 / 9 ✅ |
| Home Shopify (Liquid Sections) | 0 / 7 ⏳ |
| Customizer PDP (patchfy-dawn) | 5 / 8 |
| Infraestrutura & Deploy | 3 / 6 |

---

## Próximos passos sugeridos

O sitemap está completo. O desenvolvimento a retomar é o tema Shopify:

1. Criar as secções Liquid da Home — ver `sitemap-patchfy/HOME-IMPLEMENTATION-BRIEF.md`
2. Começar por `patchfy-home-hero.liquid` (mais visível, valida o design)
3. Push via Shopify CLI: `cd patchfy-dawn && shopify theme push --store cd9cp1-ga.myshopify.com --theme 145613127754 --allow-live`
4. Preview: `https://cd9cp1-ga.myshopify.com?preview_theme_id=145613127754`
5. Ao concluir tarefas no Shopify, actualizar `TL_DAYS` no `sitemap-patchfy.js` e fazer push

---

## Paleta & convenções (sitemap)

```css
--color-brand:   #C4A484;   /* dourado — destaques e CTAs */
--color-bg:      #0f0f0f;
--color-bg-card: #111;
--color-border:  #1e1e1e;
--color-green:   #22c55e;   /* progresso / concluído */
```

- Font: `Inter` (Google Fonts)
- Sem framework ou bundler — edições directas nos 3 ficheiros
- Dev server local: `npx serve . --listen 3000` (na raiz do projecto)
- **Cache-busting:** incrementar `?v=N` no `href`/`src` do HTML sempre que editar CSS ou JS antes de fazer commit
