/* D.CASA — SINGOLA REALIZZAZIONE
   Header, menu responsive, menu Prodotti e gallery.
   Nessuna libreria esterna necessaria.
*/

const header = document.querySelector('#topbar');
const menuButton = document.querySelector('#menuToggle');
const productsNav = document.querySelector('#productsNav');
const productsButton = document.querySelector('#productsToggle');

// Header: trasparente sulla hero e chiaro mentre scorri.
function updateHeader() {
  const heroBottom = document.querySelector('#hero').getBoundingClientRect().bottom;
  header.classList.toggle('scrolled', heroBottom <= header.offsetHeight);
}
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

// Menu mobile e sottomenù Prodotti.
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
function setProductsOpen(open) {
  productsNav.classList.toggle('open', open);
  productsButton.setAttribute('aria-expanded', String(open));
}
productsButton.addEventListener('click', () => setProductsOpen(!productsNav.classList.contains('open')));
productsNav.addEventListener('mouseenter', () => {
  if (matchMedia('(min-width:761px) and (hover:hover)').matches) setProductsOpen(true);
});
productsNav.addEventListener('mouseleave', () => {
  if (matchMedia('(min-width:761px) and (hover:hover)').matches) setProductsOpen(false);
});
document.addEventListener('click', event => {
  if (!productsNav.contains(event.target)) setProductsOpen(false);
});
document.querySelectorAll('.navlinks a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  setProductsOpen(false);
}));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setProductsOpen(false);
});
