/**
 * D.CASA — INTERAZIONI PRINCIPALI
 * --------------------------------
 * 1. Header trasparente sulla hero
 * 2. Carosello fotografico
 * 3. Menu mobile
 * 4. Sottomenu Prodotti
 *
 * Modifica tempi e comportamenti nelle costanti qui sotto.
 */

const SLIDE_DURATION = 6500; // millisecondi: durata di ogni slide
const MOBILE_BREAKPOINT = 760; // deve coincidere con il CSS

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

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });

}

function startSlideshow() {
  clearInterval(slideTimer);
  if (reducedMotion.matches || slides.length <= 1) return;
  slideTimer = setInterval(() => showSlide(currentSlide + 1), SLIDE_DURATION);
}

function goToSlide(index) {
  showSlide(index);
  startSlideshow();
}

document.getElementById('prevSlide').addEventListener('click', () => {
  goToSlide(currentSlide - 1);
});
document.getElementById('nextSlide').addEventListener('click', () => {
  goToSlide(currentSlide + 1);
});
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
    const left = projectCarousel.scrollLeft;
    const right = left + projectCarousel.clientWidth;
    previous.disabled = left <= 2;
    next.disabled = right >= projectCarousel.scrollWidth - 2;
  }

  function moveProject(direction) {
    const left = projectCarousel.scrollLeft;
    const offsets = cards.map(cardOffset);
    const target = direction > 0
      ? offsets.find((offset) => offset > left + 5)
      : offsets.reverse().find((offset) => offset < left - 5);
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
