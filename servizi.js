/**
 * D.CASA — SERVIZI
 * Header e menu Prodotti.
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


// Chiudi il menu mobile dopo la selezione di un collegamento.
document.querySelectorAll('.navlinks a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    setProductsOpen(false);
  });
});

