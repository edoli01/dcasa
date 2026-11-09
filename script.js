/**
 * D.CASA — INTERAZIONI PRINCIPALI
 * --------------------------------
 * 1. Header trasparente sulla hero
 * 2. Carosello fotografico
 * 3. Menu mobile
 * 4. Sottomenu Prodotti
 * 5. Carosello Progetti
 * 6. Carosello Prodotti
 *
 * Modifica tempi e comportamenti nelle costanti qui sotto.
 */

const SLIDE_DURATION = 6500; // millisecondi: durata di ogni slide
const MOBILE_BREAKPOINT = 760; // deve coincidere con il CSS

// Su mobile il link al blog segue le card anche nell'ordine di tastiera.
const blogPreview = document.querySelector('.home-content .blog-preview');
const blogHeading = blogPreview?.querySelector('.blog-heading');
const blogAside = blogHeading?.querySelector('.blog-aside');
if (blogAside) {
  const mobileBlog = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const placeBlogLink = () => {
    (mobileBlog.matches ? blogPreview : blogHeading).append(blogAside);
  };
  mobileBlog.addEventListener('change', placeBlogLink);
  placeBlogLink();
}

const header = document.getElementById('topbar');
const hero = document.getElementById('hero');
const mobileMenuButton = document.getElementById('menuToggle');

// ---------------------------------------------------------
// 1. HEADER: trasparente finché siamo sulla fotografia hero
// ---------------------------------------------------------
function updateHeader() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  const headerHeight = header.getBoundingClientRect().height;
  header.classList.toggle('scrolled', heroBottom <= headerHeight);
}

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

// ---------------------------------------------------------
// 2. HERO: carosello con tutte le fotografie presenti nell'HTML
// ---------------------------------------------------------
const slides = [...document.querySelectorAll('.hero-slide')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let slideTimer;
let imagePrefetchTimer;
let slideRequest = 0;

async function showSlide(index) {
  if (!slides.length) return;
  const next = (index + slides.length) % slides.length;
  const request = ++slideRequest;
  try { await DCasaImages.prepare(slides[next]); } catch { return; }
  if (request !== slideRequest) return;
  currentSlide = next;

  if (!reducedMotion.matches) {
    clearTimeout(imagePrefetchTimer);
    imagePrefetchTimer = setTimeout(() => DCasaImages.prepare(slides[(currentSlide + 1) % slides.length]).catch(() => {}), SLIDE_DURATION - 2000);
  }
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });

}

function startSlideshow() {
  clearInterval(slideTimer);
  clearTimeout(imagePrefetchTimer);
  if (reducedMotion.matches || slides.length <= 1) return;
  imagePrefetchTimer = setTimeout(() => {
    DCasaImages.prepare(slides[(currentSlide + 1) % slides.length]).catch(() => {});
  }, SLIDE_DURATION - 2000);
  slideTimer = setInterval(() => showSlide(currentSlide + 1), SLIDE_DURATION);
}

DCasaImages.prepare(slides[0]).catch(() => {});
startSlideshow();

// ---------------------------------------------------------
// 3. MENU MOBILE
// ---------------------------------------------------------
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

// 5. PROGETTI: scorrimento manuale con frecce, tastiera e touch.
const projectCarousel = document.getElementById('projectCarousel');

if (projectCarousel) {
  const cards = [...projectCarousel.querySelectorAll('.home-project')];
  const previous = document.getElementById('prevProject');
  const next = document.getElementById('nextProject');

  function cardOffset(card) {
    return card.getBoundingClientRect().left
      - projectCarousel.getBoundingClientRect().left + projectCarousel.scrollLeft;
  }

  function updateProjectControls() {
    const canScroll = projectCarousel.scrollWidth > projectCarousel.clientWidth + 2;
    previous.disabled = !canScroll;
    next.disabled = !canScroll;
  }

  function moveProject(direction) {
    const left = projectCarousel.scrollLeft;
    const end = projectCarousel.scrollWidth - projectCarousel.clientWidth;
    const offsets = cards.map(cardOffset);
    let target = direction > 0
      ? offsets.find((offset) => offset > left + 5)
      : offsets.reverse().find((offset) => offset < left - 5);
    if (direction > 0 && left >= end - 2) target = 0;
    if (direction < 0 && left <= 2) target = end;
    if (target === undefined) return;
    projectCarousel.scrollTo({
      left: target,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  previous.addEventListener('click', () => moveProject(-1));
  next.addEventListener('click', () => moveProject(1));
  projectCarousel.addEventListener('keydown', (event) => {
    if (event.target !== projectCarousel) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveProject(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  projectCarousel.addEventListener('scroll', updateProjectControls, { passive: true });
  new ResizeObserver(updateProjectControls).observe(projectCarousel);
  document.querySelector('.project-controls').hidden = false;
  updateProjectControls();
}

// 6. PRODOTTI: tre schede per pagina su desktop, una su mobile.
const productCarousel = document.getElementById('productCarousel');

if (productCarousel) {
  const cards = [...productCarousel.querySelectorAll('.product-card')];
  const previous = document.getElementById('prevProduct');
  const next = document.getElementById('nextProduct');

  function productOffset(card) {
    return card.getBoundingClientRect().left
      - productCarousel.getBoundingClientRect().left + productCarousel.scrollLeft;
  }

  function updateProductControls() {
    const canScroll = productCarousel.scrollWidth > productCarousel.clientWidth + 2;
    previous.disabled = !canScroll;
    next.disabled = !canScroll;
  }

  function scrollProducts(left) {
    productCarousel.scrollTo({
      left,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  function moveProducts(direction) {
    const step = productOffset(cards[1]) - productOffset(cards[0]);
    const perPage = Math.max(1, Math.round(productCarousel.clientWidth / step));
    const index = Math.round(productCarousel.scrollLeft / step);
    const end = productCarousel.scrollWidth - productCarousel.clientWidth;
    if (direction > 0 && productCarousel.scrollLeft >= end - 2) {
      scrollProducts(0);
      return;
    }
    if (direction < 0 && productCarousel.scrollLeft <= 2) {
      scrollProducts(end);
      return;
    }
    const target = Math.max(0, Math.min(cards.length - perPage, index + direction * perPage));
    scrollProducts(productOffset(cards[target]));
  }

  // I collegamenti del menu devono mostrare anche le categorie fuori vista.
  function revealLinkedProduct() {
    const card = cards.find((item) => item.id && `#${item.id}` === window.location.hash);
    if (card) scrollProducts(productOffset(card));
  }

  previous.addEventListener('click', () => moveProducts(-1));
  next.addEventListener('click', () => moveProducts(1));
  productCarousel.addEventListener('keydown', (event) => {
    if (event.target !== productCarousel) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveProducts(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  productCarousel.addEventListener('scroll', updateProductControls, { passive: true });
  new ResizeObserver(updateProductControls).observe(productCarousel);
  window.addEventListener('hashchange', revealLinkedProduct);
  document.querySelector('.product-controls').hidden = false;
  revealLinkedProduct();
  updateProductControls();
}
