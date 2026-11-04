/* D.Casa — preloader presente soltanto sulla home. */
(() => {
  const preloader = document.getElementById('dcasaPreloader');
  if (!preloader) return;

  const MIN_VISIBLE_DURATION = 1800; // millisecondi: durata minima sulla home
  const startedAt = performance.now();
  let minimumTimer;

  function hidePreloader() {
    clearTimeout(fallbackTimer);
    clearTimeout(minimumTimer);
    preloader.classList.add('is-hidden');
    preloader.setAttribute('aria-hidden', 'true');
  }

  // Evita attese indefinite quando una risorsa esterna non risponde.
  const fallbackTimer = setTimeout(hidePreloader, 10000);

  function whenLoaded() {
    const remaining = MIN_VISIBLE_DURATION - (performance.now() - startedAt);
    minimumTimer = setTimeout(hidePreloader, Math.max(0, remaining));
  }

  if (document.readyState === 'complete') {
    whenLoaded();
  } else {
    window.addEventListener('load', whenLoaded, { once: true });
  }

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    preloader.style.transition = 'none';
    hidePreloader();
    void preloader.offsetWidth;
    preloader.style.removeProperty('transition');
  });
})();
