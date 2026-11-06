(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pending');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    elements.forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('pending');
        revealObserver.observe(element);
      }
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        elements.forEach(element => element.classList.remove('pending'));
        revealObserver.disconnect();
      }
    });
  }
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  function updateProgress() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0})`;
    queued = false;
  }
  function requestProgress() {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress);
  updateProgress();
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('nav a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();

// Pointer lighting uses one animation frame per input burst; no idle render loop.
(() => {
  const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const surfaces = [...document.querySelectorAll('main > .section')];
  let active = null;
  let frame = 0;
  let position = null;

  function clear() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    position = null;
    surfaces.forEach(surface => {
      surface.classList.remove('pointer-active');
      surface.style.removeProperty('--depth-x');
      surface.style.removeProperty('--depth-y');
    });
    active = null;
  }

  function paint() {
    frame = 0;
    if (!enabled.matches || !active || !position) return;
    const bounds = active.getBoundingClientRect();
    const x = position.x - bounds.left;
    const y = position.y - bounds.top;
    active.style.setProperty('--pointer-x', `${x}px`);
    active.style.setProperty('--pointer-y', `${y}px`);
    if (active.id === 'home') {
      active.style.setProperty('--depth-x', `${(x / bounds.width - .5) * 10}px`);
      active.style.setProperty('--depth-y', `${(y / bounds.height - .5) * 8}px`);
    }
    active.classList.add('pointer-active');
  }

  surfaces.forEach(surface => {
    surface.classList.add('pointer-surface');
    surface.addEventListener('pointermove', event => {
      if (!enabled.matches || event.pointerType !== 'mouse') return;
      if (active !== surface) { clear(); active = surface; }
      position = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
    surface.addEventListener('pointerleave', clear, { passive: true });
  });
  enabled.addEventListener('change', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
})();
