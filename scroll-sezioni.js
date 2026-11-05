// Scorrimento graduale dei collegamenti alle sezioni della pagina corrente.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;

  function stopScroll() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  // Il controllo torna subito all'utente quando interviene sullo scorrimento.
  window.addEventListener('wheel', stopScroll, { passive: true });
  window.addEventListener('touchstart', stopScroll, { passive: true });
  window.addEventListener('pointerdown', stopScroll, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab', 'Escape'].includes(event.key)) stopScroll();
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.hasAttribute('download') || (link.target && link.target !== '_self')
      || reducedMotion.matches) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname
      || url.search !== window.location.search || !url.hash) return;

    let target;
    try {
      target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch {
      return;
    }
    if (!target) return;

    event.preventDefault();
    stopScroll();

    if (window.location.hash !== url.hash) {
      const oldURL = window.location.href;
      window.history.pushState(null, '', url.hash);
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: url.href }));
    }

    const start = window.scrollY;
    const header = document.getElementById('topbar');
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const offset = link.classList.contains('hero-scroll-down')
      ? 0
      : margin || (header ? header.offsetHeight + 16 : 0);
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = Math.min(max, Math.max(0, target.getBoundingClientRect().top + start - offset));
    const distance = destination - start;
    const duration = Math.min(1200, Math.max(650, Math.abs(distance) * .35));
    let started;

    function animate(time) {
      if (started === undefined) started = time;
      const progress = Math.min(1, (time - started) / duration);
      const eased = progress < .5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: start + distance * eased, behavior: 'instant' });
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = null;
        const temporaryTabIndex = !target.hasAttribute('tabindex');
        if (temporaryTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (temporaryTabIndex) target.removeAttribute('tabindex');
      }
    }

    frame = requestAnimationFrame(animate);
  });
})();
