/**
 * CAFEIN - Main JavaScript File
 * Coffee for people who think deeply.
 * Version: 2.0
 */

(function() {
    'use strict';

    // ======================================================
    // 1. PRELOADER
    // ======================================================
    const preloader = {
        fill: document.getElementById('preloaderFill'),
        count: document.getElementById('preloaderCount'),
        element: document.getElementById('preloader'),
        
        init() {
            if (!this.fill || !this.count || !this.element) return;
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 8 + 2;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => this.element.classList.add('hidden'), 400);
                }
                this.fill.style.width = progress + '%';
                this.count.textContent = Math.floor(progress);
            }, 60);
        }
    };

    // ======================================================
    // 2. THEME (DARK / LIGHT MODE)
    // ======================================================
    const theme = {
        html: document.documentElement,
        darkIcon: document.getElementById('bean-icon-dark'),
        lightIcon: document.getElementById('bean-icon-light'),
        toggleBtn: document.getElementById('themeToggle'),
        
        init() {
            const savedTheme = localStorage.getItem('cafein-theme');
            if (savedTheme) this.html.setAttribute('data-theme', savedTheme);
            this.syncIcons();
            if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggle());
        },
        
        syncIcons() {
            const isDark = this.html.getAttribute('data-theme') === 'dark';
            if (this.darkIcon) this.darkIcon.style.display = isDark ? 'block' : 'none';
            if (this.lightIcon) this.lightIcon.style.display = isDark ? 'none' : 'block';
        },
        
        toggle() {
            const current = this.html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.html.setAttribute('data-theme', next);
            localStorage.setItem('cafein-theme', next);
            this.syncIcons();
        }
    };

    // ======================================================
    // 3. CUSTOM CURSOR (Desktop Only)
    // ======================================================
    const customCursor = {
        cursor: document.getElementById('cursor'),
        ring: document.getElementById('cursor-ring'),
        isMobile: window.matchMedia('(pointer:coarse)').matches,
        
        init() {
            if (this.isMobile || !this.cursor || !this.ring) return;
            
            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                this.cursor.style.left = mouseX + 'px';
                this.cursor.style.top = mouseY + 'px';
            });
            
            const animateRing = () => {
                ringX += (mouseX - ringX) * 0.11;
                ringY += (mouseY - ringY) * 0.11;
                this.ring.style.left = ringX + 'px';
                this.ring.style.top = ringY + 'px';
                requestAnimationFrame(animateRing);
            };
            animateRing();
            
            this.addHoverEffects();
        },
        
        addHoverEffects() {
            const hoverElements = document.querySelectorAll(
                'a, button, .bean-toggle, .hamburger, .menu-item, .market-card, ' +
                '.persona-card, .channel-card, .swatch, .fin-row-clickable, ' +
                '.chart-bar, .revenue-item, .timeline-item, .collab-item, .team-card-premium'
            );
            
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        }
    };

    // ======================================================
    // 4. SCROLL PROGRESS & NAVIGATION
    // ======================================================
    const scrollHandler = {
        nav: document.getElementById('navbar'),
        progressBar: document.getElementById('scroll-progress'),
        scrollTopBtn: document.getElementById('scroll-top'),
        
        init() {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        },
        
        handleScroll() {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            
            // Update progress bar
            if (this.progressBar && maxScroll > 0) {
                this.progressBar.style.width = (scrollY / maxScroll * 100) + '%';
            }
            
            // Update nav background
            if (this.nav) this.nav.classList.toggle('scrolled', scrollY > 40);
            
            // Show/hide scroll to top button
            if (this.scrollTopBtn) this.scrollTopBtn.classList.toggle('visible', scrollY > 600);
        }
    };

    // ======================================================
    // 5. STEAM PARTICLES (Hero Section)
    // ======================================================
    const steamParticles = {
        container: document.getElementById('heroParticles'),
        
        init() {
            if (!this.container) return;
            
            const particleCount = 14;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const left = 10 + Math.random() * 80;
                const height = 80 + Math.random() * 120;
                const duration = 7 + Math.random() * 7;
                const delay = Math.random() * 10;
                const drift = (Math.random() - 0.5) * 60;
                const drift2 = drift + (Math.random() - 0.5) * 40;
                
                particle.style.cssText = `
                    left: ${left}%;
                    height: ${height}px;
                    --dur: ${duration}s;
                    --delay: ${delay}s;
                    --drift: ${drift}px;
                    --drift2: ${drift2}px;
                `;
                this.container.appendChild(particle);
            }
        }
    };

    // ======================================================
    // 6. REVEAL ANIMATIONS (Intersection Observer)
    // ======================================================
    const revealAnimations = {
        init() {
            // Main reveal observer
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Animate bar-fill elements inside
                        entry.target.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animate'));
                    }
                });
            }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
            
            document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObserver.observe(el));
            
            // Bar row observer
            const barObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animate'));
                    }
                });
            }, { threshold: 0.2 });
            
            document.querySelectorAll('.bar-row').forEach(el => barObserver.observe(el));
            
            // Chart observer
            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.chart-bar').forEach((bar, index) => {
                            const height = parseInt(bar.getAttribute('data-h'));
                            setTimeout(() => { bar.style.height = height + 'px'; }, index * 100);
                        });
                    }
                });
            }, { threshold: 0.2 });
            
            const chartContainer = document.getElementById('growthChart');
            if (chartContainer) chartObserver.observe(chartContainer);
            
            // Hero initial reveal
            setTimeout(() => {
                document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
            }, 200);
        }
    };

    // ======================================================
    // 7. MOBILE MENU
    // ======================================================
    const mobileMenu = {
        hamburger: document.getElementById('hamburger'),
        menu: document.getElementById('mobileMenu'),
        isOpen: false,
        
        init() {
            if (!this.hamburger || !this.menu) return;
            this.hamburger.addEventListener('click', () => this.toggle());
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            this.menu.classList.toggle('open', this.isOpen);
            
            const spans = this.hamburger.querySelectorAll('span');
            if (this.isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        },
        
        close() {
            this.isOpen = false;
            this.menu.classList.remove('open');
            const spans = this.hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    };

    // ======================================================
    // 8. FINANCIAL DROPDOWN
    // ======================================================
    const financialDropdown = {
        init() {
            // Expose to global scope for inline onclick
            window.toggleFinDD = (id, trigger) => this.toggle(id, trigger);
        },
        
        toggle(id, trigger) {
            const dropdown = document.getElementById(id);
            if (!dropdown) return;
            
            const isOpen = dropdown.classList.contains('open');
            
            // Close all dropdowns
            document.querySelectorAll('.fin-dropdown').forEach(d => d.classList.remove('open'));
            document.querySelectorAll('.fin-row-clickable').forEach(r => r.classList.remove('open'));
            
            if (!isOpen) {
                dropdown.classList.add('open');
                trigger.classList.add('open');
                
                if (window.innerWidth < 768) {
                    setTimeout(() => trigger.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
                }
            }
        }
    };

    // ======================================================
    // 9. PARALLAX EFFECT
    // ======================================================
    const parallax = {
        heroGrid: document.querySelector('.hero-grid'),
        heroBg: document.querySelector('.hero-bg'),
        ticking: false,
        
        init() {
            if (!this.heroGrid && !this.heroBg) return;
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        },
        
        handleScroll() {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (this.heroGrid) this.heroGrid.style.transform = `translateY(${scrollY * 0.13}px)`;
                    if (this.heroBg) this.heroBg.style.transform = `translateY(${scrollY * 0.07}px)`;
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }
    };

    // ======================================================
    // 10. DECODE TEXT EFFECT (Section Labels)
    // ======================================================
    const decodeEffect = {
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—',
        
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const originalText = el.getAttribute('data-original') || el.textContent;
                        el.setAttribute('data-original', originalText);
                        this.decode(el, originalText);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            document.querySelectorAll('.section-label').forEach(el => observer.observe(el));
        },
        
        decode(element, originalText, duration = 900) {
            let startTime = null;
            const length = originalText.length;
            
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const revealedCount = Math.floor(progress * length);
                
                let result = '';
                for (let i = 0; i < length; i++) {
                    const char = originalText[i];
                    if (char === ' ' || char === '\n') {
                        result += char;
                        continue;
                    }
                    result += i < revealedCount 
                        ? char 
                        : this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                
                element.textContent = result;
                if (progress < 1) requestAnimationFrame(animate);
                else element.textContent = originalText;
            };
            
            requestAnimationFrame(animate);
        }
    };

    // ======================================================
    // 11. TEAM CARD EFFECTS (Premium Gradient Animation)
    // ======================================================
    const teamCards = {
        init() {
            const cards = document.querySelectorAll('.team-card-premium');
            if (!cards.length) return;
            
            // Set random gradient angles
            const angles = [-119, -125, -113, -131, -107];
            cards.forEach((card, index) => {
                const gradientBg = card.querySelector('.card-gradient-bg');
                if (gradientBg) {
                    const angle = angles[index % angles.length];
                    gradientBg.style.background = `linear-gradient(
                        ${angle}deg,
                        rgba(90, 78, 60, 0) 0%,
                        rgba(201, 184, 154, 0.03) 100%
                    )`;
                }
            });
            
            // Add mouse move effect for dynamic gradient
            cards.forEach(card => {
                const gradientBg = card.querySelector('.card-gradient-bg');
                if (!gradientBg) return;
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    
                    gradientBg.style.background = `radial-gradient(
                        circle at ${x}% ${y}%, 
                        rgba(201, 184, 154, 0.08) 0%, 
                        rgba(90, 78, 60, 0.02) 60%,
                        transparent 100%
                    )`;
                });
                
                card.addEventListener('mouseleave', () => {
                    const angle = angles[[...cards].indexOf(card) % angles.length];
                    gradientBg.style.background = `linear-gradient(
                        ${angle}deg,
                        rgba(90, 78, 60, 0) 0%,
                        rgba(201, 184, 154, 0.03) 100%
                    )`;
                });
            });
        }
    };

    // ======================================================
    // 12. SHOWCASE MOBILE TAP (Info panel muncul saat diklik)
    // ======================================================
    const showcaseMobileTap = {
        init() {
            // Only active on touch devices
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            if (!isTouch) return;

            const boxes        = document.querySelectorAll('.showcase-box');
            const indicators   = document.querySelectorAll('.showcase-indicator');
            const hint         = document.getElementById('showcaseHint');
            const indicatorWrap = document.getElementById('showcaseIndicators');

            if (!boxes.length) return;

            // ── Hint text state ──
            // Use localStorage to permanently hide hint after user has interacted twice
            const HINT_KEY = 'cafein-team-hint-seen';
            const hintSeen = localStorage.getItem(HINT_KEY);
            let interactionCount = 0;

            if (hint) {
                if (hintSeen) {
                    // User has seen the tutorial — hide hint permanently
                    hint.classList.add('hidden');
                } else {
                    hint.textContent = 'tap to explore';
                }
            }

            // ── Helper: sync indicator dots ──
            const syncIndicators = (activeIndex) => {
                indicators.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });
            };

            // ── Helper: close all cards ──
            const closeAll = () => {
                boxes.forEach(b => b.classList.remove('tapped'));
                syncIndicators(-1);
            };

            // ── Tap logic ──
            boxes.forEach((box, index) => {
                box.addEventListener('click', (e) => {
                    const isAlreadyTapped = box.classList.contains('tapped');

                    // Close all first
                    closeAll();

                    if (!isAlreadyTapped) {
                        // Open this card
                        box.classList.add('tapped');
                        syncIndicators(index);

                        // ── Hint text progression ──
                        if (!hintSeen && hint) {
                            interactionCount++;

                            if (interactionCount === 1) {
                                // First tap: change to "tap to close" hint
                                hint.textContent = 'tap again to close';
                            } else if (interactionCount >= 2) {
                                // Second interaction: user understands — fade and remember
                                hint.classList.add('fade-out');
                                setTimeout(() => hint.classList.add('hidden'), 500);
                                localStorage.setItem(HINT_KEY, '1');
                            }
                        }
                    } else {
                        // Card was already open — closing it
                        // On close, revert hint text if not yet permanently hidden
                        if (!hintSeen && hint && !hint.classList.contains('hidden')) {
                            hint.textContent = 'tap to explore';
                        }
                    }

                    e.stopPropagation();
                });
            });

            // ── Indicator tap — acts as shortcut to open a card ──
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

            // ── Tap outside showcase: close all ──
            document.addEventListener('click', () => {
                closeAll();
                // Restore hint if not permanently hidden
                if (!hintSeen && hint && !hint.classList.contains('hidden')) {
                    hint.textContent = 'tap to explore';
                }
            });
        }
    };

    // ======================================================
    // 12. INITIALIZE ALL MODULES
    // ======================================================
    function init() {
        preloader.init();
        theme.init();
        customCursor.init();
        scrollHandler.init();
        steamParticles.init();
        revealAnimations.init();
        mobileMenu.init();
        financialDropdown.init();
        parallax.init();
        decodeEffect.init();
        teamCards.init();
        showcaseMobileTap.init();
        
        console.log('CAFEIN — Initialized');
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose closeMobile for inline onclick
    window.closeMobile = () => mobileMenu.close();
    
})();