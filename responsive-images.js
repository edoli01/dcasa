/* Image preparation is shared by the existing carousels. No layout or timing rules. */
window.DCasaImages = (() => {
  const pending = new WeakMap();
  const loaded = new Set();
  // ResizeObserver may select a different candidate during an in-flight decode.
  // Retry after the next rendering step; genuine load failures still reject.
  const decode = async image => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try { await image.decode(); return; }
      catch (error) {
        if (attempt === 2) throw error;
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    }
  };
  const prepare = (element) => {
    if (pending.has(element)) return pending.get(element);
    const promise = (async () => {
      if (element.dataset.imageCandidates) {
        const ratio = Number(element.dataset.imageRatio);
        const rect = element.getBoundingClientRect();
        const target = Math.max(rect.width, rect.height * ratio) * devicePixelRatio;
        const candidates = element.dataset.imageCandidates.split(',').map(entry => {
          const [url, width] = entry.trim().split(/\s+/);
          return { url, width: Number(width.slice(0, -1)) };
        }).filter(candidate => innerWidth > 768 || candidate.width <= 1920);
        const selected = candidates.find(candidate => candidate.width >= target) || candidates.at(-1);
        const image = new Image();
        image.fetchPriority = element.classList.contains('active') ? 'high' : 'low';
        image.src = selected.url;
        await decode(image);
        element.style.backgroundImage = `url("${selected.url}")`;
      } else {
        if (element.dataset.srcset) {
          element.srcset = element.dataset.srcset;
          element.src = element.dataset.src;
        }
        await decode(element);
      }
      loaded.add(element);
    })();
    pending.set(element, promise);
    promise.catch(() => pending.delete(element));
    return promise;
  };
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      loaded.forEach(element => {
        if (!element.dataset.imageCandidates) return;
        pending.delete(element);
        prepare(element).catch(() => {});
      });
    }, 150);
  });
  return { prepare };
})();

// Resolve the actual painted width, including cover, at every CSS breakpoint.
// Static sizes remain the initial/no-JavaScript fallback for the preload scanner.
document.addEventListener('DOMContentLoaded', () => {
  function updateSize(image) {
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const cover = getComputedStyle(image).objectFit === 'cover';
    const width = cover ? Math.max(rect.width, rect.height * Number(image.dataset.sourceRatio)) : rect.width;
    const limit = innerWidth <= 768 ? Math.floor(1920 / devicePixelRatio) : Infinity;
    const size = Math.max(1, Math.min(Math.ceil(width), limit)) + 'px';
    if (image.sizes !== size) image.sizes = size;
  }
  const observer = new ResizeObserver(entries => entries.forEach(entry => updateSize(entry.target)));
  const images = [...document.querySelectorAll('img[data-source-ratio]')];
  images.forEach(image => { observer.observe(image); updateSize(image); });
  addEventListener('resize', () => images.forEach(updateSize), { passive: true });
});
