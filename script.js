(function () {
  const menuBtn = document.getElementById('menuBtn');
  const navPanel = document.getElementById('navPanel');

  function setPanel(open) {
    if (!menuBtn || !navPanel) return;

    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      navPanel.hidden = false;
      requestAnimationFrame(() => {
        navPanel.style.display = 'block';
      });
    } else {
      navPanel.hidden = true;
      navPanel.style.display = '';
    }
  }

  if (menuBtn && navPanel) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      setPanel(!isOpen);
    });

    navPanel.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches('a')) setPanel(false);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setPanel(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) setPanel(false);
    });
  }

  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((a) => {
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

  const track = document.getElementById('sliderTrack');
  const prev = document.getElementById('prevSlide');
  const next = document.getElementById('nextSlide');
  const dotsRoot = document.getElementById('sliderDots');

  if (track && prev && next && dotsRoot) {
    const slides = Array.from(track.children);
    const total = slides.length;
    let index = 0;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dotbtn';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => setIndex(i));
      dotsRoot.appendChild(b);
      return b;
    });

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
    }

    function setIndex(i) {
      index = (i + total) % total;
      render();
    }

    prev.addEventListener('click', () => setIndex(index - 1));
    next.addEventListener('click', () => setIndex(index + 1));

    let timer = window.setInterval(() => setIndex(index + 1), 4500);

    const slider = track.closest('.slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => {
        window.clearInterval(timer);
      });
      slider.addEventListener('mouseleave', () => {
        timer = window.setInterval(() => setIndex(index + 1), 4500);
      });
    }

    render();
  }
})();
