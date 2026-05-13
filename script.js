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

/**
 * Web preview: `local("…")` picks Wilcom / Windows fonts when installed.
 * Otherwise the `web` face (Google Fonts, SIL OFL) approximates the embroidery look.
 * We cannot bundle Wilcom's proprietary font files in this static site.
 */
const FONT_PREVIEW_MAP = {
  Algerian: {
    // Decorative all-caps serif with inline cuts — Pirata One has the same dramatic serif flair
    locals: ["Algerian", "Algerian MT", "ALGERIAN"],
    web: "Pirata One"
  },
  Amarilo: {
    // Upright display script — Parisienne is a much closer match than Yesteryear
    locals: ["Amarilo", "Amarillo", "AmarilloUS"],
    web: "Parisienne"
  },
  "Arial Rounded": {
    // Rounded sans-serif — Nunito is visually much closer than Varela Round
    locals: [
      "Arial Rounded MT Bold",
      "Arial Rounded MT",
      "Arial Rounded",
      "ArialRoundedMTBold"
    ],
    web: "Nunito"
  },
  Bauhaus: {
    // Geometric sans inspired by Bauhaus movement — Josefin Sans is far closer than Baumans
    locals: ["Bauhaus 93", "Bauhaus Std", "Bauhaus", "BAUHS93"],
    web: "Josefin Sans"
  },
  BravoSC: {
    // Tall condensed all-caps — Bebas Neue is a near-perfect match
    locals: ["BravoSC", "Bravo SC", "Bravo"],
    web: "Bebas Neue"
  },
  Cooper: {
    // Heavy rounded serif — Ultra is the closest Google Fonts match to Cooper Black
    locals: ["Cooper Black", "Cooper", "Cooper Std Black"],
    web: "Ultra"
  },
  "FTY Ironhorse": {
    // Bold condensed western/collegiate — Teko Bold is much closer than Holtwood One SC
    locals: ["FTY Ironhorse", "FTY IRONHORSE NCV", "FTY IRONHORSE", "FTYIronhorse"],
    web: "Teko"
  },
  "Franklin Gothic": {
    // Condensed bold grotesque — Oswald is a much closer match than Libre Franklin
    locals: [
      "Franklin Gothic Medium",
      "Franklin Gothic Heavy",
      "Franklin Gothic Demi",
      "Franklin Gothic Book",
      "Franklin Gothic"
    ],
    web: "Oswald"
  },
  Georgia: {
    locals: ["Georgia"],
    web: null,
    tail: 'Georgia, "Times New Roman", serif'
  },
  Hessian: {
    // Dense blackletter / Fraktur — UnifrakturMaguntia is the best Google Fonts match
    locals: ["Hessian", "HESSIAN"],
    web: "UnifrakturMaguntia"
  },
  Hobo: {
    // Rounded, bubbly sans — Righteous has the same rounded geometric energy
    locals: ["Hobo", "Hobo Std", "HoboStd"],
    web: "Righteous"
  },
  Jersey: {
    // Athletic jersey lettering — Jersey 10 is an exact match
    locals: ["Jersey M54", "Jersey", "Jersey54"],
    web: "Jersey 10"
  },
  Killer: {
    // Chunky playful display — Boogaloo captures the same hand-painted weight
    locals: ["Killer", "KILLER"],
    web: "Boogaloo"
  },
  "Morris Roman": {
    // Geometric medieval serif — MedievalSharp is the closest available
    locals: ["Morris Roman", "MorrisRoman", "MORRIS"],
    web: "MedievalSharp"
  },
  Motorhead: {
    // Heavy metal / acid gothic — Metal Mania is the best match on Google Fonts
    locals: ["Motorhead", "MOTORHEAD"],
    web: "Metal Mania"
  },
  "Old London": {
    // Blackletter display — UnifrakturMaguntia matches its ornate style
    locals: ["Old London", "OldLondon", "OLD LONDON"],
    web: "UnifrakturMaguntia"
  },
  "Old English": {
    // Traditional Textura blackletter — UnifrakturCook is sharper and more authentic
    locals: ["Old English Text MT", "Old English", "OldEnglishTextMT"],
    web: "UnifrakturCook"
  },
  Pointedly: {
    // Art Deco geometric — Poiret One is the closest match on Google Fonts
    locals: ["Pointedly", "POINTEDLY"],
    web: "Poiret One"
  },
  "PR Viking": {
    // Decorative Roman caps with ornamental serifs — Cinzel Decorative matches well
    locals: ["PR Viking", "PRViking", "Viking Normal", "PR VIKING"],
    web: "Cinzel Decorative"
  },
  Railroad: {
    // Vintage typewriter / stamp feel — Special Elite nails the worn ink look
    locals: ["Railroad", "RAILROAD"],
    web: "Special Elite"
  },
  Railroader: {
    // Brush-painted grunge — Rock Salt has the same rough hand-lettered texture
    locals: ["Railroader", "RAILROADER"],
    web: "Rock Salt"
  },
  Rockwell: {
    // Geometric slab serif — Arvo is much closer to Rockwell than Roboto Slab
    locals: ["Rockwell", "Rockwell Nova", "RockwellStd"],
    web: "Arvo"
  },
  Rye: {
    // Western display serif — Rye is available directly on Google Fonts, exact match
    locals: ["Rye"],
    web: "Rye"
  },
  Sectar: {
    // Futuristic geometric — Orbitron is the best sci-fi match on Google Fonts
    locals: ["Sectar", "SECTAR"],
    web: "Orbitron"
  },
  Script: {
    // Formal cursive — Dancing Script better captures the Script MT Bold weight and flow
    locals: ["Script MT Bold", "Script", "Script MT"],
    web: "Dancing Script"
  },
  "Stars & Love": {
    // Casual rounded script — Pacifico is the closest bubbly cursive on Google Fonts
    locals: ["Stars & Love", "Stars and Love", "StarsLove"],
    web: "Pacifico"
  },
  Stencil: {
    // Military stencil — Stardos Stencil has the same cut-out letterform style
    locals: ["Stencil", "Stencil Std", "StencilStd"],
    web: "Stardos Stencil"
  },
  Trajan: {
    // Classical Roman inscriptional caps — Cinzel is the closest Google Fonts match
    locals: ["Trajan Pro", "Trajan Pro 3", "Trajan", "TrajanPro"],
    web: "Cinzel"
  },
  Viking: {
    // Bold runic / Germanic — Germania One matches the sharp angular letterforms
    locals: ["Viking", "VIKING"],
    web: "Germania One"
  },
  Western: {
    // Wild West serif — Rye is far more western than Alfa Slab One
    locals: ["Western", "WesternStd", "WESTERN"],
    web: "Rye"
  }
};

function fontFamilyCss(name) {
  const spec = FONT_PREVIEW_MAP[name];
  if (!spec) {
    const escaped = name.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${escaped}", sans-serif`;
  }

  const localParts = (spec.locals || []).map((l) => {
    const safe = l.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `local("${safe}")`;
  });

  if (spec.tail) {
    if (localParts.length) {
      return `${localParts.join(", ")}, ${spec.tail}`;
    }
    return spec.tail;
  }

  const core = [
    ...localParts,
    ...(spec.web ? [`"${spec.web}"`] : [])
  ].filter(Boolean);

  return `${core.join(", ")}, sans-serif`;
}

for (const f of FONT_OPTIONS) {
  if (!FONT_PREVIEW_MAP[f]) {
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

const ARC_CURVE_INSET = 0.28;
const ARC_BUMP = 0.14;

function defaultSlot() {
  return {
    text: "Seu Nome",
    font: "Georgia",
    textColor: "#FFFFFF",
    bgColor: "#121212",
    borderColor: "#FFFFFF",
    widthCm: 30
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

function getPatchHeightPx(geomShape, slot) {
  const w = getPatchWidthPx(slot);
  if (geomShape === "circle") {
    return w;
  }
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

function bottomArchTextPathD(w, h) {
  const yTop = h * ARC_CURVE_INSET;
  const yChord = h * 0.5;
  const bump = yTop * 0.92;
  const yCtrl = yChord - bump;
  return `M ${w * 0.07} ${yChord} Q ${w / 2} ${yCtrl} ${w * 0.93} ${yChord}`;
}

function topArchTextPathD(w, h) {
  const yTop = h * ARC_CURVE_INSET;
  const yBot = h * (1 - ARC_CURVE_INSET);
  const ctrlTopY = Math.min(yBot - h * 0.06, yTop + h * ARC_BUMP);
  const yChord = h * 0.5;
  const bump = Math.max(h * 0.1, (ctrlTopY - yTop + (h - yBot)) * 0.42);
  const yCtrl = yChord + bump;
  return `M ${w * 0.07} ${yChord} Q ${w / 2} ${yCtrl} ${w * 0.93} ${yChord}`;
}

const shapes = {
  rounded: (el) => {
    el.style.borderRadius = "18px";
    el.style.clipPath = "";
  },

  circle: (el, slot) => {
    const w = getPatchWidthPx(slot);
    el.style.borderRadius = "999px";
    el.style.width = `${w}px`;
    el.style.height = `${w}px`;
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
}

function renderArcSvg(el, arcKind, slot) {
  const w = getPatchWidthPx(slot);
  const h = getPatchHeightPx(arcKind, slot);
  const outlineD =
    arcKind === "top-arc" ? topArchOutlineD(w, h) : bottomArchOutlineD(w, h);
  const textCurveD =
    arcKind === "top-arc" ? topArchTextPathD(w, h) : bottomArchTextPathD(w, h);
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
  textEl.setAttribute(
    "font-size",
    String(Math.round(Math.max(14, Math.min(42, w * 0.12))))
  );
  textEl.setAttribute("font-weight", "700");
  textEl.setAttribute("letter-spacing", "2");
  textEl.setAttribute("text-transform", "uppercase");
  textEl.setAttribute("dominant-baseline", "middle");

  const tp = document.createElementNS(NS, "textPath");
  tp.setAttribute("href", `#${textPathId}`);
  tp.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${textPathId}`);
  tp.setAttribute("startOffset", "50%");
  tp.setAttribute("text-anchor", "middle");
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
  el.innerText = slot.text;

  const w = getPatchWidthPx(slot);
  const h = getPatchHeightPx(geomShape, slot);

  el.style.fontFamily = fontFamilyCss(slot.font);
  el.style.color = slot.textColor;
  el.style.backgroundColor = slot.bgColor;
  el.style.borderColor = slot.borderColor;
  el.style.border = "";

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
  getActiveSlot().widthCm = WIDTH_CM[idx] ?? 30;
  updateSizeReadout();
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
