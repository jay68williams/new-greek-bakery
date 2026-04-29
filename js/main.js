/* ============================================
   NEW GREEK BAKERY — MAIN JS
   ============================================ */

(function () {
  'use strict';

  // --- Nav scroll behaviour ---
  const nav = document.querySelector('.nav');
  if (nav && !nav.classList.contains('nav-solid')) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu ---
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Menu sticky nav active state ---
  const catLinks = document.querySelectorAll('.menu-cat-link');
  const menuSections = document.querySelectorAll('.menu-section[id]');
  if (catLinks.length && menuSections.length) {
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
    const stickyNavHeight = 48;
    const offset = navHeight + stickyNavHeight + 20;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            catLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
    );
    menuSections.forEach(section => observer.observe(section));
  }

  // --- Opening hours status ---
  function updateStatus() {
    const now = new Date();
    const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    const day = ukTime.getDay();
    const hour = ukTime.getHours();
    const minute = ukTime.getMinutes();
    const time = hour * 60 + minute;

    // Bakery hours: Mon-Sat 7:00-18:00, Sun 8:00-16:00
    let opens, closes;
    if (day === 0) { // Sunday
      opens = 8 * 60;
      closes = 16 * 60;
    } else {
      opens = 7 * 60;
      closes = 18 * 60;
    }

    const isOpen = time >= opens && time < closes;
    const statusEls = document.querySelectorAll('[data-open-status]');
    const dotEls = document.querySelectorAll('[data-dot]');

    const opensStr = day === 0 ? '8:00' : '7:00';
    const closesStr = day === 0 ? '16:00' : '18:00';

    statusEls.forEach(el => {
      el.textContent = isOpen
        ? `Open today \u00B7 ${opensStr} \u2013 ${closesStr}`
        : `Closed \u00B7 Opens ${opensStr}`;
    });
    dotEls.forEach(dot => {
      dot.style.background = isOpen ? '#34C759' : '#FF3B30';
    });
  }
  updateStatus();
  setInterval(updateStatus, 30000);

})();
