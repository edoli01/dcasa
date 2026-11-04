/**
 * D.Casa — pagina Contatti
 * 01 Header/menu: coerente con altre pagine
 * 02 Mappa Google incorporata in scala di grigi
 * 03 Form: demo che apre il programma email, NON invia al server
 */

// 01 / Menu e header
const header = document.querySelector('#topbar');
const menuButton = document.querySelector('#menuToggle');
const productMenu = document.querySelector('#productsNav');
const productButton = document.querySelector('#productsToggle');

// Su questa pagina l'header è chiaro fin dall'inizio.
header.classList.add('scrolled');
menuButton.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
function setProductsOpen(open) {
  productMenu.classList.toggle('open', open);
  productButton.setAttribute('aria-expanded', String(open));
}
productButton.addEventListener('click', () => setProductsOpen(!productMenu.classList.contains('open')));
productMenu.addEventListener('mouseenter', () => {
  if (window.matchMedia('(min-width: 761px) and (hover: hover)').matches) setProductsOpen(true);
});
productMenu.addEventListener('mouseleave', () => {
  if (window.matchMedia('(min-width: 761px) and (hover: hover)').matches) setProductsOpen(false);
});
document.addEventListener('click', event => { if (!productMenu.contains(event.target)) setProductsOpen(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setProductsOpen(false); });

// 03 / Demo del form. Non registra né invia dati: apre la mail del visitatore.
document.querySelector('#dcasaContactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const subject = `Contatto D.Casa — ${values.get('argomento')}`;
  const body = [
    `Nome: ${values.get('nome')}`, `Email: ${values.get('email')}`,
    `Telefono: ${values.get('telefono') || 'Non indicato'}`, '',
    `${values.get('messaggio')}`
  ].join('\n');
  window.location.href = `mailto:info@dicasa-aiudi.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
