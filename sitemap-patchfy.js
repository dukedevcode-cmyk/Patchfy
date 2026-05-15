document.addEventListener('DOMContentLoaded', () => {

  // ── Navegação entre views
  const navItems = document.querySelectorAll('.nav-item');
  const views    = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.view;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        v.classList.remove('active');
        if (v.id === 'view-' + target) {
          v.classList.add('active');
          // scroll to top when switching
          v.closest('.right-panel').scrollTo({ top: 0, behavior: 'instant' });
        }
      });
    });
  });

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

