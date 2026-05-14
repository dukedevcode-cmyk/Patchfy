const previewTop = document.getElementById("patch-preview-top");
const previewBottom = document.getElementById("patch-preview-bottom");
const previewStack = document.getElementById("preview-stack");
const dualPatchTarget = document.getElementById("dual-patch-target");
const dualSlotButtons = dualPatchTarget.querySelectorAll(".segmented__btn");

const shapeSelect = document.getElementById("shape-select");
const textInput = document.getElementById("text-input");
const textColorSwatches = document.getElementById("text-color-swatches");
const bgColorSwatches = document.getElementById("bg-color-swatches");
const borderColorSwatches = document.getElementById("border-color-swatches");
const sizeRange = document.getElementById("size-range");
const sizeReadout = document.getElementById("size-readout");
const fontSizeRange = document.getElementById("font-size-range");
const fontSizeReadout = document.getElementById("font-size-readout");

const fontPicker = document.getElementById("font-picker");
const fontPickerTrigger = document.getElementById("font-picker-trigger");
const fontPickerList = document.getElementById("font-picker-list");
const fontPickerTriggerSample = document.getElementById("font-picker-trigger-sample");
const fontPickerTriggerLabel = document.getElementById("font-picker-trigger-label");

const quantitySelect = document.getElementById("quantity-select");
const addToCartBtn = document.getElementById("add-to-cart");
const toastEl = document.getElementById("toast");

const WIDTH_CM = [25, 28, 30, 33, 36, 40];
const REFERENCE_CM = 30;
const PREVIEW_W_AT_REF = 280;

const FONT_OPTIONS = [
  "Algerian",
  "Amarilo",
  "Arial Rounded",
  "Bauhaus",
  "BravoSC",
  "Cooper",
  "FTY Ironhorse",
  "Franklin Gothic",
  "Georgia",
  "Hessian",
  "Hobo",
  "Jersey",
  "Killer",
  "Morris Roman",
  "Motorhead",
  "Old London",
  "Old English",
  "Pointedly",
  "PR Viking",
  "Railroad",
  "Railroader",
  "Rockwell",
  "Rye",
  "Sectar",
  "Script",
  "Stars & Love",
  "Stencil",
  "Trajan",
  "Viking",
  "Western"
];

// Maps each embroidery font to its Google Fonts fallback.
// No local() — browser always loads the web font for a consistent preview.
const FONT_PREVIEW_MAP = {
  Algerian:          "Pirata One",
  Amarilo:           "Parisienne",
  "Arial Rounded":   "Nunito",
  Bauhaus:           "Josefin Sans",
  BravoSC:           "Bebas Neue",
  Cooper:            "Ultra",
  "FTY Ironhorse":   "Teko",
  "Franklin Gothic": "Oswald",
  Georgia:           null,
  Hessian:           "UnifrakturMaguntia",
  Hobo:              "Righteous",
  Jersey:            "Jersey 10",
  Killer:            "Boogaloo",
  "Morris Roman":    "MedievalSharp",
  Motorhead:         "Metal Mania",
  "Old London":      "OldLondon",       // local: fonts/OldLondon.ttf
  "Old English":     "OldEnglishTextMT", // local: fonts/oldenglishtextmt.ttf
  Pointedly:         "Poiret One",
  "PR Viking":       "Cinzel Decorative",
  Railroad:          "Special Elite",
  Railroader:        "Rock Salt",
  Rockwell:          "Arvo",
  Rye:               "Rye",
  Sectar:            "Orbitron",
  Script:            "Dancing Script",
  "Stars & Love":    "Pacifico",
  Stencil:           "Stardos Stencil",
  Trajan:            "Cinzel",
  Viking:            "Germania One",
  Western:           "Rye"
};

function fontFamilyCss(name) {
  if (name === "Georgia") return 'Georgia, "Times New Roman", serif';
  const web = FONT_PREVIEW_MAP[name];
  if (!web) return "sans-serif";
  return `"${web}", sans-serif`;
}

for (const f of FONT_OPTIONS) {
  if (!(f in FONT_PREVIEW_MAP)) {
    console.error("[Patchfy] Missing FONT_PREVIEW_MAP entry:", f);
  }
}

const PALETTE_EMBROIDERY = [
  { label: "Branco", value: "#FFFFFF" },
  { label: "Creme", value: "#F5F0E6" },
  { label: "Preto", value: "#121212" },
  { label: "Marinho", value: "#1E3A5F" },
  { label: "Vermelho", value: "#C41E3A" },
  { label: "Azul royal", value: "#2563EB" },
  { label: "Dourado", value: "#C5A572" },
  { label: "Cinza prata", value: "#9CA3AF" },
  { label: "Verde floresta", value: "#14532D" },
  { label: "Bordô", value: "#7F1D1D" }
];

const PALETTE_BACKGROUND = [
  { label: "Preto", value: "#121212" },
  { label: "Branco", value: "#FFFFFF" },
  { label: "Marinho", value: "#1E3A5F" },
  { label: "Azul royal", value: "#1D4ED8" },
  { label: "Vermelho", value: "#B91C1C" },
  { label: "Verde floresta", value: "#14532D" },
  { label: "Cinza", value: "#6B7280" },
  { label: "Cáqui", value: "#C3B091" },
  { label: "Creme", value: "#F5F0E6" },
  { label: "Bordô", value: "#7F1D1D" }
];

const PALETTE_BORDER = [
  { label: "Branco", value: "#FFFFFF" },
  { label: "Preto", value: "#121212" },
  { label: "Marinho", value: "#1E3A5F" },
  { label: "Dourado", value: "#C5A572" },
  { label: "Prata", value: "#D1D5DB" },
  { label: "Vermelho", value: "#C41E3A" },
  { label: "Azul royal", value: "#2563EB" },
  { label: "Verde floresta", value: "#166534" }
];

const ARC_CURVE_INSET = 0.32;
const ARC_BUMP = 0.24;

function defaultSlot() {
  return {
    text: "Seu Nome",
    font: "Georgia",
    textColor: "#FFFFFF",
    bgColor: "#121212",
    borderColor: "#FFFFFF",
    widthCm: 30,
    textWidthCm: 15
  };
}

const state = {
  shape: "rounded",
  dualActiveSlot: 0,
  quantity: 1,
  slots: [defaultSlot(), { ...defaultSlot(), text: "Seu Texto" }]
};

function isDualMode() {
  return state.shape === "dual";
}

function getActiveSlot() {
  return state.slots[isDualMode() ? state.dualActiveSlot : 0];
}

function getPatchWidthPx(slot) {
  return Math.round((slot.widthCm / REFERENCE_CM) * PREVIEW_W_AT_REF);
}

function getTextWidthPx(slot) {
  return Math.round((slot.textWidthCm / REFERENCE_CM) * PREVIEW_W_AT_REF);
}

function getPreviewContainerWidth() {
  const stack = document.getElementById("preview-stack");
  if (!stack) return PREVIEW_W_AT_REF;
  const w = stack.clientWidth;
  return w > 0 ? w : PREVIEW_W_AT_REF;
}

// Safe maximum text width — conservatively 80% of patch width so text never
// bleeds past the border on any shape (div or SVG arc).
function getMaxTextWidthCm(widthCm) {
  return Math.round(widthCm * 0.80 * 2) / 2; // nearest 0.5 cm
}

function measureTextWidthPx(text, fontFamily, fontSize) {
  const canvas = measureTextWidthPx._canvas || (measureTextWidthPx._canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

function getPatchHeightPx(geomShape, slot) {
  const w = getPatchWidthPx(slot);
  if (geomShape === "circle") return w;
  return Math.round(w * (140 / PREVIEW_W_AT_REF));
}

function bottomArchOutlineD(w, h) {
  const yTop = h * ARC_CURVE_INSET;
  const yBot = h * (1 - ARC_CURVE_INSET);
  const ctrlBotY = Math.max(yTop + h * 0.06, yBot - h * ARC_BUMP);
  return `M 0 ${yTop} Q ${w / 2} 0 ${w} ${yTop} L ${w} ${yBot} Q ${w / 2} ${ctrlBotY} 0 ${yBot} Z`;
}

function topArchOutlineD(w, h) {
  const yTop = h * ARC_CURVE_INSET;
  const yBot = h * (1 - ARC_CURVE_INSET);
  const ctrlTopY = Math.min(yBot - h * 0.06, yTop + h * ARC_BUMP);
  return `M 0 ${yTop} Q ${w / 2} ${ctrlTopY} ${w} ${yTop} L ${w} ${yBot} Q ${w / 2} ${h} 0 ${yBot} Z`;
}

// Fraction of the outline deflection applied to the text path (< 1 = less curved).
const TEXT_CURVE_RATIO = 0.72;

function bottomArchTextPathD(w, h) {
  const yChord = h * 0.5;
  const yCtrl = h * (0.5 - ARC_CURVE_INSET * TEXT_CURVE_RATIO);
  return `M ${w * 0.07} ${yChord} Q ${w / 2} ${yCtrl} ${w * 0.93} ${yChord}`;
}

function topArchTextPathD(w, h) {
  // Push endpoints down from band center to clear the inner (top) edge —
  // at h*0.5 the top of the glyph (font-size h*0.28) sits only ~5 px from
  // the inner border; h*0.56 gives comfortable breathing room on both edges.
  const yChord = h * 0.56;
  const yCtrl = yChord + h * ARC_CURVE_INSET * TEXT_CURVE_RATIO;
  return `M ${w * 0.07} ${yChord} Q ${w / 2} ${yCtrl} ${w * 0.93} ${yChord}`;
}

const shapes = {
  rounded: (el) => {
    el.style.borderRadius = "18px";
    el.style.clipPath = "";
  },
  circle: (el) => {
    el.style.borderRadius = "999px";
    el.style.clipPath = "";
  },
  rocker: (el) => {
    el.style.borderRadius = "0";
    el.style.clipPath = "ellipse(100% 60% at 50% 50%)";
  }
};

const NS = "http://www.w3.org/2000/svg";
let pathIdSeq = 0;

function nextTextPathId() {
  pathIdSeq += 1;
  return `arc-tp-${pathIdSeq}`;
}

function fillSelect(select, items, selectedValue) {
  select.replaceChildren();
  for (const { label, value } of items) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    select.appendChild(o);
  }
  if (items.some((i) => i.value === selectedValue)) {
    select.value = selectedValue;
  } else {
    select.value = items[0].value;
  }
}

function hexLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function buildSwatches(container, palette, currentValue, onChange) {
  container.replaceChildren();
  for (const { label, value } of palette) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-checked", value === currentValue ? "true" : "false");
    btn.title = label;
    btn.dataset.value = value;
    btn.style.setProperty("--swatch-color", value);
    if (value === currentValue) btn.classList.add("is-selected");
    if (hexLuminance(value) > 0.85) btn.classList.add("color-swatch--light");

    btn.addEventListener("click", () => {
      container.querySelectorAll(".color-swatch").forEach((s) => {
        s.classList.remove("is-selected");
        s.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-checked", "true");
      onChange(value);
    });
    container.appendChild(btn);
  }
}

function syncSizeSlider() {
  const slot = getActiveSlot();
  const idx = WIDTH_CM.indexOf(slot.widthCm);
  sizeRange.value = String(idx >= 0 ? idx : WIDTH_CM.indexOf(30));
}

function updateSizeReadout() {
  const slot = getActiveSlot();
  sizeReadout.textContent = `${slot.widthCm} cm`;
}

function updateFontSizeReadout() {
  const slot = getActiveSlot();
  fontSizeReadout.textContent = `${slot.textWidthCm} cm`;
}

function syncFontSizeSlider() {
  const slot = getActiveSlot();
  const min = slot.widthCm / 2;
  const max = getMaxTextWidthCm(slot.widthCm);
  fontSizeRange.min = String(min);
  fontSizeRange.max = String(max);
  fontSizeRange.step = "0.5";
  const clamped = Math.min(max, Math.max(min, slot.textWidthCm ?? min));
  slot.textWidthCm = clamped;
  fontSizeRange.value = String(clamped);
}

function setDualUiVisible(visible) {
  dualPatchTarget.hidden = !visible;
  dualPatchTarget.style.display = visible ? "" : "none";
}

function updateDualPatchVisibility() {
  const dual = isDualMode();
  previewStack.classList.toggle("preview-stack--dual", dual);
  previewBottom.setAttribute("aria-hidden", dual ? "false" : "true");

  if (!dual) {
    previewBottom.replaceChildren();
    previewBottom.classList.remove("patch-preview--arc");
    previewBottom.textContent = "";
    previewBottom.style.width = "";
    previewBottom.style.height = "";
  }
}

function setDualSlotButtons() {
  dualSlotButtons.forEach((btn) => {
    const idx = Number(btn.dataset.slot);
    const active = isDualMode() && state.dualActiveSlot === idx;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setFontPickerOpen(open) {
  fontPicker.classList.toggle("is-open", open);
  fontPickerList.hidden = !open;
  fontPickerTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    fontPickerList.focus({ preventScroll: true });
  }
}

function syncFontPickerFromSlot() {
  const slot = getActiveSlot();
  const stack = fontFamilyCss(slot.font);
  fontPickerTriggerSample.style.fontFamily = stack;
  fontPickerTriggerLabel.textContent = slot.font;

  fontPickerList.querySelectorAll(".font-picker__option").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.font === slot.font);
  });
}

function buildFontPickerList() {
  fontPickerList.replaceChildren();
  for (const name of FONT_OPTIONS) {
    const li = document.createElement("li");
    li.setAttribute("role", "none");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "font-picker__option";
    btn.setAttribute("role", "option");
    btn.dataset.font = name;

    const sample = document.createElement("span");
    sample.className = "font-picker__option-sample";
    sample.textContent = "Aa Patch";
    sample.style.fontFamily = fontFamilyCss(name);

    const lab = document.createElement("span");
    lab.className = "font-picker__option-name";
    lab.textContent = name;
    lab.style.fontFamily = "var(--font-sans)";

    btn.appendChild(sample);
    btn.appendChild(lab);
    btn.addEventListener("click", () => {
      getActiveSlot().font = name;
      syncFontPickerFromSlot();
      setFontPickerOpen(false);
      renderPatch();
    });
    li.appendChild(btn);
    fontPickerList.appendChild(li);
  }
}

function syncControlsFromActiveSlot() {
  const slot = getActiveSlot();
  textInput.value = slot.text;
  syncFontPickerFromSlot();
  buildSwatches(textColorSwatches, PALETTE_EMBROIDERY, slot.textColor, (val) => {
    getActiveSlot().textColor = val;
    renderPatch();
  });
  buildSwatches(bgColorSwatches, PALETTE_BACKGROUND, slot.bgColor, (val) => {
    getActiveSlot().bgColor = val;
    renderPatch();
  });
  buildSwatches(borderColorSwatches, PALETTE_BORDER, slot.borderColor, (val) => {
    getActiveSlot().borderColor = val;
    renderPatch();
  });
  syncSizeSlider();
  updateSizeReadout();
  syncFontSizeSlider();
  updateFontSizeReadout();
}

function renderArcSvg(el, arcKind, slot) {
  const rawW = getPatchWidthPx(slot);
  const availW = getPreviewContainerWidth();
  const scale = (rawW > availW && availW > 0) ? availW / rawW : 1;
  const w = Math.round(rawW * scale);
  const h = Math.round(w * (140 / PREVIEW_W_AT_REF));
  // "top-arc" → visually arches upward (bottom rocker outline, text follows top edge)
  // "bottom-arc" → visually arches downward (top rocker outline, text follows bottom edge)
  const outlineD =
    arcKind === "top-arc" ? bottomArchOutlineD(w, h) : topArchOutlineD(w, h);
  const textCurveD =
    arcKind === "top-arc" ? bottomArchTextPathD(w, h) : topArchTextPathD(w, h);
  const textPathId = nextTextPathId();
  const strokeW = Math.max(5, Math.round(w * 0.028));

  el.replaceChildren();
  el.classList.add("patch-preview--arc");

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const defs = document.createElementNS(NS, "defs");

  const textPathCurve = document.createElementNS(NS, "path");
  textPathCurve.setAttribute("id", textPathId);
  textPathCurve.setAttribute("d", textCurveD);
  textPathCurve.setAttribute("fill", "none");
  defs.appendChild(textPathCurve);
  svg.appendChild(defs);

  const pathFill = document.createElementNS(NS, "path");
  pathFill.setAttribute("d", outlineD);
  pathFill.setAttribute("fill", slot.bgColor);
  pathFill.setAttribute("stroke", slot.borderColor);
  pathFill.setAttribute("stroke-width", String(strokeW));
  pathFill.setAttribute("stroke-linejoin", "round");
  pathFill.setAttribute("stroke-linecap", "round");
  pathFill.setAttribute("paint-order", "fill stroke");
  svg.appendChild(pathFill);

  const textEl = document.createElementNS(NS, "text");
  textEl.setAttribute("fill", slot.textColor);
  textEl.setAttribute("font-family", fontFamilyCss(slot.font));
  // Band height ≈ 40% of h; use ~70% of that so text breathes within the band
  textEl.setAttribute("font-size", String(Math.round(h * 0.28)));
  textEl.setAttribute("font-weight", "700");
  textEl.setAttribute("dominant-baseline", "middle");

  const tp = document.createElementNS(NS, "textPath");
  tp.setAttribute("href", `#${textPathId}`);
  tp.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${textPathId}`);
  tp.setAttribute("startOffset", "50%");
  tp.setAttribute("text-anchor", "middle");
  // Hard cap: text path goes from 7% to 93% of w (~86%), keep 80% as safe limit
  const arcTextPx = Math.min(Math.round(getTextWidthPx(slot) * scale), Math.round(w * 0.80));
  tp.setAttribute("textLength", String(arcTextPx));
  tp.setAttribute("lengthAdjust", "spacingAndGlyphs");
  tp.textContent = slot.text;

  textEl.appendChild(tp);
  svg.appendChild(textEl);

  el.appendChild(svg);

  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.border = "none";
  el.style.background = "transparent";
  el.style.clipPath = "none";
  el.style.borderRadius = "0";
}

function renderDivPatch(el, geomShape, slot) {
  el.classList.remove("patch-preview--arc");
  el.replaceChildren();

  const rawW = getPatchWidthPx(slot);
  const availW = getPreviewContainerWidth();
  const scale = (rawW > availW && availW > 0) ? availW / rawW : 1;
  const w = Math.round(rawW * scale);
  const h = geomShape === "circle" ? w : Math.round(w * (140 / PREVIEW_W_AT_REF));
  const baseFontSize = Math.round(h * 0.45);
  // Hard cap: text must stay inside inner area (border 8px × 2 + breathing 8px × 2)
  const safeMaxPx = w - 32;
  const targetTextPx = Math.min(Math.round(getTextWidthPx(slot) * scale), safeMaxPx);
  const fontStack = fontFamilyCss(slot.font);
  const naturalWidth = measureTextWidthPx(slot.text, fontStack, baseFontSize);
  const scaleX = naturalWidth > 0 ? targetTextPx / naturalWidth : 1;

  const textSpan = document.createElement("span");
  textSpan.textContent = slot.text;
  textSpan.style.display = "inline-block";
  textSpan.style.whiteSpace = "nowrap";
  textSpan.style.lineHeight = "1";
  textSpan.style.transformOrigin = "center center";
  textSpan.style.transform = `scaleX(${scaleX.toFixed(4)})`;

  // Inner wrapper separates overflow clipping (outer) from flex centering (inner).
  // iOS Safari has a bug where overflow:hidden on a flex container breaks centering.
  const centerWrap = document.createElement("div");
  centerWrap.style.position = "absolute";
  centerWrap.style.inset = "0";
  centerWrap.style.display = "flex";
  centerWrap.style.justifyContent = "center";
  centerWrap.style.alignItems = "center";
  centerWrap.appendChild(textSpan);

  el.appendChild(centerWrap);
  el.style.display = "block";
  el.style.position = "relative";
  el.style.fontFamily = fontStack;
  el.style.fontSize = `${baseFontSize}px`;
  el.style.overflow = "hidden";
  el.style.color = slot.textColor;
  el.style.backgroundColor = slot.bgColor;
  el.style.border = "";
  el.style.borderColor = slot.borderColor;
  el.style.width = `${w}px`;
  el.style.borderRadius = "";
  el.style.clipPath = "";
  el.style.height = `${h}px`;

  shapes[geomShape]?.(el, slot);
}

function renderInto(el, geomShape, slot) {
  if (geomShape === "top-arc" || geomShape === "bottom-arc") {
    renderArcSvg(el, geomShape, slot);
    return;
  }
  renderDivPatch(el, geomShape, slot);
}

function renderPatch() {
  updateDualPatchVisibility();

  if (isDualMode()) {
    setDualUiVisible(true);
    setDualSlotButtons();
    renderInto(previewTop, "top-arc", state.slots[0]);
    renderInto(previewBottom, "bottom-arc", state.slots[1]);
    return;
  }

  setDualUiVisible(false);
  renderInto(previewTop, state.shape, state.slots[0]);
}

function serializeSlot(index) {
  const slot = state.slots[index];
  return {
    slot: index === 0 ? "upper" : "lower",
    text: slot.text,
    font: slot.font,
    textColor: slot.textColor,
    backgroundColor: slot.bgColor,
    borderColor: slot.borderColor,
    widthCm: slot.widthCm
  };
}

function buildCartPayload() {
  const base = {
    quantity: state.quantity,
    shape: state.shape
  };

  if (isDualMode()) {
    return {
      ...base,
      mode: "dual",
      patches: [
        { ...serializeSlot(0), geometry: "top-arch" },
        { ...serializeSlot(1), geometry: "bottom-arch" }
      ]
    };
  }

  return {
    ...base,
    mode: "single",
    patches: [{ ...serializeSlot(0), geometry: state.shape }]
  };
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  requestAnimationFrame(() => {
    toastEl.classList.add("is-visible");
  });
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
    window.setTimeout(() => {
      toastEl.hidden = true;
    }, 320);
  }, 3200);
}

shapeSelect.addEventListener("change", (e) => {
  state.shape = e.target.value;
  if (!isDualMode()) {
    state.dualActiveSlot = 0;
  }
  syncControlsFromActiveSlot();
  renderPatch();
});

textInput.addEventListener("input", (e) => {
  getActiveSlot().text = e.target.value;
  renderPatch();
});

sizeRange.addEventListener("input", (e) => {
  const idx = Number(e.target.value);
  const slot = getActiveSlot();
  slot.widthCm = WIDTH_CM[idx] ?? 30;
  const minTW = slot.widthCm / 2;
  const maxTW = getMaxTextWidthCm(slot.widthCm);
  slot.textWidthCm = Math.min(maxTW, Math.max(minTW, slot.textWidthCm));
  updateSizeReadout();
  syncFontSizeSlider();
  updateFontSizeReadout();
  renderPatch();
});

fontSizeRange.addEventListener("input", (e) => {
  getActiveSlot().textWidthCm = Number(e.target.value);
  updateFontSizeReadout();
  renderPatch();
});

quantitySelect.addEventListener("change", (e) => {
  state.quantity = Number(e.target.value) || 1;
});

// Cart click handler registered after cart init below

fontPickerTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = fontPickerList.hidden;
  setFontPickerOpen(open);
});

document.addEventListener("click", () => {
  setFontPickerOpen(false);
});

fontPicker.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setFontPickerOpen(false);
  }
});

dualSlotButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!isDualMode()) return;
    state.dualActiveSlot = Number(btn.dataset.slot);
    setDualSlotButtons();
    syncControlsFromActiveSlot();
  });
});

function populateQuantity() {
  quantitySelect.replaceChildren();
  for (let q = 1; q <= 99; q += 1) {
    const o = document.createElement("option");
    o.value = String(q);
    o.textContent = String(q);
    quantitySelect.appendChild(o);
  }
  quantitySelect.value = String(state.quantity);
}

populateQuantity();
buildFontPickerList();

shapeSelect.value = state.shape;
setDualUiVisible(false);
syncControlsFromActiveSlot();
renderPatch();

/* ── Theme toggle ────────────────────────────────── */

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("patchfy-theme", theme);
}

const savedTheme = localStorage.getItem("patchfy-theme")
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ── Cart ────────────────────────────────────────── */

const SHAPE_LABELS = {
  rounded: "Retangular",
  circle: "Circular",
  "top-arc": "Arco sup.",
  "bottom-arc": "Arco inf.",
  rocker: "Rocker",
  dual: "Sup. + inf."
};

const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartCloseBtn = document.getElementById("cart-close");
const cartToggleBtn = document.getElementById("cart-toggle");
const cartBadge = document.getElementById("cart-badge");
const cartBody = document.getElementById("cart-body");
const cartItemsList = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartTotalItems = document.getElementById("cart-total-items");
const btnCheckout = document.getElementById("btn-checkout");
const btnClearCart = document.getElementById("btn-clear-cart");

let cart = [];

function loadCart() {
  try {
    const raw = localStorage.getItem("patchfy-cart");
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("patchfy-cart", JSON.stringify(cart));
}

function cartTotalQty() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const total = cartTotalQty();
  if (total > 0) {
    cartBadge.textContent = String(total);
    cartBadge.hidden = false;
  } else {
    cartBadge.hidden = true;
  }
}

function openCart() {
  cartOverlay.hidden = false;
  cartDrawer.hidden = false;
  requestAnimationFrame(() => {
    cartOverlay.classList.add("is-open");
    cartDrawer.classList.add("is-open");
  });
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.classList.remove("is-open");
  cartDrawer.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => {
    cartOverlay.hidden = true;
    cartDrawer.hidden = true;
  }, 300);
}

function findColorLabel(palette, value) {
  const match = palette.find((c) => c.value === value);
  return match ? match.label : value;
}

function renderCartItems() {
  cartItemsList.replaceChildren();
  const hasItems = cart.length > 0;
  cartEmpty.hidden = hasItems;
  cartFooter.hidden = !hasItems;

  if (!hasItems) return;

  let totalQty = 0;

  cart.forEach((item, index) => {
    totalQty += item.quantity;
    const li = document.createElement("li");
    li.className = "cart-item";

    const mainPatch = item.patches[0];

    // Mini preview
    const preview = document.createElement("div");
    preview.className = "cart-item__preview";
    preview.style.background = mainPatch.backgroundColor;
    preview.style.color = mainPatch.textColor;
    preview.style.border = `3px solid ${mainPatch.borderColor}`;
    preview.style.fontFamily = fontFamilyCss(mainPatch.font);
    preview.textContent = mainPatch.text.length > 8
      ? mainPatch.text.slice(0, 8) + "\u2026"
      : mainPatch.text;

    // Info
    const info = document.createElement("div");
    info.className = "cart-item__info";

    const textEl = document.createElement("span");
    textEl.className = "cart-item__text";
    textEl.textContent = item.mode === "dual"
      ? `${item.patches[0].text} / ${item.patches[1].text}`
      : mainPatch.text;

    const meta = document.createElement("span");
    meta.className = "cart-item__meta";
    meta.textContent = `${SHAPE_LABELS[item.shape] || item.shape} \u00B7 ${mainPatch.widthCm} cm \u00B7 ${mainPatch.font}`;

    const qty = document.createElement("span");
    qty.className = "cart-item__qty";
    qty.textContent = `${item.quantity}\u00D7`;

    info.appendChild(textEl);
    info.appendChild(meta);
    info.appendChild(qty);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-item__remove";
    removeBtn.setAttribute("aria-label", "Remover item");
    removeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart();
      updateCartBadge();
      renderCartItems();
    });

    li.appendChild(preview);
    li.appendChild(info);
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });

  cartTotalItems.textContent = `${totalQty} ${totalQty === 1 ? "patch" : "patches"}`;
}

addToCartBtn.addEventListener("click", () => {
  const payload = buildCartPayload();
  cart.push(payload);
  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast(`${state.quantity}\u00D7 patch adicionado ao carrinho.`);
});

cartToggleBtn.addEventListener("click", () => {
  renderCartItems();
  openCart();
});

cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cartDrawer.hidden) {
    closeCart();
  }
});

btnClearCart.addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartItems();
});

btnCheckout.addEventListener("click", () => {
  showToast("Funcionalidade de checkout em breve!");
});

// Init cart from localStorage
loadCart();
updateCartBadge();
