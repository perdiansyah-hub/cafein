/**
 * CAFEIN — Main JavaScript
 * Coffee for people who think deeply.
 * Version: 6.1 — Menu Showcase Adaptation with Click Hints
 */

(function() {
  'use strict';

  // =============================================================
  // DOM REFS
  // =============================================================
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const DOM = {
    preloader: $('#preloader'),
    preloaderFill: $('#preloaderFill'),
    preloaderCount: $('#preloaderCount'),
    html: document.documentElement,
    themeToggle: $('#themeToggle'),
    beanIconDark: $('#bean-icon-dark'),
    beanIconLight: $('#bean-icon-light'),
    navLogoDark: $('#nav-logo-dark'),
    navLogoLight: $('#nav-logo-light'),
    heroLogoDark: $('#hero-logo-dark'),
    heroLogoLight: $('#hero-logo-light'),
    preloaderLogoDark: $('#preloader-logo-dark'),
    preloaderLogoLight: $('#preloader-logo-light'),
    navbar: $('#navbar'),
    hamburger: $('#hamburger'),
    mobileMenu: $('#mobileMenu'),
    scrollProgress: $('#scroll-progress'),
    scrollTopBtn: $('#scroll-top'),
    heroParticles: $('#heroParticles'),
    heroVideo: $('#heroVideo'),
    vbsLogoDark: $('#vbs-logo-dark'),
    vbsLogoLight: $('#vbs-logo-light'),
    cursor: $('#cursor'),
    cursorRing: $('#cursor-ring'),
  };

  // =============================================================
  // UTILITIES
  // =============================================================
  const Utils = {
    isMobile: () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768,
    isFirefox: () => navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // =============================================================
  // PRELOADER
  // =============================================================
  const Preloader = {
    progress: 0,
    timer: null,
    completed: false,

    init() {
      if (!DOM.preloader) return;
      this.setLogo();

      window.addEventListener('load', () => {
        setTimeout(() => { this.completed = true; }, 300);
      });

      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          setTimeout(() => { this.completed = true; }, 300);
        }
      });

      setTimeout(() => { this.completed = true; }, 8000);

      this.timer = setInterval(() => this.update(), 40);
    },

    setLogo() {
      const dark = localStorage.getItem('theme') !== 'light';
      if (DOM.preloaderLogoDark) DOM.preloaderLogoDark.style.display = dark ? 'block' : 'none';
      if (DOM.preloaderLogoLight) DOM.preloaderLogoLight.style.display = dark ? 'none' : 'block';
    },

    update() {
      if (this.progress < 85) {
        this.progress += Math.random() * 4 + 2;
      } else if (this.progress < 95) {
        this.progress += Math.random() * 1.5 + 0.5;
      } else if (this.completed && this.progress < 100) {
        this.progress += (100 - this.progress) * 0.3;
      }

      this.progress = Math.min(100, this.progress);

      if (DOM.preloaderFill) DOM.preloaderFill.style.width = this.progress + '%';
      if (DOM.preloaderCount) DOM.preloaderCount.textContent = Math.floor(this.progress);

      if (this.progress >= 100 && this.completed) {
        clearInterval(this.timer);
        setTimeout(() => { if (DOM.preloader) DOM.preloader.classList.add('hidden'); }, 200);
      }

      if (this.completed && this.progress >= 95 && this.progress < 100) {
        this.progress = 100;
        if (DOM.preloaderFill) DOM.preloaderFill.style.width = '100%';
        if (DOM.preloaderCount) DOM.preloaderCount.textContent = '100';
        clearInterval(this.timer);
        setTimeout(() => { if (DOM.preloader) DOM.preloader.classList.add('hidden'); }, 200);
      }
    }
  };

  // =============================================================
  // THEME
  // =============================================================
  const Theme = {
    current: 'dark',

    init() {
      this.current = localStorage.getItem('theme') || 'dark';
      this.apply(this.current);
      DOM.themeToggle?.addEventListener('click', () => this.toggle());
    },

    toggle() {
      this.apply(this.current === 'dark' ? 'light' : 'dark');
    },

    apply(theme) {
      this.current = theme;
      DOM.html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const dark = theme === 'dark';
      const els = [
        DOM.beanIconDark, DOM.beanIconLight,
        DOM.navLogoDark, DOM.navLogoLight,
        DOM.heroLogoDark, DOM.heroLogoLight,
        DOM.preloaderLogoDark, DOM.preloaderLogoLight,
        DOM.vbsLogoDark, DOM.vbsLogoLight,
      ];
      els.forEach((el, i) => {
        if (el) el.style.display = (i % 2 === 0) === dark ? 'block' : 'none';
      });
    }
  };

  // =============================================================
  // CUSTOM CURSOR
  // =============================================================
  const Cursor = {
    x: 0, y: 0, rx: 0, ry: 0,

    init() {
      if (Utils.isMobile() || !DOM.cursor) return;
      document.addEventListener('mousemove', e => {
        this.x = e.clientX;
        this.y = e.clientY;
        DOM.cursor.style.left = this.x + 'px';
        DOM.cursor.style.top = this.y + 'px';
      });
      this.animate();
      this.addHovers();
    },

    animate() {
      this.rx += (this.x - this.rx) * 0.11;
      this.ry += (this.y - this.ry) * 0.11;
      if (DOM.cursorRing) {
        DOM.cursorRing.style.left = this.rx + 'px';
        DOM.cursorRing.style.top = this.ry + 'px';
      }
      requestAnimationFrame(() => this.animate());
    },

    addHovers() {
      const targets = 'a, button, .bean-toggle, .hamburger, .vbs-pill, .exp-tab, .menu-tab, .showcase-box, .people-card, .journal-card, .role-item';
      document.querySelectorAll(targets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  };

  // =============================================================
  // SCROLL
  // =============================================================
  const Scroll = {
    init() {
      window.addEventListener('scroll', () => this.handle(), { passive: true });
      DOM.scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },

    handle() {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      if (DOM.scrollProgress) DOM.scrollProgress.style.width = max > 0 ? (y / max * 100) + '%' : '0%';
      if (DOM.navbar) DOM.navbar.classList.toggle('scrolled', y > 40);
      if (DOM.scrollTopBtn) DOM.scrollTopBtn.classList.toggle('visible', y > 600);
    }
  };

  // =============================================================
  // HERO VIDEO
  // =============================================================
  const HeroVideo = {
    init() {
      if (!DOM.heroVideo) return;
      
      if (document.readyState === 'complete') {
        this.playVideo();
      } else {
        window.addEventListener('load', () => this.playVideo());
      }
    },
    
    playVideo() {
      setTimeout(() => {
        DOM.heroVideo.play().catch(() => {});
      }, 500);
    }
  };

  // =============================================================
  // PARTICLES
  // =============================================================
  const Particles = {
    init() {
      if (!DOM.heroParticles) return;
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
          left: ${10 + Math.random() * 80}%;
          height: ${80 + Math.random() * 120}px;
          --dur: ${7 + Math.random() * 7}s;
          --delay: ${Math.random() * 10}s;
          --drift: ${(Math.random() - 0.5) * 60}px;
          --drift2: ${(Math.random() - 0.5) * 40}px;
        `;
        DOM.heroParticles.appendChild(p);
      }
    }
  };

  // =============================================================
  // REVEAL
  // =============================================================
  const Reveal = {
    observer: null,

    init() {
      this.observer = new IntersectionObserver(
        entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
        { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
      );
      document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
      setTimeout(() => document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible')), 200);
    }
  };

  // =============================================================
  // MOBILE MENU
  // =============================================================
  const MobileMenu = {
    open: false,

    init() {
      if (!DOM.hamburger) return;
      DOM.hamburger.addEventListener('click', () => this.toggle());
      document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => this.close()));
      window.addEventListener('resize', () => window.innerWidth > 768 && this.open && this.close());
    },

    toggle() {
      this.open = !this.open;
      DOM.mobileMenu.classList.toggle('open', this.open);
      DOM.mobileMenu.style.display = this.open ? 'flex' : 'none';
      const s = DOM.hamburger.querySelectorAll('span');
      if (s.length >= 3) {
        s[0].style.transform = this.open ? 'rotate(45deg) translate(4px, 5px)' : '';
        s[1].style.opacity = this.open ? '0' : '';
        s[2].style.transform = this.open ? 'rotate(-45deg) translate(4px, -5px)' : '';
      }
      document.body.style.overflow = this.open ? 'hidden' : '';
    },

    close() {
      if (!this.open) return;
      this.open = false;
      DOM.mobileMenu.classList.remove('open');
      DOM.mobileMenu.style.display = 'none';
      const s = DOM.hamburger.querySelectorAll('span');
      s.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
      document.body.style.overflow = '';
    }
  };

  // =============================================================
  // DECODE LABELS
  // =============================================================
  const Decode = {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—',
    observer: null,

    init() {
      this.observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target;
            const txt = el.getAttribute('data-original') || el.textContent;
            el.setAttribute('data-original', txt);
            this.run(el, txt);
            this.observer.unobserve(el);
          }
        }),
        { threshold: 0.5 }
      );
      document.querySelectorAll('.section-label').forEach(el => this.observer.observe(el));
    },

    run(el, txt, dur = 900) {
      let start = null;
      const len = txt.length;
      const anim = t => {
        if (!start) start = t;
        const p = Math.min((t - start) / dur, 1);
        const reveal = Math.floor(p * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          if (txt[i] === ' ' || txt[i] === '\n') { out += txt[i]; continue; }
          out += i < reveal ? txt[i] : this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(anim);
        else el.textContent = txt;
      };
      requestAnimationFrame(anim);
    }
  };

  // =============================================================
  // VBS
  // =============================================================
  const VBS = {
    init() {
      const pills = document.querySelectorAll('.vbs-pill');
      const svg = document.getElementById('cafeinMark');
      pills.forEach(p => {
        p.addEventListener('click', () => {
          const target = p.dataset.target;
          pills.forEach(pp => pp.classList.remove('active'));
          p.classList.add('active');
          if (svg) {
            svg.setAttribute('data-focus', target);
            setTimeout(() => { if (svg.dataset.focus === target) svg.removeAttribute('data-focus'); }, 1800);
          }
        });
      });

      const hint = document.getElementById('vbsMarkHint');
      const wrap = document.querySelector('.vbs-svg-wrapper');
      if (hint && wrap) {
        wrap.addEventListener('mouseenter', () => hint.style.opacity = '0');
        wrap.addEventListener('mouseleave', () => hint.style.opacity = '0.5');
      }
    }
  };

  // =============================================================
  // EXPERIENCE
  // =============================================================
  const Experience = {
    init() {
      const tabs = document.querySelectorAll('.exp-tab');
      if (!tabs.length) return;
      tabs.forEach(t => {
        t.addEventListener('click', () => this.activate(t));
        if (!Utils.isMobile()) t.addEventListener('mouseenter', () => this.activate(t));
      });
    },

    activate(tab) {
      const target = tab.dataset.target;
      document.querySelectorAll('.exp-tab').forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      document.querySelectorAll('.exp-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    }
  };

  // =============================================================
  // MENU TABS
  // =============================================================
  const MenuTabs = {
    init() {
      const tabs = document.querySelectorAll('.menu-tab');
      if (!tabs.length) return;
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.menuTarget;
          tabs.forEach(t => t.classList.toggle('active', t === tab));
          document.querySelectorAll('.menu-panel').forEach(p => {
            p.classList.toggle('active', p.dataset.menuPanel === target);
          });
        });
      });
    }
  };

  // =============================================================
  // SHOWCASE MOBILE TAP — Untuk Semua Menu
  // =============================================================
  const ShowcaseMobileTap = {
    init() {
      if (!Utils.isMobile()) return;

      document.querySelectorAll('.showcase-container').forEach((container, containerIndex) => {
        const boxes = container.querySelectorAll('.showcase-box');
        const indicators = container.parentElement.querySelectorAll('.showcase-indicator');
        const hint = container.closest('.menu-panel').querySelector('.showcase-hint-mobile');

        if (!boxes.length) return;

        const hintKey = `cafein-hint-seen-${containerIndex}`;
        const hintSeen = localStorage.getItem(hintKey);
        if (hint && hintSeen) hint.style.opacity = '0.3';

        const syncIndicators = (activeIndex) => {
          indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
          });
        };

        const closeAll = () => {
          boxes.forEach(b => b.classList.remove('tapped'));
          syncIndicators(-1);
        };

        boxes.forEach((box, index) => {
          box.addEventListener('click', (e) => {
            const isAlreadyTapped = box.classList.contains('tapped');
            closeAll();
            if (!isAlreadyTapped) {
              box.classList.add('tapped');
              syncIndicators(index);
              if (!hintSeen && hint) {
                hint.textContent = '👆 tap again to close';
                setTimeout(() => {
                  if (hint) {
                    hint.textContent = '👆 tap card to explore';
                    localStorage.setItem(hintKey, '1');
                  }
                }, 2500);
              }
            }
            e.stopPropagation();
          });
        });

        indicators.forEach((dot, index) => {
          dot.addEventListener('click', (e) => {
            const targetBox = boxes[index];
            if (!targetBox) return;
            const isAlreadyTapped = targetBox.classList.contains('tapped');
            closeAll();
            if (!isAlreadyTapped) {
              targetBox.classList.add('tapped');
              syncIndicators(index);
            }
            e.stopPropagation();
          });
        });

        document.addEventListener('click', closeAll);
      });
    }
  };

  // =============================================================
  // FIREFOX FALLBACK
  // =============================================================
  const FirefoxFallback = {
    init() {
      if (!Utils.isFirefox()) return;
      const containers = document.querySelectorAll('.showcase-container');
      containers.forEach(container => {
        const boxes = container.querySelectorAll('.showcase-box');
        if (!boxes.length) return;
        boxes.forEach((box) => {
          box.addEventListener('mouseenter', () => {
            boxes.forEach(b => { b.style.filter = 'grayscale(60%) brightness(0.7) blur(2px)'; });
            box.style.filter = 'grayscale(0%) brightness(1) blur(0px)';
            box.style.transform = 'translateY(0) scale(1.02)';
            box.style.zIndex = '10';
          });
          box.addEventListener('mouseleave', () => {
            boxes.forEach(b => { b.style.filter = ''; b.style.transform = ''; b.style.zIndex = ''; });
          });
        });
        container.addEventListener('mouseleave', () => {
          boxes.forEach(b => { b.style.filter = ''; b.style.transform = ''; b.style.zIndex = ''; });
        });
      });
    }
  };

  // =============================================================
  // PEOPLE
  // =============================================================
  const People = {
    init() {
      const cards = document.querySelectorAll('.people-card');
      cards.forEach(c => {
        c.addEventListener('click', function() {
          const active = this.classList.contains('active');
          cards.forEach(cc => cc.classList.remove('active'));
          if (!active) this.classList.add('active');
        });
        if (!Utils.isMobile()) {
          c.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.zIndex = '2';
          });
          c.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
          });
        }
      });
    }
  };

  // =============================================================
  // JOURNAL
  // =============================================================
  const Journal = {
    init() {
      if (Utils.isMobile()) return;
      document.querySelectorAll('.journal-card').forEach(c => {
        c.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-6px)';
          this.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        });
        c.addEventListener('mouseleave', function() {
          this.style.transform = '';
          this.style.boxShadow = '';
        });
      });
    }
  };

  // =============================================================
  // INIT
  // =============================================================
  function init() {
    Preloader.init();
    Theme.init();
    Scroll.init();
    HeroVideo.init();
    Particles.init();
    Reveal.init();
    MobileMenu.init();
    Decode.init();
    Cursor.init();
    VBS.init();
    Experience.init();
    MenuTabs.init();
    ShowcaseMobileTap.init();
    FirefoxFallback.init();
    People.init();
    Journal.init();
    console.log('☕ CAFEIN — Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.closeMobile = () => MobileMenu.close();

})();