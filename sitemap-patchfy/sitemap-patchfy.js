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
      { text: 'Otimização da aba Progresso para mobile', done: true },
      { text: 'Atualização do briefing — Referências Visuais & Progresso', done: true },
    ]
  },
  {
    date: '2026-05-17',
    label: 'Dia 4',
    tasks: [
      { text: 'Formatação do layout da home no Shopify', done: true },
    ]
  },
  {
    date: '2026-05-18',
    label: 'Dia 5',
    tasks: [
      { text: 'Finalizar a home', done: false },
      { text: 'Iniciar formatação do Customizer', done: false },
      { text: 'Otimizar customizer para iOS (Safari)', done: false },
    ]
  },
  {
    date: '2026-05-19',
    label: 'Dia 6',
    tasks: [
      { text: 'Iniciar edição e adição de imagens ao site', done: false },
      { text: 'Criação de página de produto', done: false },
      { text: 'Finalizar o Customizer', done: false },
    ]
  },
  {
    date: '2026-05-20',
    label: 'Dia 7',
    tasks: [
      { text: 'Definir produtos e coleções', done: false },
      { text: 'Adicionar fotos de produtos e coleções', done: false },
    ]
  },
  {
    date: '2026-05-21',
    label: 'Dia 8',
    tasks: [
      { text: 'Linkar URL da Patchfy com Shopify', done: false },
      { text: 'Definir Mercados', done: false },
      { text: 'Configurar API de pagamentos', done: false },
    ]
  },
  {
    date: '2026-05-22',
    label: 'Dia 9',
    tasks: [
      { text: 'Revisão final e entrega', done: false },
      { text: 'Fretes & Taxas', done: false },
      { text: 'Embalagens', done: false },
      { text: 'Definir cupons', done: false },
    ]
  },
  {
    date: '2026-05-23',
    label: 'Dia 10',
    tasks: [
      { text: 'Adicionais: Cupons de desconto e automações', done: false },
      { text: 'Adicionais: Cadastro de clientes — popups, leads e funil de conversão', done: false },
      { text: 'Adicionais: Institucional — Políticas', done: false },
      { text: 'Adicionais: Email marketing e automações', done: false },
    ]
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

// ── Project checklist
const PROJECT_CHECKLIST = [
  { text: 'Home',                    date: '18/05', done: false },
  { text: 'Customizer',              date: '19/05', done: false },
  { text: 'Página de produto',       date: '20/05', done: false },
  { text: 'Coleções',                date: '20/05', done: false },
  { text: 'Gateway de pagamentos',   date: '21/05', done: false },
  { text: 'Mercados',                date: '21/05', done: false },
  { text: 'Frete & Taxas',           date: '22/05', done: false },
  { text: 'Cupons',                  date: '22/05', done: false },
];

function renderProjectChecklist() {
  const el = document.getElementById('proj-checklist');
  if (!el) return;

  const total   = PROJECT_CHECKLIST.length;
  const doneQty = PROJECT_CHECKLIST.filter(function(i) { return i.done; }).length;
  const allDone = doneQty === total;
  const pct     = Math.round((doneQty / total) * 100);

  var html = '<div class="proj-cl__progress">' +
    '<div class="proj-cl__prog-track"><div class="proj-cl__prog-fill" style="width:' + pct + '%"></div></div>' +
    '<span class="proj-cl__prog-label">' + doneQty + ' / ' + total + ' concluídos</span>' +
  '</div>';

  html += '<ul class="proj-cl__list">';
  PROJECT_CHECKLIST.forEach(function(item) {
    var checkHtml = item.done
      ? '<span class="proj-cl__check proj-cl__check--done"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
      : '<span class="proj-cl__check proj-cl__check--empty"></span>';
    var dateHtml = item.date ? '<span class="proj-cl__date">' + item.date + '</span>' : '';
    html += '<li class="proj-cl__item' + (item.done ? ' proj-cl__item--done' : '') + '">' +
      checkHtml +
      '<span class="proj-cl__text">' + item.text + '</span>' +
      dateHtml +
    '</li>';
  });
  html += '</ul>';

  if (allDone) {
    html += '<div class="proj-cl__all-done">Projeto pronto para entrega</div>';
  }

  el.innerHTML = html;
}

// ── Wireframe info panel data
const WF_INFO = {
  hero: {
    title: '① Fotografia principal + entrada',
    body: '<p>Primeira secção da página — ocupa 90% da altura do ecrã. O visitante percebe imediatamente o que é a Patchfy e é convidado a agir.</p><ul><li><strong>Fotografia:</strong> cobre toda a largura, com camada escura por cima para o texto ser legível</li><li><strong>Título:</strong> "O teu patch. A tua história." — fonte Playfair Display</li><li><strong>Subtítulo:</strong> "Bordado à mão, feito para durar."</li><li><strong>Botão dourado:</strong> leva ao configurador</li><li><strong>Botão contorno:</strong> leva às coleções</li></ul>'
  },
  trust: {
    title: '② Barra de credibilidade',
    body: '<p>Faixa escura com 4 pontos que reforçam a confiança antes de o visitante continuar a explorar a loja.</p><ul><li>+5.000 patches entregues</li><li>4.9 de avaliação média</li><li>Envio para Portugal, Espanha, Alemanha e EUA</li><li>Garantia de qualidade em todos os artigos</li></ul><p>Cada ponto tem um ícone dourado à esquerda.</p>'
  },
  custom: {
    title: '③ Como funciona o customizador',
    body: '<p>Secção dividida ao meio: à esquerda uma pré-visualização do configurador, à direita 3 passos que explicam o processo.</p><ul><li><strong>Passo 1:</strong> Escolhe o formato do patch</li><li><strong>Passo 2:</strong> Escreve o texto</li><li><strong>Passo 3:</strong> Escolhe as cores</li></ul><p>O botão "Começar agora" leva diretamente ao configurador.</p>'
  },
  cols: {
    title: '④ Coleções da loja',
    body: '<p>Grelha de 4 cartões — cada um representa uma categoria de patches disponíveis.</p><ul><li>Gamer</li><li>Rocker</li><li>Automotivo</li><li>Motoqueiro</li></ul><p>Cada cartão tem fotografia de fundo, gradiente na base e o nome. Ao passar o rato, a imagem faz zoom suave.</p>'
  },
  social: {
    title: '⑤ Avaliações de clientes',
    body: '<p>Secção dedicada a mostrar que outros clientes ficaram satisfeitos — essencial para quem visita pela primeira vez.</p><ul><li>Cartões com avaliação de 5 estrelas e texto real</li><li>Nome do cliente em cada cartão</li><li>Fotografias de clientes reais (a adicionar)</li></ul>'
  },
  cta: {
    title: '⑥ Convite para personalizar',
    body: '<p>Última secção da página — resume tudo e convida o visitante a dar o passo final. Fundo com gradiente escuro para criar separação visual.</p><ul><li><strong>Título:</strong> "Pronto para criar o teu patch?"</li><li><strong>Nota:</strong> "Sem conta necessária · Entrega em 7–10 dias"</li><li><strong>Botão dourado:</strong> leva ao configurador</li><li><strong>Botão contorno:</strong> ver coleções</li></ul>'
  }
};

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
  renderProjectChecklist();

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

  // ── Wireframe — clique nas secções
  const wfInfoPanel   = document.getElementById('wf-info-panel');
  const wfInfoContent = document.getElementById('wf-info-content');
  const wfInfoClose   = document.getElementById('wf-info-close');

  document.querySelectorAll('.wf-clickable').forEach(function(sec) {
    sec.addEventListener('click', function() {
      const key  = sec.dataset.wf;
      const info = WF_INFO[key];
      if (!info || !wfInfoPanel) return;

      document.querySelectorAll('.wf-clickable').forEach(function(s) { s.classList.remove('wf-active'); });
      sec.classList.add('wf-active');

      wfInfoContent.innerHTML = '<h4>' + info.title + '</h4>' + info.body;
      wfInfoPanel.classList.add('open');
    });
  });

  if (wfInfoClose) {
    wfInfoClose.addEventListener('click', function() {
      wfInfoPanel.classList.remove('open');
      document.querySelectorAll('.wf-clickable').forEach(function(s) { s.classList.remove('wf-active'); });
    });
  }

});

