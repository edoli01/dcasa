/* Navigazione condivisa delle fotografie ingrandite. */
(() => {
  const lightbox = document.querySelector('#galleryLightbox');
  const photos = [...document.querySelectorAll('.gallery-open')];
  if (!lightbox || !photos.length) return;

  const image = lightbox.querySelector('#lightboxImage');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const navigation = document.createElement('div');
  navigation.className = 'lightbox-navigation';
  const makeButton = (label, points) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 505.08 840.34');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    svg.append(polygon);
    button.append(svg);
    return button;
  };
  const previous = makeButton('Fotografia precedente', '0 420.12 84.86 335.26 420.12 0 504.97 84.86 169.71 420.12 505.08 755.49 420.23 840.34 84.86 504.97 0 420.12');
  const next = makeButton('Fotografia successiva', '505.08 420.22 420.22 505.08 84.96 840.34 .11 755.48 335.37 420.22 0 84.85 84.85 0 420.22 335.37 505.08 420.22');
  const counter = document.createElement('span');
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  navigation.append(previous, counter, next);
  navigation.hidden = photos.length < 2;
  lightbox.append(navigation);
  image.draggable = false;

  let index = 0;
  let returnFocus;
  let previousOverflow;
  let touchStart;
  let lastSwipe = 0;
  const show = (position) => {
    index = (position + photos.length) % photos.length;
    const photo = photos[index];
    const thumbnail = photo.querySelector('img');
    image.src = photo.dataset.full || thumbnail.src;
    image.alt = photo.dataset.alt || thumbnail.alt;
    counter.textContent = `${index + 1} / ${photos.length}`;
  };
  const close = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    touchStart = null;
    image.removeAttribute('src');
    document.body.style.overflow = previousOverflow;
    returnFocus?.focus();
  };
  photos.forEach((photo, position) => {
    photo.addEventListener('click', () => {
      returnFocus = photo;
      lastSwipe = 0;
      previousOverflow = document.body.style.overflow;
      show(position);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox && Date.now() - lastSwipe > 500) close();
  });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Tab') {
      const controls = navigation.hidden ? [closeButton] : [closeButton, previous, next];
      const current = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });
  lightbox.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : null;
  }, { passive: true });
  lightbox.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      lastSwipe = Date.now();
      show(index + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  lightbox.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
})();
