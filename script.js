const previewTop = document.getElementById("patch-preview-top");
const previewBottom = document.getElementById("patch-preview-bottom");
const previewStack = document.getElementById("preview-stack");
const dualPatchTarget = document.getElementById("dual-patch-target");
const dualSlotButtons = dualPatchTarget.querySelectorAll(".segmented__btn");

const shapeSelect = document.getElementById("shape-select");
const textInput = document.getElementById("text-input");
const textColorSelect = document.getElementById("text-color-select");
const bgColorSelect = document.getElementById("bg-color-select");
const borderColorSelect = document.getElementById("border-color-select");
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
  { label: "White", value: "#FFFFFF" },
  { label: "Cream", value: "#F5F0E6" },
  { label: "Black", value: "#121212" },
  { label: "Navy", value: "#1E3A5F" },
  { label: "Red", value: "#C41E3A" },
  { label: "Royal blue", value: "#2563EB" },
  { label: "Gold", value: "#C5A572" },
  { label: "Silver gray", value: "#9CA3AF" },
  { label: "Forest green", value: "#14532D" },
  { label: "Burgundy", value: "#7F1D1D" }
];

const PALETTE_BACKGROUND = [
  { label: "Black", value: "#121212" },
  { label: "White", value: "#FFFFFF" },
  { label: "Navy", value: "#1E3A5F" },
  { label: "Royal blue", value: "#1D4ED8" },
  { label: "Red", value: "#B91C1C" },
  { label: "Forest green", value: "#14532D" },
  { label: "Gray", value: "#6B7280" },
  { label: "Khaki", value: "#C3B091" },
  { label: "Cream", value: "#F5F0E6" },
  { label: "Maroon", value: "#7F1D1D" }
];

const PALETTE_BORDER = [
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#121212" },
  { label: "Navy", value: "#1E3A5F" },
  { label: "Gold", value: "#C5A572" },
  { label: "Silver", value: "#D1D5DB" },
  { label: "Red", value: "#C41E3A" },
  { label: "Royal blue", value: "#2563EB" },
  { label: "Forest green", value: "#166534" }
];

const ARC_CURVE_INSET = 0.28;
const ARC_BUMP = 0.14;

function defaultSlot() {
  return {
    text: "Your Name",
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
  slots: [defaultSlot(), { ...defaultSlot(), text: "Your Text" }]
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
  fillSelect(textColorSelect, PALETTE_EMBROIDERY, slot.textColor);
  fillSelect(bgColorSelect, PALETTE_BACKGROUND, slot.bgColor);
  fillSelect(borderColorSelect, PALETTE_BORDER, slot.borderColor);
  slot.textColor = textColorSelect.value;
  slot.bgColor = bgColorSelect.value;
  slot.borderColor = borderColorSelect.value;
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

textColorSelect.addEventListener("change", (e) => {
  getActiveSlot().textColor = e.target.value;
  renderPatch();
});

bgColorSelect.addEventListener("change", (e) => {
  getActiveSlot().bgColor = e.target.value;
  renderPatch();
});

borderColorSelect.addEventListener("change", (e) => {
  getActiveSlot().borderColor = e.target.value;
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

addToCartBtn.addEventListener("click", () => {
  const payload = buildCartPayload();
  console.info("add-to-cart", payload);
  showToast(
    `Added ${state.quantity}× custom patch to cart (see console for details).`
  );
});

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

fillSelect(textColorSelect, PALETTE_EMBROIDERY, getActiveSlot().textColor);
fillSelect(bgColorSelect, PALETTE_BACKGROUND, getActiveSlot().bgColor);
fillSelect(borderColorSelect, PALETTE_BORDER, getActiveSlot().borderColor);

getActiveSlot().textColor = textColorSelect.value;
getActiveSlot().bgColor = bgColorSelect.value;
getActiveSlot().borderColor = borderColorSelect.value;

shapeSelect.value = state.shape;
setDualUiVisible(false);
syncControlsFromActiveSlot();
renderPatch();
