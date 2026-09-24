// Trío de la Luz — interacciones

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const toggle = nav.querySelector('.nav__toggle');
  const links = nav.querySelector('.nav__links');

  // Nav: fondo al hacer scroll
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Reveal al entrar en viewport
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  // Línea de luz: progreso de lectura
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const updateBar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    updateBar();
    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
  }

  // Luz que sigue al cursor en el hero
  const hero = document.querySelector('.hero');
  const light = document.querySelector('.hero__cursorlight');
  if (hero && light && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let px = 0, py = 0, raf = null;
    hero.addEventListener('mousemove', (e) => {
      px = e.clientX; py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        light.style.left = (px - r.left) + 'px';
        light.style.top = (py - r.top) + 'px';
        raf = null;
      });
    });
  }

  // Año del footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
