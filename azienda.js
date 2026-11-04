/**
 * D.CASA — AZIENDA
 * Header, menu Prodotti e carosello del team.
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
  });
});

// Carosello manuale: frecce, scorrimento touch e tastiera.
const teamCarousel = document.getElementById('teamCarousel');
const teamPrevious = document.getElementById('teamPrevious');
const teamNext = document.getElementById('teamNext');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateTeamControls() {
  const canScroll = teamCarousel.scrollWidth > teamCarousel.clientWidth + 1;
  teamPrevious.disabled = !canScroll;
  teamNext.disabled = !canScroll;
}

function moveTeam(direction) {
  const card = teamCarousel.querySelector('.azienda-person');
  const gap = parseFloat(getComputedStyle(teamCarousel).columnGap) || 0;
  const end = teamCarousel.scrollWidth - teamCarousel.clientWidth;
  const position = teamCarousel.scrollLeft;
  let target = position + direction * (card.getBoundingClientRect().width + gap);
  if (direction > 0 && position >= end - 1) target = 0;
  if (direction < 0 && position <= 1) target = end;
  teamCarousel.scrollTo({
    left: Math.max(0, Math.min(target, end)),
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
}

teamPrevious.addEventListener('click', () => moveTeam(-1));
teamNext.addEventListener('click', () => moveTeam(1));
teamCarousel.addEventListener('scroll', updateTeamControls, { passive: true });
teamCarousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveTeam(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
new ResizeObserver(updateTeamControls).observe(teamCarousel);
document.querySelector('.azienda-team-controls').hidden = false;
updateTeamControls();

// Hero: sequenza in loop, con lo stesso intervallo della homepage.
const HERO_SLIDE_DURATION = 6500;
const heroPhotos = [...document.querySelectorAll('.azienda-hero-photo')];
let activeHeroPhoto = 0;
let heroTimer;
let heroPrefetchTimer;

function startHeroSlideshow() {
  clearInterval(heroTimer);
  clearTimeout(heroPrefetchTimer);
  if (reducedMotion.matches || document.hidden || heroPhotos.length < 2) return;
  function prepareNextHero() {
    DCasaImages.prepare(heroPhotos[(activeHeroPhoto + 1) % heroPhotos.length]).catch(() => {});
  }
  heroPrefetchTimer = setTimeout(prepareNextHero, HERO_SLIDE_DURATION - 2000);
  heroTimer = setInterval(() => {
    const next = (activeHeroPhoto + 1) % heroPhotos.length;
    if (!heroPhotos[next].complete || !heroPhotos[next].naturalWidth) return;
    heroPhotos[activeHeroPhoto].classList.remove('is-active');
    heroPhotos[next].classList.add('is-active');
    activeHeroPhoto = next;
    heroPrefetchTimer = setTimeout(prepareNextHero, HERO_SLIDE_DURATION - 2000);
  }, HERO_SLIDE_DURATION);
}

document.addEventListener('visibilitychange', startHeroSlideshow);
reducedMotion.addEventListener('change', startHeroSlideshow);
startHeroSlideshow();
