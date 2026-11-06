/** D.CASA / SHOWROOM — navigazione, selettore showroom e gallery. */

// 1. HEADER E MENU (stesso comportamento delle pagine prodotto)
const header = document.querySelector('#topbar');
const menuButton = document.querySelector('#menuToggle');
const productMenu = document.querySelector('#productsNav');
const productButton = document.querySelector('#productsToggle');

function updateHeader() {
  const hero = document.querySelector('#hero');
  if (!hero) return;
  const scrolled = hero.classList.contains('showroom-detail-hero')
    ? hero.querySelector('h1').getBoundingClientRect().top <= header.offsetHeight + 32
    : hero.getBoundingClientRect().bottom <= header.offsetHeight;
  header.classList.toggle('scrolled', scrolled);
}
window.addEventListener('scroll', updateHeader, {passive:true});
window.addEventListener('resize', updateHeader);
updateHeader();

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
function setProductsOpen(open) {
  productMenu.classList.toggle('open', open);
  productButton.setAttribute('aria-expanded', String(open));
}
productButton.addEventListener('click', () => setProductsOpen(!productMenu.classList.contains('open')));
productMenu.addEventListener('mouseenter', () => {
  if (window.matchMedia('(min-width:761px) and (hover:hover)').matches) setProductsOpen(true);
});
productMenu.addEventListener('mouseleave', () => {
  if (window.matchMedia('(min-width:761px) and (hover:hover)').matches) setProductsOpen(false);
});
document.addEventListener('click', event => {
  if (!productMenu.contains(event.target)) setProductsOpen(false);
});
document.querySelectorAll('#siteNav a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded','false');
    setProductsOpen(false);
  });
});

// 2. CAROSELLO SHOWROOM: manuale, senza autoplay, con selettori e frecce
const slides = [...document.querySelectorAll('.showcase-slide')];
const selectors = [...document.querySelectorAll('.showcase-select')];
let activeSlide = 0;
let showcaseRequest = 0;
async function showSlide(index) {
  if (!slides.length) return;
  const next = (index + slides.length) % slides.length;
  const request = ++showcaseRequest;
  try { await DCasaImages.prepare(slides[next].querySelector('img')); } catch { return; }
  if (request !== showcaseRequest) return;
  activeSlide = next;
  slides.forEach((slide, i) => {
    const selected = i === activeSlide;
    slide.classList.toggle('is-active', selected);
    slide.setAttribute('aria-hidden', String(!selected));
    slide.inert = !selected;
    // I link delle slide nascoste non entrano nella navigazione da tastiera.
    slide.querySelector('a').tabIndex = selected ? 0 : -1;
  });
  selectors.forEach((button, i) => {
    button.classList.toggle('is-active', i === activeSlide);
    button.setAttribute('aria-pressed', String(i === activeSlide));
  });
}
selectors.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.select))));
document.querySelector('.showcase-previous')?.addEventListener('click', () => showSlide(activeSlide - 1));
document.querySelector('.showcase-next')?.addEventListener('click', () => showSlide(activeSlide + 1));
function selectShowroomFromHash() {
  const index = slides.findIndex(slide => slide.id === window.location.hash.slice(1));
  if (index >= 0) showSlide(index);
}
showSlide(0);
selectShowroomFromHash();
window.addEventListener('hashchange', selectShowroomFromHash);

// Carosello fotografico: stesso passo delle Realizzazioni in homepage.
const galleryCarousel = document.getElementById('showroomGalleryCarousel');
if (galleryCarousel) {
  const photos = [...galleryCarousel.querySelectorAll('.gallery-open')];
  const previous = document.getElementById('prevGallery');
  const next = document.getElementById('nextGallery');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function moveGallery(direction) {
    const left = galleryCarousel.scrollLeft;
    const end = galleryCarousel.scrollWidth - galleryCarousel.clientWidth;
    const offsets = photos.map(photo => photo.getBoundingClientRect().left
      - galleryCarousel.getBoundingClientRect().left + left);
    let target = direction > 0
      ? offsets.find(offset => offset > left + 5)
      : offsets.reverse().find(offset => offset < left - 5);
    if (direction > 0 && left >= end - 2) target = 0;
    if (direction < 0 && left <= 2) target = end;
    if (target === undefined) return;
    galleryCarousel.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => moveGallery(-1));
  next.addEventListener('click', () => moveGallery(1));
  galleryCarousel.addEventListener('keydown', event => {
    if (event.target !== galleryCarousel) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveGallery(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
}

// 3. LIGHTBOX GALLERY: usa direttamente il src dell'immagine,
//    quindi quando lo cambi nell'HTML non devi cambiare altro.
const lightbox = document.querySelector('#galleryLightbox');
if (lightbox) {
  const image = lightbox.querySelector('#lightboxImage');
  const close = lightbox.querySelector('.lightbox-close');
  let lastFocused;
  document.querySelectorAll('.gallery-open').forEach(button => {
    button.addEventListener('click', () => {
      lastFocused = button;
      const photo = button.querySelector('img');
      image.src = photo.src;
      image.alt = photo.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      close.focus();
    });
  });
  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    image.removeAttribute('src');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }
  close.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {if(event.target === lightbox) closeLightbox()});
  document.addEventListener('keydown', event => {if(event.key === 'Escape') closeLightbox()});
}
document.addEventListener('keydown', event => {if(event.key === 'Escape') setProductsOpen(false)});
