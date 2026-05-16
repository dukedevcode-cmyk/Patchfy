// ── Cloudinary config — substituir com os teus dados após criar conta em cloudinary.com
const CLD_CLOUD  = 'dhwknfiza';
const CLD_PRESET = 'Patchfy';
const REFS_PIN   = '1469';
const REFS_AUTH_KEY = 'patchfy-refs-auth';
const REFS_KEY   = 'patchfy-refs';

// ── Timeline data
const TL_DAYS = [
  {
    date: '2026-05-14',
    label: 'Dia 1',
    tasks: [
      { text: 'Criação do Sitemap', done: true },
      { text: 'Assinatura do domínio', done: true },
      { text: 'Hospedagem Shopify', done: true },
    ]
  },
  {
    date: '2026-05-15',
    label: 'Dia 2',
    tasks: [
      { text: 'Desenvolvimento da aba Referências Visuais', done: true },
      { text: 'Criação do Briefing', done: true },
      { text: 'Início da implementação do Customizador Patchfy dentro da Shopify', done: true },
    ]
  },
  {
    date: '2026-05-16',
    label: 'Dia 3',
    tasks: [
      { text: 'Criação da barra de progresso com tasklist', done: true },
      { text: 'Formatação do layout da home no Shopify', done: false },
    ]
  },
  {
    date: '2026-05-17',
    label: 'Dia 4',
    tasks: []
  },
  {
    date: '2026-05-18',
    label: 'Dia 5',
    tasks: []
  },
];

function getTLTodayIdx() {
  const today = new Date().toISOString().slice(0, 10);
  const idx = TL_DAYS.findIndex(d => d.date === today);
  return idx >= 0 ? idx : TL_DAYS.length - 1;
}

let tlCurrent = getTLTodayIdx();

function buildTLCard(dayIdx, slot) {
  const today = new Date().toISOString().slice(0, 10);
  if (dayIdx < 0 || dayIdx >= TL_DAYS.length) {
    return '<div class="tl-ccard tl-ccard--' + slot + ' tl-ccard--ghost"></div>';
  }
  const day = TL_DAYS[dayIdx];
  const isPast   = day.date < today;
  const isToday  = day.date === today;
  const isFuture = day.date > today;

  let statusClass = 'tl-ccard--future';
  let badgeHtml   = '';
  const allDone = day.tasks && day.tasks.length > 0 && day.tasks.every(t => t.done);

  if (allDone || (isPast && !isToday)) {
    statusClass = 'tl-ccard--done';
    badgeHtml   = '<span class="tl-cbadge tl-cbadge--done">Concluído</span>';
  } else if (isToday || (!isFuture && !allDone)) {
    statusClass = 'tl-ccard--active';
    badgeHtml   = '<span class="tl-cbadge tl-cbadge--active">Em progresso</span>';
  }

  const dateObj = new Date(day.date + 'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' });

  let tasksHtml = '';
  if (day.tasks && day.tasks.length > 0) {
    tasksHtml = '<ul class="tl-ctasks">';
    day.tasks.forEach(function(t) {
      const cls  = t.done ? 'tl-ctask--done' : 'tl-ctask--todo';
      const icon = t.done
        ? '<span class="tl-task__icon">✓</span>'
        : '<span class="tl-check-visual"></span>';
      tasksHtml += '<li class="tl-ctask ' + cls + '">' + icon + '<span class="tl-task__text">' + t.text + '</span></li>';
    });
    tasksHtml += '</ul>';
  } else {
    const emptyMsg = isFuture ? 'A planear' : 'Nenhuma atualização registrada';
    tasksHtml = '<p class="tl-cempty">' + emptyMsg + '</p>';
  }

  return (
    '<div class="tl-ccard tl-ccard--' + slot + ' ' + statusClass + '">' +
      '<div class="tl-ccard__head">' +
        '<span class="tl-ccard__day">' + day.label + '</span>' +
        badgeHtml +
      '</div>' +
      '<div class="tl-ccard__date">' + dateStr + '</div>' +
      tasksHtml +
    '</div>'
  );
}

function renderTLMini() {
  const fill   = document.getElementById('tl-mini-fill');
  const dotsEl = document.getElementById('tl-mini-dots');
  if (!fill || !dotsEl) return;

  const pct = (tlCurrent / (TL_DAYS.length - 1)) * 100;
  fill.style.width = pct + '%';

  dotsEl.innerHTML = '';
  TL_DAYS.forEach(function(d, i) {
    const dot = document.createElement('button');
    dot.className = 'tl-mini-dot' +
      (i <= tlCurrent ? ' tl-mini-dot--done' : '') +
      (i === tlCurrent ? ' tl-mini-dot--active' : '');
    dot.title = d.label + ' — ' + d.date;
    dot.addEventListener('click', function() { tlCurrent = i; renderTLCarousel(); });
    dotsEl.appendChild(dot);
  });
}

function renderTLCarousel() {
  const stage = document.getElementById('tl-stage');
  if (!stage) return;

  stage.style.opacity = '0';
  setTimeout(function() {
    stage.innerHTML =
      buildTLCard(tlCurrent - 1, 'prev') +
      buildTLCard(tlCurrent,     'center') +
      buildTLCard(tlCurrent + 1, 'next');
    stage.style.opacity = '1';

    const prev = document.getElementById('tl-prev');
    const next = document.getElementById('tl-next');
    if (prev) prev.disabled = tlCurrent === 0;
    if (next) next.disabled = tlCurrent === TL_DAYS.length - 1;

    renderTLMini();
    setTimeout(lockTLHeight, 50);
  }, 150);
}

let tlStageMinH = 0;

function lockTLHeight() {
  const stage = document.getElementById('tl-stage');
  if (!stage) return;
  const h = stage.offsetHeight;
  if (h > 0 && h > tlStageMinH) {
    tlStageMinH = h;
    stage.style.minHeight = tlStageMinH + 'px';
  }
}

function renderTLCalPopup() {
  const popup = document.getElementById('tl-cal-popup');
  if (!popup) return;
  popup.innerHTML = '';
  TL_DAYS.forEach(function(d, i) {
    const item = document.createElement('button');
    item.className = 'tl-cal-item' + (i === tlCurrent ? ' tl-cal-item--active' : '');
    item.textContent = d.label + ' · ' + d.date;
    item.addEventListener('click', function() {
      tlCurrent = i;
      renderTLCarousel();
      renderTLCalPopup();
      popup.classList.remove('open');
    });
    popup.appendChild(item);
  });
}

function getRefs() {
  try { return JSON.parse(localStorage.getItem(REFS_KEY) || '[]'); } catch { return []; }
}
function saveRefs(refs) { localStorage.setItem(REFS_KEY, JSON.stringify(refs)); }

function renderGallery() {
  const refs    = getRefs();
  const gallery = document.getElementById('refs-gallery');
  const empty   = document.getElementById('refs-empty');
  const header  = document.getElementById('refs-gallery-header');
  const count   = document.getElementById('refs-gallery-count');
  if (!gallery) return;

  gallery.querySelectorAll('.refs-card').forEach(c => c.remove());

  if (refs.length === 0) {
    empty.style.display = '';
    header.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  header.style.display = 'flex';
  count.textContent = refs.length + (refs.length === 1 ? ' imagem' : ' imagens');

  refs.forEach((ref, i) => {
    const card = document.createElement('div');
    card.className = 'refs-card';
    card.innerHTML =
      '<div class="refs-card__img-wrap"><img src="' + ref.thumb + '" alt="' + ref.name + '" loading="lazy"></div>' +
      '<div class="refs-card__footer">' +
        '<span class="refs-card__name">' + ref.name + '</span>' +
        '<div class="refs-card__actions">' +
          '<button class="refs-card__copy" data-url="' + ref.url + '" title="Copiar URL">🔗</button>' +
          '<button class="refs-card__del" data-index="' + i + '" title="Remover">✕</button>' +
        '</div>' +
      '</div>';
    gallery.appendChild(card);
  });

  gallery.querySelectorAll('.refs-card__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.url).then(() => {
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = '🔗'; }, 1500);
      });
    });
  });

  gallery.querySelectorAll('.refs-card__del').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = getRefs();
      list.splice(parseInt(btn.dataset.index), 1);
      saveRefs(list);
      renderGallery();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // ── PIN gate
  const pinGate    = document.getElementById('refs-pin-gate');
  const pinInput   = document.getElementById('refs-pin-input');
  const pinBtn     = document.getElementById('refs-pin-btn');
  const pinError   = document.getElementById('refs-pin-error');
  const unlockedEl = document.getElementById('refs-unlocked');

  function unlockRefs() {
    sessionStorage.setItem(REFS_AUTH_KEY, '1');
    pinGate.style.display    = 'none';
    unlockedEl.style.display = '';
    renderGallery();
  }

  function tryPin() {
    if (pinInput.value === REFS_PIN) {
      unlockRefs();
    } else {
      pinError.style.display = 'block';
      pinInput.classList.add('shake');
      pinInput.value = '';
      setTimeout(() => pinInput.classList.remove('shake'), 400);
    }
  }

  if (pinGate) {
    if (sessionStorage.getItem(REFS_AUTH_KEY) === '1') {
      unlockRefs();
    }
    pinBtn.addEventListener('click', tryPin);
    pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryPin(); });
    pinInput.addEventListener('input', () => { pinError.style.display = 'none'; });
  }

  // ── Upload button
  const uploadBtn = document.getElementById('refs-upload-btn');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      if (CLD_CLOUD === 'YOUR_CLOUD_NAME') {
        alert('Configura o cloud_name e o upload_preset no ficheiro sitemap-patchfy.js antes de fazer upload.');
        return;
      }
      if (typeof cloudinary === 'undefined') {
        alert('Widget Cloudinary não carregado. Verifica a ligação à internet.');
        return;
      }
      cloudinary.openUploadWidget({
        cloudName:    CLD_CLOUD,
        uploadPreset: CLD_PRESET,
        sources:      ['local', 'camera'],
        multiple:     true,
        maxFiles:     20,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        styles: {
          palette: {
            window:          '#111111',
            windowBorder:    '#1e1e1e',
            tabIcon:         '#C4A484',
            menuIcons:       '#999',
            textDark:        '#ffffff',
            textLight:       '#999999',
            link:            '#C4A484',
            action:          '#C4A484',
            inactiveTabIcon: '#555',
            error:           '#F44235',
            inProgress:      '#C4A484',
            complete:        '#20B832',
            sourceBg:        '#1a1a1a'
          }
        }
      }, (error, result) => {
        if (!error && result.event === 'success') {
          const info = result.info;
          const list = getRefs();
          list.unshift({
            url:        info.secure_url,
            thumb:      info.secure_url.replace('/upload/', '/upload/w_400,c_fill/'),
            name:       info.original_filename + '.' + info.format,
            uploadedAt: new Date().toISOString()
          });
          saveRefs(list);
          renderGallery();
        }
      });
    });
  }

  // ── Limpar galeria
  const clearBtn = document.getElementById('refs-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Remover todas as imagens da galeria local?')) {
        saveRefs([]);
        renderGallery();
      }
    });
  }

  // ── Navegação entre views
  const navItems       = document.querySelectorAll('.nav-item[data-view]');
  const views          = document.querySelectorAll('.view');
  const mobileLabel    = document.getElementById('mobile-view-label');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.view;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        v.classList.remove('active');
        if (v.id === 'view-' + target) {
          v.classList.add('active');
          const rp = v.closest('.right-panel');
          if (rp) rp.scrollTo({ top: 0, behavior: 'instant' });
          else window.scrollTo({ top: 0, behavior: 'instant' });
        }
      });

      if (target === 'progress') setTimeout(lockTLHeight, 50);

      // update mobile label
      const label = item.querySelector('.nav-label');
      if (label && mobileLabel) mobileLabel.textContent = label.textContent;

      // close panel on mobile
      document.body.classList.remove('panel-open');
    });
  });

  // ── Mobile nav toggle
  const navToggle  = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');

  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('panel-open');
  });
  navOverlay.addEventListener('click', () => {
    document.body.classList.remove('panel-open');
  });

  // fechar painel ao clicar no link da loja (mobile)
  const storeLink = document.querySelector('.nav-item--store');
  if (storeLink) {
    storeLink.addEventListener('click', () => {
      document.body.classList.remove('panel-open');
    });
  }

  // ── Timeline carrossel
  const tlPrev   = document.getElementById('tl-prev');
  const tlNext   = document.getElementById('tl-next');
  const tlCalBtn = document.getElementById('tl-cal-btn');

  if (tlPrev) tlPrev.addEventListener('click', function() {
    if (tlCurrent > 0) { tlCurrent--; renderTLCarousel(); }
  });
  if (tlNext) tlNext.addEventListener('click', function() {
    if (tlCurrent < TL_DAYS.length - 1) { tlCurrent++; renderTLCarousel(); }
  });
  if (tlCalBtn) {
    renderTLCalPopup();
    tlCalBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const popup = document.getElementById('tl-cal-popup');
      if (popup) { popup.classList.toggle('open'); renderTLCalPopup(); }
    });
  }

  document.addEventListener('click', function(e) {
    const popup = document.getElementById('tl-cal-popup');
    if (popup && popup.classList.contains('open') && !popup.contains(e.target) && e.target !== tlCalBtn) {
      popup.classList.remove('open');
    }
  });

  renderTLCarousel();

  // ── Toggle colapsar/expandir (árvore)
  document.querySelectorAll('.toggleable').forEach(box => {
    box.addEventListener('click', () => {
      const branch = document.getElementById(box.dataset.col);
      if (branch) branch.classList.toggle('collapsed');
    });
  });

  // ── Toggle Lista / Wireframe na Anatomia da Home
  const modeTabs = document.querySelectorAll('.vmt');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.mode;
      const lista     = document.getElementById('home-lista');
      const wireframe = document.getElementById('wf-home');
      if (mode === 'wireframe') {
        lista.style.display     = 'none';
        wireframe.style.display = 'block';
      } else {
        lista.style.display     = '';
        wireframe.style.display = 'none';
      }
    });
  });

});

