/**
 * D.CASA — ARTICOLO
 * Navigazione condivisa della pagina articolo.
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

// Condivisione aperta soltanto quando il visitatore sceglie una delle icone.
function getArticleShareUrl(location) {
  const fallback = 'https://blog.dicasa-aiudi.it/eiko-365-stufa-a-pellet-per-tutto-lanno/';
  const url = new URL(location.href);
  const local = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(url.hostname)
    || url.hostname.endsWith('.local') || url.hostname.endsWith('.localhost');
  if (!['https:', 'http:'].includes(url.protocol) || local) return fallback;
  url.search = '';
  url.hash = '';
  return url.href;
}

const articleShareUrl = getArticleShareUrl(window.location);
const articleShareTitle = 'EIKO 365: Stufa a Pellet per tutto l’anno';
const encodedUrl = encodeURIComponent(articleShareUrl);
const shareDestinations = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${articleShareTitle} ${articleShareUrl}`)}`,
  email: `mailto:?subject=${encodeURIComponent(articleShareTitle)}&body=${encodedUrl}`,
};

document.querySelectorAll('[data-share]').forEach((link) => {
  link.href = shareDestinations[link.dataset.share];
});

const copyArticleButton = document.getElementById('copyArticleLink');
const shareStatus = document.getElementById('articleShareStatus');
const shareFallback = document.getElementById('articleShareFallback');
let shareStatusTimer;

copyArticleButton.addEventListener('click', async () => {
  clearTimeout(shareStatusTimer);
  try {
    await navigator.clipboard.writeText(articleShareUrl);
    shareFallback.hidden = true;
    shareStatus.textContent = 'Link copiato';
    shareStatusTimer = setTimeout(() => { shareStatus.textContent = ''; }, 3000);
  } catch {
    shareStatus.textContent = 'Seleziona e copia il link.';
    shareFallback.value = articleShareUrl;
    shareFallback.hidden = false;
    shareFallback.focus();
    shareFallback.select();
  }
});

