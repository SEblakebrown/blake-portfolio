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
