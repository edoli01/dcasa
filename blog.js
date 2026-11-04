/**
 * D.CASA — MAGAZINE & BLOG
 * Navigazione condivisa e filtri dell’archivio blog.
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

// Archivio locale: filtra per categoria e mostra nove articoli alla volta.
const BLOG_PAGE_SIZE = 9;
const blogCards = [...document.querySelectorAll('.journal-card')];
const blogFilters = [...document.querySelectorAll('.blog-filter')];
const blogCount = document.getElementById('blogResults');
const loadMoreWrapper = document.getElementById('blogLoadMore');
const loadMore = document.getElementById('loadMoreArticles');
const blogEmpty = document.getElementById('blogEmpty');
const requestedCategory = new URLSearchParams(window.location.search).get('categoria');
let activeCategory = blogFilters.some((button) => button.dataset.category === requestedCategory)
  ? requestedCategory
  : 'tutti';
let visibleLimit = BLOG_PAGE_SIZE;

function matchesBlogCategory(card, category) {
  return category === 'tutti' || card.dataset.categories.split(' ').includes(category);
}

function updateBlogArchive() {
  let total = 0;
  let shown = 0;
  blogCards.forEach((card) => {
    const matches = matchesBlogCategory(card, activeCategory);
    if (matches) total++;
    const visible = matches && shown < visibleLimit;
    card.hidden = !visible;
    if (visible) shown++;
  });
  blogFilters.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.category === activeCategory));
  });
  const label = activeCategory === 'tutti'
    ? 'Tutti gli articoli'
    : (blogFilters.find((button) => button.dataset.category === activeCategory)?.textContent.trim() || 'Articoli');
  blogCount.textContent = `${label} · ${shown} di ${total} articoli`;
  loadMoreWrapper.hidden = shown >= total;
  blogEmpty.hidden = total > 0;
  return { shown, total };
}

blogFilters.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    visibleLimit = BLOG_PAGE_SIZE;
    updateBlogArchive();
  });
});

loadMore.addEventListener('click', () => {
  const before = blogCards.filter((card) => !card.hidden).length;
  visibleLimit += BLOG_PAGE_SIZE;
  updateBlogArchive();
  // Il focus passa al primo nuovo articolo, anche quando il pulsante scompare.
  const firstNewCard = blogCards.filter((card) => !card.hidden)[before];
  if (firstNewCard) {
    const link = firstNewCard.querySelector('a');
    if (link) {
      link.focus({ preventScroll: true });
    } else {
      firstNewCard.tabIndex = -1;
      firstNewCard.focus({ preventScroll: true });
    }
  }
});

updateBlogArchive();
