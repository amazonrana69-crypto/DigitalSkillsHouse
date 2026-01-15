(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  const menuBtn = document.getElementById('menuBtn');
  const navPanel = document.getElementById('navPanel');

  function setPanel(open) {
    if (!menuBtn || !navPanel) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    navPanel.hidden = !open;
  }

  if (menuBtn && navPanel) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      setPanel(!isOpen);
    });

    navPanel.addEventListener('click', (e) => {
      const t = e.target;
      if (t instanceof HTMLElement && t.matches('a')) setPanel(false);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setPanel(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) setPanel(false);
    });
  }

  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  const sectionIds = ['about', 'skills', 'projects', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((x) => x);

  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  function setActive(id) {
    navLinks.forEach((l) => {
      const href = l.getAttribute('href');
      const active = href === `#${id}`;
      l.style.opacity = active ? '1' : '';
      l.style.textDecoration = active ? 'underline' : '';
      l.style.textUnderlineOffset = active ? '6px' : '';
    });
  }

  if (sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.25, 0.45, 0.6] }
    );

    sections.forEach((s) => obs.observe(s));
  }

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const toTop = document.getElementById('toTop');
  if (toTop) {
    const toggle = () => {
      const show = window.scrollY > 450;
      toTop.hidden = !show;
    };

    window.addEventListener('scroll', toggle, { passive: true });
    window.addEventListener('load', toggle);

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const msg = String(data.get('message') || '').trim();

      if (!name || !email || !msg) {
        status.textContent = 'Please fill in all fields.';
        return;
      }

      status.textContent = 'Message ready. Add backend/email service to actually send it.';
      form.reset();
    });
  }
})();
