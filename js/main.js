/* ============================================
   NEW GREEK BAKERY
   GSAP ScrollTrigger Animations
   ============================================ */

(function () {
  'use strict';

  // --- Scroll progress ---
  var bar = document.getElementById('scrollProgress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // --- Nav ---
  var nav = document.querySelector('.nav');
  if (nav && !nav.classList.contains('nav-solid')) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  // --- Mobile menu ---
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Menu sticky nav ---
  var catLinks = document.querySelectorAll('.menu-cat-link');
  var menuSections = document.querySelectorAll('.menu-section[id]');
  if (catLinks.length && menuSections.length) {
    var offset = 72 + 52 + 20;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          catLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-' + offset + 'px 0px -60% 0px', threshold: 0 });
    menuSections.forEach(function (s) { obs.observe(s); });
  }

  // --- Opening hours ---
  function updateStatus() {
    var now = new Date();
    var uk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
    var day = uk.getDay(), h = uk.getHours(), m = uk.getMinutes(), t = h * 60 + m;
    var opens = day === 0 ? 480 : 420;
    var closes = day === 0 ? 960 : 1080;
    var isOpen = t >= opens && t < closes;
    var oStr = day === 0 ? '8:00' : '7:00';
    var cStr = day === 0 ? '16:00' : '18:00';
    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      el.textContent = isOpen ? 'Open today \u00B7 ' + oStr + ' \u2013 ' + cStr : 'Closed \u00B7 Opens ' + oStr;
    });
    document.querySelectorAll('[data-dot]').forEach(function (d) {
      d.style.background = isOpen ? '#34C759' : '#FF3B30';
    });
  }
  updateStatus();
  setInterval(updateStatus, 30000);

  // ============================================
  // GSAP
  // ============================================
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: show everything
    document.querySelectorAll('.fade-up, .fade-in, .slide-up').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // --- Fade up elements ---
  document.querySelectorAll('.fade-up').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // --- Fade in elements ---
  document.querySelectorAll('.fade-in').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // --- Slide up (hero title etc.) ---
  document.querySelectorAll('.slide-up').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // --- Character reveal (scrub on scroll) ---
  // Wrap each WORD in a non-breaking span containing per-character spans.
  // This animates per character but keeps whole words from breaking across lines.
  document.querySelectorAll('[data-char-reveal]').forEach(function (el) {
    var text = el.textContent;
    el.innerHTML = '';
    var chars = [];
    var words = text.split(/(\s+)/); // keep whitespace tokens

    words.forEach(function (token) {
      if (/^\s+$/.test(token)) {
        // whitespace between words - render as a normal space, line can break here
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var wordWrap = document.createElement('span');
      wordWrap.className = 'word';
      for (var i = 0; i < token.length; i++) {
        var c = document.createElement('span');
        c.className = 'char';
        c.textContent = token[i];
        wordWrap.appendChild(c);
        chars.push(c);
      }
      el.appendChild(wordWrap);
    });

    gsap.to(chars, {
      color: '#0D47A1',
      stagger: 0.015,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 70%',
        end: 'bottom 35%',
        scrub: 0.5
      }
    });
  });

  // --- Hero parallax (content moves up and fades) ---
  var heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -100,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // --- Floating image parallax ---
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var speed = parseFloat(el.getAttribute('data-parallax'));
    gsap.to(el, {
      y: speed * 2,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // --- Menu items stagger ---
  document.querySelectorAll('.menu-items-grid').forEach(function (grid) {
    var items = grid.querySelectorAll('.menu-item');
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
      }
    );
  });

  // --- Menu preview cards stagger ---
  var previewCards = document.querySelectorAll('.menu-preview-card');
  if (previewCards.length) {
    gsap.fromTo(previewCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: previewCards[0].parentElement, start: 'top 80%', once: true }
      }
    );
  }

  // --- Review cards stagger ---
  var reviewCards = document.querySelectorAll('.review-card');
  if (reviewCards.length) {
    gsap.fromTo(reviewCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: reviewCards[0].parentElement, start: 'top 80%', once: true }
      }
    );
  }

  // --- Value cards ---
  var valueCards = document.querySelectorAll('.value-card');
  if (valueCards.length) {
    gsap.fromTo(valueCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: valueCards[0].parentElement, start: 'top 80%', once: true }
      }
    );
  }

  // --- About story paragraphs ---
  document.querySelectorAll('.about-story-content p, .about-story-content h3').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // --- Contact elements ---
  document.querySelectorAll('.contact-block, .contact-info-card-wrap').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  var mapEl = document.querySelector('.map-embed');
  if (mapEl) {
    gsap.fromTo(mapEl,
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: mapEl, start: 'top 85%', once: true }
      }
    );
  }

  // --- Showcase heading scale on scroll ---
  var showcaseH = document.querySelector('.showcase-heading');
  if (showcaseH) {
    gsap.fromTo(showcaseH,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.showcase-section',
          start: 'top 70%',
          end: 'center center',
          scrub: 1
        }
      }
    );
  }

  // --- Email signup form ---
  var signupForm = document.getElementById('signupForm');
  var signupSuccess = document.getElementById('signupSuccess');
  if (signupForm && signupSuccess) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = signupForm.querySelector('input[type="email"]').value.trim();
      if (!email) return;

      var btn = signupForm.querySelector('button');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch('https://newgreek.fusioncreative.uk/api/audit-lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Bakery Signup',
          email: email,
          goal: 'bakery_signup',
          source: 'newgreekbakery.co.uk'
        })
      })
      .then(function () {
        signupForm.style.display = 'none';
        signupSuccess.classList.add('visible');
      })
      .catch(function () {
        signupForm.style.display = 'none';
        signupSuccess.classList.add('visible');
      });
    });
  }

  // --- Split image parallax ---
  var splitImg = document.querySelector('.split-img-inner');
  if (splitImg) {
    gsap.fromTo(splitImg,
      { scale: 1.1 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.split-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

})();
