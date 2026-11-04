/**
 * D.CASA — REALIZZAZIONI
 * Navigazione, tendina Prodotti e filtri delle realizzazioni.
 */

// Navigazione come in homepage: menu mobile e tendina Prodotti.
const MOBILE_BREAKPOINT = 760;
const header = document.getElementById('topbar');
const mobileMenuButton = document.getElementById('menuToggle');

function closeMobileMenu() {
  header.classList.remove('menu-open');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
}

mobileMenuButton.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.navlinks a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

// ---------------------------------------------------------
// 4. MENU PRODOTTI: hover desktop, clic su tutti i dispositivi
// ---------------------------------------------------------
const productsNav = document.getElementById('productsNav');
const productsButton = document.getElementById('productsToggle');

function setProductsOpen(isOpen) {
  productsNav.classList.toggle('open', isOpen);
  productsButton.setAttribute('aria-expanded', String(isOpen));
}

function isDesktopHover() {
  return window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px) and (hover: hover)`).matches;
}

productsButton.addEventListener('click', () => {
  setProductsOpen(!productsNav.classList.contains('open'));
});
productsNav.addEventListener('mouseenter', () => {
  if (isDesktopHover()) setProductsOpen(true);
});
productsNav.addEventListener('mouseleave', () => {
  if (isDesktopHover()) setProductsOpen(false);
});

document.addEventListener('click', (event) => {
  if (!productsNav.contains(event.target)) setProductsOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setProductsOpen(false);
    productsButton.blur();
  }
});
document.querySelectorAll('#productsSubmenu a').forEach((link) => {
  link.addEventListener('click', () => setProductsOpen(false));
});

// Filtri progetto
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-tile');
const visibleCount = document.querySelector('#visibleCount');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedCategory = button.dataset.filter;
    let count = 0;

    projects.forEach((project) => {
      const show = selectedCategory === 'Tutti' || project.dataset.category === selectedCategory;
      project.hidden = !show;
      if (show) count++;
    });

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    visibleCount.textContent = String(count).padStart(2, '0');
  });
});
