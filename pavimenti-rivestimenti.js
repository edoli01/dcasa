/**
 * D.CASA — PAVIMENTI E RIVESTIMENTI
 * Solo tre funzionalità: header, menu Prodotti e gallery.
 * Non è necessario caricare script.js della homepage.
 */

const header = document.querySelector('#topbar');
const menuButton = document.querySelector('#menuToggle');
const productMenu = document.querySelector('#productsNav');
const productButton = document.querySelector('#productsToggle');

// 1. Header chiaro dopo la hero.
function updateHeader() {
  const hero = document.querySelector('#hero');
  const heroBottom = hero.getBoundingClientRect().bottom;
  header.classList.toggle('scrolled', heroBottom <= header.offsetHeight);
}
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

// 2. Menu responsive e tendina Prodotti.
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

function setProductsOpen(open) {
  productMenu.classList.toggle('open', open);
  productButton.setAttribute('aria-expanded', String(open));
}
productButton.addEventListener('click', () => {
  setProductsOpen(!productMenu.classList.contains('open'));
});
productMenu.addEventListener('mouseenter', () => {
  if (window.matchMedia('(min-width: 761px) and (hover: hover)').matches) setProductsOpen(true);
});
productMenu.addEventListener('mouseleave', () => {
  if (window.matchMedia('(min-width: 761px) and (hover: hover)').matches) setProductsOpen(false);
});
document.addEventListener('click', event => {
  if (!productMenu.contains(event.target)) setProductsOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setProductsOpen(false);
});

// 3. Apri e chiudi le fotografie (clic, pulsante X, ESC).
const lightbox = document.querySelector('#galleryLightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const closeButton = lightbox.querySelector('.lightbox-close');
let lastFocused = null;

document.querySelectorAll('.gallery-open').forEach(button => {
  button.addEventListener('click', () => {
    lastFocused = button;
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.dataset.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });
});
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute('src');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}
closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLightbox();
});
