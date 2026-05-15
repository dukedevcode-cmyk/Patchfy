# Patchfy — Implementação da Home no Shopify

## Contexto

Estás a trabalhar no tema **Patchfy (Craft)**, baseado em Dawn, da loja Shopify `cd9cp1-ga.myshopify.com`.

- **Theme ID:** `145613127754`
- **Diretoria local do tema:** `C:\Users\melan\Patchfy\patchfy-dawn\`
- **Moeda:** EUR · **País:** Portugal
- **Mercados:** PT 🇵🇹 · EN 🇺🇸 · ES 🇪🇸 · DE 🇩🇪

### Comandos Shopify CLI

```bash
# Push completo
cd patchfy-dawn
shopify theme push --store cd9cp1-ga.myshopify.com --theme 145613127754 --allow-live

# Push de ficheiro específico
shopify theme push --store cd9cp1-ga.myshopify.com --theme 145613127754 --only sections/patchfy-home-hero.liquid --allow-live

# Preview
# https://cd9cp1-ga.myshopify.com?preview_theme_id=145613127754
```

---

## Paleta & Design

```css
--color-brand:      #C4A484;   /* dourado quente — CTAs e destaques */
--color-bg:         #0f0f0f;   /* fundo escuro global */
--color-bg-card:    #1a1a1a;   /* cards e secções alternadas */
--color-text:       #ffffff;
--color-text-muted: #888888;
--color-border:     #2a2a2a;

/* Fontes já carregadas no tema */
/* Headings: Playfair Display */
/* Corpo:    Lato */
```

> CSS do Dawn usa variáveis RGB raw: `--color-background: 196, 164, 132` → `rgb(var(--color-background))`
> O ficheiro `patchfy-theme.css` já sobrescreve as variáveis globais. Usa prefixo `.pfy-` em todos os seletores novos.

---

## Estrutura a Implementar

A Home é composta por **6 secções Liquid independentes** + 1 template JSON.

```
patchfy-dawn/
├── sections/
│   ├── patchfy-home-hero.liquid          ← CRIAR
│   ├── patchfy-home-trust-bar.liquid     ← CRIAR
│   ├── patchfy-home-customizer.liquid    ← CRIAR
│   ├── patchfy-home-collections.liquid   ← CRIAR
│   ├── patchfy-home-social-proof.liquid  ← CRIAR
│   └── patchfy-home-cta-final.liquid     ← CRIAR
└── templates/
    └── index.json                        ← MODIFICAR (adicionar secções)
```

---

## Secção por Secção

---

### ① Hero — `patchfy-home-hero.liquid`

**Layout:** Imagem full-width com overlay escuro + texto e CTAs centrados.  
**Rácio:** 80% imagem · 20% texto

**Conteúdo (editável no admin via schema):**
- `heading` — Headline principal (ex: "O teu patch. A tua história.")
- `subheading` — Subtítulo (ex: "Bordado à mão, feito para durar.")
- `image` — Imagem de fundo (jaqueta com patches, fundo escuro)
- `cta_primary_label` + `cta_primary_url` — Botão principal → `/products/patch-bordado-personalizado`
- `cta_secondary_label` + `cta_secondary_url` — Botão secundário → `/collections`

**HTML de referência:**
```html
<section class="pfy-hero">
  <div class="pfy-hero__bg">
    <!-- imagem via {{ section.settings.image | image_url | image_tag }} -->
    <div class="pfy-hero__overlay"></div>
  </div>
  <div class="pfy-hero__content page-width">
    <h1 class="pfy-hero__heading">{{ section.settings.heading }}</h1>
    <p class="pfy-hero__sub">{{ section.settings.subheading }}</p>
    <div class="pfy-hero__ctas">
      <a href="{{ section.settings.cta_primary_url }}" class="pfy-btn pfy-btn--primary">
        {{ section.settings.cta_primary_label }}
      </a>
      <a href="{{ section.settings.cta_secondary_url }}" class="pfy-btn pfy-btn--ghost">
        {{ section.settings.cta_secondary_label }}
      </a>
    </div>
  </div>
</section>
```

**CSS:** hero min-height 90vh, overlay `rgba(0,0,0,0.55)`, texto centrado, heading `font-size: clamp(2.5rem, 6vw, 5rem)`.

---

### ② Barra de Confiança — `patchfy-home-trust-bar.liquid`

**Layout:** 4 itens em linha horizontal, separados por divisores verticais.  
**Rácio:** 100% texto/ícones

**Itens fixos (sem schema necessário, ou usar blocks):**
1. 🧵 +5.000 patches entregues
2. ⭐ 4.9 avaliações
3. 🚚 Envio para PT · ES · DE · USA
4. ✅ Garantia de qualidade

**HTML de referência:**
```html
<section class="pfy-trust">
  <div class="pfy-trust__inner page-width">
    <div class="pfy-trust__item">🧵 <span>+5.000 patches entregues</span></div>
    <div class="pfy-trust__item">⭐ <span>4.9 avaliações</span></div>
    <div class="pfy-trust__item">🚚 <span>Envio PT · ES · DE · USA</span></div>
    <div class="pfy-trust__item">✅ <span>Garantia de qualidade</span></div>
  </div>
</section>
```

**CSS:** fundo `#111`, `display: flex`, `justify-content: center`, `gap: 2rem`, `border-top/bottom: 1px solid #2a2a2a`, `padding: 1.2rem 0`, `font-size: 0.85rem`, `color: #aaa`.

---

### ③ Destaque Customizer — `patchfy-home-customizer.liquid`

**Layout:** 2 colunas 50/50. Esquerda: imagem/screenshot. Direita: texto + 3 passos + CTA.  
**Rácio:** 50% imagem · 50% texto

**Schema settings:**
- `image` — screenshot ou mockup do customizer
- `heading` — "Cria o teu patch em minutos"
- `step_1/2/3` — texto dos 3 passos
- `cta_label` + `cta_url`

**HTML de referência:**
```html
<section class="pfy-customizer-highlight">
  <div class="pfy-customizer-highlight__inner page-width">
    <div class="pfy-customizer-highlight__media">
      {{ section.settings.image | image_url: width: 800 | image_tag }}
    </div>
    <div class="pfy-customizer-highlight__content">
      <h2>{{ section.settings.heading }}</h2>
      <ol class="pfy-steps">
        <li>{{ section.settings.step_1 }}</li>
        <li>{{ section.settings.step_2 }}</li>
        <li>{{ section.settings.step_3 }}</li>
      </ol>
      <a href="{{ section.settings.cta_url }}" class="pfy-btn pfy-btn--primary">
        {{ section.settings.cta_label }}
      </a>
    </div>
  </div>
</section>
```

**CSS:** `display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center`. Mobile: 1 coluna. Fundo alternado `#111`.

---

### ④ Coleções em Destaque — `patchfy-home-collections.liquid`

**Layout:** Grid 4 colunas (desktop) / 2×2 (mobile). Cada card: imagem + título + link.  
**Rácio:** 70% imagem · 30% texto

**Usar collections do Shopify via schema (tipo `collection`):**

```liquid
{% for block in section.blocks %}
  {% assign col = block.settings.collection %}
  <a href="{{ col.url }}" class="pfy-col-card">
    {{ col.featured_image | image_url: width: 600 | image_tag }}
    <div class="pfy-col-card__overlay">
      <span>{{ col.title }}</span>
      <span class="pfy-col-card__cta">Ver →</span>
    </div>
  </a>
{% endfor %}
```

**Schema:** `type: "collection"`, max_blocks: 4. Admin pode escolher as 4 coleções.

**CSS:** cards com `aspect-ratio: 1`, `overflow: hidden`, overlay com `background: linear-gradient(to top, rgba(0,0,0,0.7), transparent)`, hover scale `1.04`.

---

### ⑤ Prova Social — `patchfy-home-social-proof.liquid`

**Layout:** Título centrado + grid de fotos + 2-3 reviews em texto.  
**Rácio:** 75% imagem · 25% texto

**Schema (blocks):**
- Bloco `photo`: campo `image`
- Bloco `review`: `author`, `text`, `stars` (1-5)

**HTML de referência:**
```html
<section class="pfy-social-proof">
  <div class="page-width">
    <h2 class="pfy-section-title">Os nossos clientes, as suas histórias</h2>
    <div class="pfy-ugc-grid">
      <!-- fotos dos clientes -->
    </div>
    <div class="pfy-reviews">
      <!-- reviews em cards -->
    </div>
  </div>
</section>
```

---

### ⑥ CTA Final — `patchfy-home-cta-final.liquid`

**Layout:** Centrado, fundo de contraste, headline + 2 botões.  
**Rácio:** 100% texto

```html
<section class="pfy-cta-final">
  <div class="page-width pfy-cta-final__inner">
    <h2>{{ section.settings.heading }}</h2>
    <div class="pfy-cta-final__btns">
      <a href="/products/patch-bordado-personalizado" class="pfy-btn pfy-btn--primary">
        ✏️ Personalizar agora
      </a>
      <a href="/collections" class="pfy-btn pfy-btn--ghost">
        Ver todas as coleções
      </a>
    </div>
  </div>
</section>
```

**CSS:** `background: #111`, `padding: 5rem 2rem`, `text-align: center`.

---

## Template — `templates/index.json`

Substituir o conteúdo atual do `index.json` por:

```json
{
  "sections": {
    "pfy-hero": {
      "type": "patchfy-home-hero",
      "settings": {
        "heading": "O teu patch. A tua história.",
        "subheading": "Bordado à mão, feito para durar.",
        "cta_primary_label": "✏️ Personalizar agora",
        "cta_primary_url": "/products/patch-bordado-personalizado",
        "cta_secondary_label": "Ver Coleções",
        "cta_secondary_url": "/collections"
      }
    },
    "pfy-trust": {
      "type": "patchfy-home-trust-bar",
      "settings": {}
    },
    "pfy-customizer": {
      "type": "patchfy-home-customizer",
      "settings": {
        "heading": "Cria o teu patch em minutos",
        "step_1": "Escolhe a forma e o tamanho",
        "step_2": "Adiciona texto, cores e bordas",
        "step_3": "Recebe em casa em poucos dias",
        "cta_label": "Começar agora →",
        "cta_url": "/products/patch-bordado-personalizado"
      }
    },
    "pfy-collections": {
      "type": "patchfy-home-collections",
      "blocks": {},
      "settings": {
        "heading": "Coleções em Destaque"
      }
    },
    "pfy-social": {
      "type": "patchfy-home-social-proof",
      "blocks": {},
      "settings": {
        "heading": "Os nossos clientes, as suas histórias"
      }
    },
    "pfy-cta": {
      "type": "patchfy-home-cta-final",
      "settings": {
        "heading": "Pronto para criar o teu patch?"
      }
    }
  },
  "order": [
    "pfy-hero",
    "pfy-trust",
    "pfy-customizer",
    "pfy-collections",
    "pfy-social",
    "pfy-cta"
  ]
}
```

---

## Regras importantes

1. **Prefixo `.pfy-`** em todos os seletores CSS — nunca sobrescrever classes do Dawn
2. **`page-width`** é a classe Dawn para limitar largura — usar em todas as secções
3. **Schema obrigatório** em cada secção para ser editável no admin visual
4. **Mobile-first** — testar em 375px, depois 768px, depois 1200px+
5. **Não usar `!important`** — o `patchfy-theme.css` já tem cascade correta
6. **Imagens**: usar sempre `image_url` + `image_tag` do Liquid (lazy loading automático)
7. **Botões**: classes `.pfy-btn .pfy-btn--primary` (fundo `#C4A484`, texto escuro) e `.pfy-btn--ghost` (borda `#C4A484`, fundo transparente)

---

## Ordem de implementação sugerida

1. `patchfy-home-hero.liquid` — é o mais visível, valida o design primeiro
2. `patchfy-home-trust-bar.liquid` — simples, sem imagens
3. `templates/index.json` — activa as secções
4. `patchfy-home-customizer.liquid`
5. `patchfy-home-collections.liquid`
6. `patchfy-home-social-proof.liquid`
7. `patchfy-home-cta-final.liquid`

Fazer push e preview após cada secção.
