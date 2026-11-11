(() => {
    const ids = ['home', 'projects', 'skills', 'about', 'contact'];
    const pages = [...document.querySelectorAll('.page')];
    const toast = document.getElementById('toast');
    let toastTimer;

    function showPage(id, updateHash = true) {
      if (!ids.includes(id)) id = 'home';
      pages.forEach(page => {
        const active = page.id === id;
        page.classList.toggle('active', active);
        page.setAttribute('aria-hidden', String(!active));
      });
      if (updateHash && location.hash !== '#' + id) history.pushState({page:id}, '', '#' + id);
      document.title = id === 'home' ? 'Hafiz Rizqi Hernanda — Phantom Portfolio' : `${id[0].toUpperCase()}${id.slice(1)} — Hafiz Rizqi Hernanda`;
      window.scrollTo({top:0, behavior:'smooth'});
    }

    document.querySelectorAll('[data-page]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault(); showPage(link.dataset.page);
    }));
    document.querySelectorAll('a[href="#home"]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault(); showPage('home');
    }));
    document.querySelectorAll('.back-home').forEach(link => {
      if (link.getAttribute('href') === '#home') link.addEventListener('click', event => { event.preventDefault(); showPage('home'); });
    });
    window.addEventListener('popstate', () => showPage(location.hash.slice(1) || 'home', false));
    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      if (ids.includes(id) && !document.getElementById(id).classList.contains('active')) showPage(id, false);
    });
    window.addEventListener('keydown', event => {
      if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      const map = {'0':'home','1':'projects','2':'skills','3':'about','4':'contact','Escape':'home'};
      if (map[event.key]) showPage(map[event.key]);
      else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const active = ids.indexOf(document.querySelector('.page.active')?.id || 'home');
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        showPage(ids[(active + delta + ids.length) % ids.length]);
      }
    });

    document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        toast.textContent = 'Copied to clipboard';
      } catch {
        toast.textContent = 'Copy tidak didukung browser';
      }
      toast.classList.add('show'); clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
    }));

    const initial = location.hash.slice(1);
    if (ids.includes(initial)) showPage(initial, false);
  })();
