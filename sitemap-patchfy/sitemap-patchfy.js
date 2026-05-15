document.addEventListener('DOMContentLoaded', () => {

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

