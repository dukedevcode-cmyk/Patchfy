# Patchfy — Documentação do Projeto

Configurador de patches bordados personalizado. Interface web estática (HTML + CSS + JS puro, sem framework ou bundler).

## Dev Server

```bash
npx serve . --listen 3000 --no-clipboard
```

Configuração salva em `.claude/launch.json`. Use `preview_start "Patchfy Dev Server"` para iniciar.

---

## Arquitetura

### Arquivos principais
| Arquivo | Responsabilidade |
|---------|-----------------|
| `index.html` | Estrutura HTML, carregamento de fontes Google Fonts |
| `style.css` | Estilos (inclui `@font-face` de fontes locais no topo) |
| `script.js` | Toda a lógica de estado, renderização e carrinho |
| `fonts/` | Fontes locais TTF/OTF para preview |

### Sem build step
Não há `package.json`, webpack, Vite ou qualquer bundler. Edições nos arquivos são servidas diretamente pelo `npx serve`.

---

## Estado (`state`)

```js
state = {
  shape: "rounded",      // "rounded" | "circle" | "rocker" | "top-arc" | "bottom-arc" | "dual"
  dualActiveSlot: 0,     // 0 = superior, 1 = inferior (só em modo dual)
  quantity: 1,
  slots: [slot0, slot1]  // slot1 só é usado em modo dual
}
```

### Slot (por patch)
```js
{
  text: "Seu Nome",
  font: "Georgia",
  textColor: "#FFFFFF",
  bgColor: "#121212",
  borderColor: "#FFFFFF",
  widthCm: 30,        // tamanho disponível: [25, 28, 30, 33, 36, 40]
  textWidthCm: 15     // largura do texto em cm (min: widthCm/2, max: widthCm*0.80)
}
```

---

## Constantes críticas

```js
const REFERENCE_CM = 30;        // patch de referência = 30cm
const PREVIEW_W_AT_REF = 280;   // largura em px do preview para 30cm

// Arcos SVG
const ARC_CURVE_INSET = 0.32;   // profundidade do recuo lateral do arco
const ARC_BUMP = 0.24;          // intensidade da curvatura

// Fração da deflexão do arco aplicada ao text path (< 1 = texto menos curvado)
const TEXT_CURVE_RATIO = 0.72;
```

### Conversão cm → px
```js
getPatchWidthPx(slot)  = Math.round((slot.widthCm / REFERENCE_CM) * PREVIEW_W_AT_REF)
getTextWidthPx(slot)   = Math.round((slot.textWidthCm / REFERENCE_CM) * PREVIEW_W_AT_REF)
getMaxTextWidthCm(w)   = Math.round(w * 0.80 * 2) / 2   // arredondado a 0.5cm
```

---

## Renderização

### Shapes div (rounded, circle, rocker)
- `renderDivPatch()` cria um `<span>` com `transform: scaleX(ratio)` para forçar o texto a ocupar exatamente `textWidthCm` em largura
- `measureTextWidthPx()` usa Canvas API para medir a largura natural do texto antes de escalar
- Hard cap: `safeMaxPx = w - 32` (borda 8px × 2 + breathing 8px × 2)
- `font-size = h * 0.45`

### Shapes SVG (top-arc, bottom-arc)
- `renderArcSvg()` gera SVG com `<textPath>` + atributo `textLength` + `lengthAdjust="spacingAndGlyphs"`
- Hard cap: `arcTextPx = Math.min(getTextWidthPx(slot), w * 0.80)`
- `font-size = h * 0.28` (≈ 70% da altura da faixa)

#### ⚠️ Inversão de nomes das funções de arco
As funções de geometria têm os nomes "invertidos" em relação ao `arcKind` — isso é intencional:

| `arcKind` (parâmetro) | Outline usado | Text path usado | Aparência visual |
|---|---|---|---|
| `"top-arc"` | `bottomArchOutlineD` | `bottomArchTextPathD` | Arco para **cima** (rocker superior) |
| `"bottom-arc"` | `topArchOutlineD` | `topArchTextPathD` | Arco para **baixo** (rocker inferior) |

**Não "corrigir" essa inversão** — ela foi feita deliberadamente porque as funções `top/bottom` geram o arco visualmente oposto ao nome.

#### Text paths
```js
// top-arc: endpoints em h*0.5, ctrl acima → mesma deflexão do outer edge
bottomArchTextPathD: yCtrl = h * (0.5 - ARC_CURVE_INSET * TEXT_CURVE_RATIO)

// bottom-arc: endpoints em h*0.56 (deslocado para baixo para dar folga da borda superior)
topArchTextPathD:    yCtrl = h * 0.56 + h * ARC_CURVE_INSET * TEXT_CURVE_RATIO
```

---

## Modo Dual (Superior + Inferior)

Ativado com `state.shape = "dual"`.

- `slots[0]` → renderizado como `top-arc` em `#patch-preview-top`
- `slots[1]` → renderizado como `bottom-arc` em `#patch-preview-bottom`
- `#dual-patch-target` com botões "Patch superior / Patch inferior" alterna `state.dualActiveSlot`
- `syncControlsFromActiveSlot()` sincroniza todos os controles com o slot ativo
- CSS: `.preview-stack--dual` ativa `gap: 20px` e exibe `#patch-preview-bottom`

---

## Fontes

### Google Fonts (fallbacks)
Carregadas em dois `<link>` no `<head>` do `index.html`. Cada fonte Wilcom é mapeada para um substituto visual próximo em `FONT_PREVIEW_MAP` no `script.js`.

### Fontes locais (via `@font-face` no topo do `style.css`)
| Font-family CSS | Arquivo | Fonte Wilcom |
|---|---|---|
| `"OldLondon"` | `fonts/OldLondon.ttf` | Old London |
| `"OldEnglishTextMT"` | `fonts/oldenglishtextmt.ttf` | Old English |

Para adicionar nova fonte local: (1) colocar o arquivo em `fonts/`, (2) adicionar `@font-face` no topo do `style.css`, (3) mapear em `FONT_PREVIEW_MAP` no `script.js`.

---

## Carrinho

Persiste em `localStorage` (`patchfy-cart`). Cada item é o payload de `buildCartPayload()`:

```js
{
  quantity: 1,
  shape: "dual",
  mode: "dual",           // "single" | "dual"
  patches: [
    { slot: "upper", text, font, textColor, backgroundColor, borderColor, widthCm, geometry: "top-arch" },
    { slot: "lower", ..., geometry: "bottom-arch" }
  ]
}
```

---

## Decisões de design tomadas

- **Sem `text-transform: uppercase`** no `.patch-preview` — texto respeita exatamente o que o usuário digitar
- **`TEXT_CURVE_RATIO = 0.72`** — texto curva ligeiramente menos que o arco externo (mais legível)
- **`ARC_CURVE_INSET = 0.32` / `ARC_BUMP = 0.24`** — curvatura mais acentuada que os defaults originais (0.28 / 0.14)
- **`topArchTextPathD` usa `yChord = h*0.56`** (não h*0.5) — com h*0.5 o topo do glifo ficava a ~5px da borda interna
- **`getMaxTextWidthCm = widthCm * 0.80`** — caps no slider e no render garantem que o texto nunca ultrapasse a borda em nenhum shape
- **Largura do texto usa `scaleX` (divs) e `textLength` (SVG)** — controla a largura em cm real, não o font-size
