// ── Cloudinary config — substituir com os teus dados após criar conta em cloudinary.com
const CLD_CLOUD  = 'dhwknfiza';
const CLD_PRESET = 'Patchfy';
const REFS_PIN   = '1469';
const REFS_AUTH_KEY = 'patchfy-refs-auth';
const REFS_KEY   = 'patchfy-refs';

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
    header.classList.remove('visible');
    return;
  }

  empty.style.display = 'none';
  header.classList.add('visible');
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

  // ── Cloudinary: ocultar aviso de setup quando configurado
  const setupNotice = document.getElementById('refs-setup');
  if (setupNotice && CLD_CLOUD !== 'YOUR_CLOUD_NAME') {
    setupNotice.classList.add('hidden');
  }

  // ── PIN gate
  const pinGate      = document.getElementById('refs-pin-gate');
  const pinInput     = document.getElementById('refs-pin-input');
  const pinBtn       = document.getElementById('refs-pin-btn');
  const pinError     = document.getElementById('refs-pin-error');
  const uploadZone   = document.getElementById('refs-upload-zone');
  const refsGallery  = document.getElementById('refs-gallery');
  const refsGHdr     = document.getElementById('refs-gallery-header');

  function unlockRefs() {
    sessionStorage.setItem(REFS_AUTH_KEY, '1');
    pinGate.classList.add('hidden');
    uploadZone.style.display = '';
    renderGallery();
  }

  function tryPin() {
    if (pinInput.value === REFS_PIN) {
      unlockRefs();
    } else {
      pinError.classList.add('visible');
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
    pinInput.addEventListener('input', () => pinError.classList.remove('visible'));
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

  renderGallery();

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

