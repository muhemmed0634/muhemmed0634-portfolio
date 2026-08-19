// script.js — Muhammad's Portfolio | Logic & Interactions

/* ═══════════════════════════════════════════════════════════
   1. LANGUAGE SYSTEM
   ═══════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'portfolio_lang';
let currentLang = localStorage.getItem(STORAGE_KEY) || 'az';

function applyTranslations(lang) {
  const t = translations[lang];
  const tDefault = translations['az']; // Fallback kimi AZ istifadə edirik
  if (!t) return;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let text = t[key];
    
    // Əgər seçilmiş dildə bu açar yoxdursa, AZ dilindən götür, o da yoxdursa boş qoy
    if (text === undefined) {
      text = tDefault[key] !== undefined ? tDefault[key] : '';
    }

    // For elements that should preserve child elements (like spans)
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Update page title
  const pageTitle = t['page_title'] || tDefault['page_title'] || "Muhəmməd | Developer Portfolio";
  document.title = pageTitle;

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function switchLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(lang);

  // Re-trigger typing animation for hero
  restartTypingAnimation();
}

/* ═══════════════════════════════════════════════════════════
   2. TYPING ANIMATION
   ═══════════════════════════════════════════════════════════ */
let typingTimeout = null;
let typingAborted = false;

function typeText(element, text, speed = 55, callback) {
  element.textContent = '';
  let i = 0;
  typingAborted = false;

  function type() {
    if (typingAborted) return;
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      typingTimeout = setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }
  type();
}

function abortTyping() {
  typingAborted = true;
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
}

let heroTypingStarted = false;

function startHeroTyping() {
  const t = translations[currentLang];
  const subtitleEl = document.getElementById('hero-subtitle-text');
  if (!subtitleEl) return;

  // Abort any running animation
  abortTyping();

  // Set subtitle text immediately
  subtitleEl.textContent = '';

  setTimeout(() => {
    typeText(subtitleEl, t.hero_subtitle, 60);
  }, 100);
}

function restartTypingAnimation() {
  startHeroTyping();
}

/* ═══════════════════════════════════════════════════════════
   3. MATRIX RAIN
   ═══════════════════════════════════════════════════════════ */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}<>[]()#$%&ABCDEF';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.floor(W / 16);
    drops = Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(13,17,23,0.05)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#39d353';
    ctx.font = '12px Fira Code, monospace';

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

/* ═══════════════════════════════════════════════════════════
   4. NAVBAR SCROLL EFFECT
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    lastY = y;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   5. HAMBURGER MOBILE NAV
   ═══════════════════════════════════════════════════════════ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   6. SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   7. TERMINAL ABOUT SECTION ANIMATION
   ═══════════════════════════════════════════════════════════ */
function initTerminalAbout() {
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.t-line').forEach((line, i) => {
            setTimeout(() => {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, i * 120);
          });
          aboutObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const terminalBody = document.querySelector('.terminal-body');
  if (terminalBody) {
    // Set initial state
    terminalBody.querySelectorAll('.t-line').forEach(line => {
      line.style.opacity = '0';
      line.style.transform = 'translateX(-10px)';
      line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    aboutObserver.observe(terminalBody);
  }
}

/* ═══════════════════════════════════════════════════════════
   8. ACTIVE NAV LINK HIGHLIGHT
   ═══════════════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}`;
            link.style.color = isActive ? 'var(--accent-green)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════════════════════════
   9. SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 64; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   10. GLITCH EFFECT ON HERO NAME
   ═══════════════════════════════════════════════════════════ */
function initGlitch() {
  const name = document.getElementById('hero-name');
  if (!name) return;

  const originalText = name.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

  name.addEventListener('mouseenter', () => {
    let iterations = 0;
    const maxIterations = 12;
    const interval = setInterval(() => {
      name.textContent = originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iterations) return originalText[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (++iterations > maxIterations) {
        clearInterval(interval);
        name.textContent = originalText;
      }
    }, 40);
  });
}

/* ═══════════════════════════════════════════════════════════
   11. INIT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language first
  applyTranslations(currentLang);

  // Language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });

  // Init all features
  initMatrixRain();
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initTerminalAbout();
  initActiveNav();
  initSmoothScroll();
  initGlitch();

  // Start hero typing after a short delay (for dramatic effect)
  setTimeout(() => {
    startHeroTyping();
  }, 800);
});
