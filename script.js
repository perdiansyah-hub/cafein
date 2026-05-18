/**
 * CAFEIN — Main JavaScript File
 * Coffee for people who think deeply.
 * Version: 6.0 (Visual Brand System Perbaikan Posisi)
 */

(function() {
    'use strict';

    // ======================================================
    // 1. DOM ELEMENT CACHE (Tambahan untuk VBS)
    // ======================================================
    const DOM = {
        preloader: document.getElementById('preloader'),
        preloaderFill: document.getElementById('preloaderFill'),
        preloaderCount: document.getElementById('preloaderCount'),
        html: document.documentElement,
        themeToggle: document.getElementById('themeToggle'),
        beanIconDark: document.getElementById('bean-icon-dark'),
        beanIconLight: document.getElementById('bean-icon-light'),
        navLogoDark: document.getElementById('nav-logo-dark'),
        navLogoLight: document.getElementById('nav-logo-light'),
        heroLogoDark: document.getElementById('hero-logo-dark'),
        heroLogoLight: document.getElementById('hero-logo-light'),
        preloaderLogoDark: document.getElementById('preloader-logo-dark'),
        preloaderLogoLight: document.getElementById('preloader-logo-light'),
        navbar: document.getElementById('navbar'),
        hamburger: document.getElementById('hamburger'),
        mobileMenu: document.getElementById('mobileMenu'),
        scrollProgress: document.getElementById('scroll-progress'),
        scrollTopBtn: document.getElementById('scroll-top'),
        heroParticles: document.getElementById('heroParticles'),
        // VBS Static Logos
        vbsLogoDark: document.getElementById('vbs-logo-dark'),
        vbsLogoLight: document.getElementById('vbs-logo-light')
    };

    // ======================================================
    // 2. UTILITY FUNCTIONS
    // ======================================================
    const Utils = {
        formatCurrency(value) {
            if (value >= 1_000_000_000) return 'Rp ' + (value / 1_000_000_000).toFixed(1) + ' M';
            if (value >= 1_000_000) return 'Rp ' + Math.round(value / 1_000_000) + ' jt';
            return 'Rp ' + value.toLocaleString('id-ID');
        },
        isMobile() {
            return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
        },
        isFirefox() {
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        },
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => { clearTimeout(timeout); func(...args); };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // ======================================================
    // 3. PRELOADER
    // ======================================================
    const Preloader = {
        isLoaded: false,
        progress: 0,
        interval: null,
        
        init() {
            if (!DOM.preloader || !DOM.preloaderFill || !DOM.preloaderCount) return;
            this.setLogo();
            window.addEventListener('load', () => { this.isLoaded = true; });
            this.interval = setInterval(() => this.update(), 45);
        },
        
        setLogo() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            if (!DOM.preloaderLogoDark || !DOM.preloaderLogoLight) return;
            if (savedTheme === 'dark') {
                DOM.preloaderLogoDark.style.display = 'block';
                DOM.preloaderLogoLight.style.display = 'none';
            } else {
                DOM.preloaderLogoDark.style.display = 'none';
                DOM.preloaderLogoLight.style.display = 'block';
            }
        },
        
        update() {
            if (this.progress >= 92 && !this.isLoaded) {
                this.progress += (96 - this.progress) * 0.08;
            } else {
                this.progress += Math.random() * 5 + 3;
            }
            if (this.progress >= 100 && this.isLoaded) {
                this.progress = 100;
                clearInterval(this.interval);
                setTimeout(() => {
                    if (DOM.preloader) DOM.preloader.classList.add('hidden');
                }, 350);
            }
            if (DOM.preloaderFill) DOM.preloaderFill.style.width = Math.min(100, this.progress) + '%';
            if (DOM.preloaderCount) DOM.preloaderCount.textContent = Math.floor(Math.min(100, this.progress));
        }
    };

    // ======================================================
    // 4. THEME MANAGER (dengan update VBS static logo)
    // ======================================================
    const ThemeManager = {
        currentTheme: 'dark',
        
        init() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            this.setTheme(savedTheme);
            if (DOM.themeToggle) DOM.themeToggle.addEventListener('click', () => this.toggle());
        },
        
        toggle() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },
        
        setTheme(themeName) {
            this.currentTheme = themeName;
            DOM.html.setAttribute('data-theme', themeName);
            localStorage.setItem('theme', themeName);
            const isDark = themeName === 'dark';
            this.toggleElement(DOM.beanIconDark, isDark);
            this.toggleElement(DOM.beanIconLight, !isDark);
            this.toggleElement(DOM.navLogoDark, isDark);
            this.toggleElement(DOM.navLogoLight, !isDark);
            this.toggleElement(DOM.heroLogoDark, isDark);
            this.toggleElement(DOM.heroLogoLight, !isDark);
            this.toggleElement(DOM.preloaderLogoDark, isDark);
            this.toggleElement(DOM.preloaderLogoLight, !isDark);
            // VBS static logos
            this.toggleElement(DOM.vbsLogoDark, isDark);
            this.toggleElement(DOM.vbsLogoLight, !isDark);
        },
        
        toggleElement(element, show) {
            if (element) element.style.display = show ? 'block' : 'none';
        }
    };

    // ======================================================
    // 5. CUSTOM CURSOR (sama seperti sebelumnya)
    // ======================================================
    const CustomCursor = {
        cursor: document.getElementById('cursor'),
        ring: document.getElementById('cursor-ring'),
        mouseX: 0, mouseY: 0, ringX: 0, ringY: 0, animationId: null,
        
        init() {
            if (Utils.isMobile() || !this.cursor || !this.ring) return;
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.cursor.style.left = this.mouseX + 'px';
                this.cursor.style.top = this.mouseY + 'px';
            });
            this.animateRing();
            this.addHoverEffects();
        },
        
        animateRing() {
            this.ringX += (this.mouseX - this.ringX) * 0.11;
            this.ringY += (this.mouseY - this.ringY) * 0.11;
            this.ring.style.left = this.ringX + 'px';
            this.ring.style.top = this.ringY + 'px';
            this.animationId = requestAnimationFrame(() => this.animateRing());
        },
        
        addHoverEffects() {
            const hoverElements = document.querySelectorAll('a, button, .bean-toggle, .hamburger, .menu-item, .market-card, .persona-card, .channel-card, .vbs-swatch, .revenue-item, .timeline-item, .collab-item, .fin-scenario-btn, .vbs-pill');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        },
        
        destroy() {
            if (this.animationId) cancelAnimationFrame(this.animationId);
        }
    };

    // ======================================================
    // 6. SCROLL HANDLER (sama seperti sebelumnya)
    // ======================================================
    const ScrollHandler = {
        init() {
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            if (DOM.scrollTopBtn) DOM.scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        },
        
        handleScroll() {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            if (DOM.scrollProgress && maxScroll > 0) DOM.scrollProgress.style.width = (scrollY / maxScroll * 100) + '%';
            if (DOM.navbar) DOM.navbar.classList.toggle('scrolled', scrollY > 40);
            if (DOM.scrollTopBtn) DOM.scrollTopBtn.classList.toggle('visible', scrollY > 600);
        }
    };

    // ======================================================
    // 7. STEAM PARTICLES (sama)
    // ======================================================
    const SteamParticles = {
        init() {
            if (!DOM.heroParticles) return;
            for (let i = 0; i < 14; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const left = 10 + Math.random() * 80;
                const height = 80 + Math.random() * 120;
                const duration = 7 + Math.random() * 7;
                const delay = Math.random() * 10;
                const drift = (Math.random() - 0.5) * 60;
                const drift2 = drift + (Math.random() - 0.5) * 40;
                particle.style.cssText = `left: ${left}%; height: ${height}px; --dur: ${duration}s; --delay: ${delay}s; --drift: ${drift}px; --drift2: ${drift2}px;`;
                DOM.heroParticles.appendChild(particle);
            }
        }
    };

    // ======================================================
    // 8. REVEAL ANIMATIONS (sama)
    // ======================================================
    const RevealAnimations = {
        observer: null,
        
        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        const barFills = entry.target.querySelectorAll('.bar-fill');
                        barFills.forEach(bar => bar.classList.add('animate'));
                    }
                });
            }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
            
            document.querySelectorAll('.reveal, .reveal-left').forEach(el => this.observer.observe(el));
            setTimeout(() => {
                document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
            }, 200);
        }
    };

    // ======================================================
    // 9. MOBILE MENU (sama)
    // ======================================================
    const MobileMenu = {
        isOpen: false,
        
        init() {
            if (!DOM.hamburger || !DOM.mobileMenu) return;
            DOM.hamburger.addEventListener('click', () => this.toggle());
            document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => this.close()));
        },
        
        toggle() {
            this.isOpen = !this.isOpen;
            DOM.mobileMenu.classList.toggle('open', this.isOpen);
            const spans = DOM.hamburger.querySelectorAll('span');
            if (spans.length >= 3) {
                if (this.isOpen) {
                    spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
                } else {
                    spans[0].style.transform = '';
                    spans[1].style.opacity = '';
                    spans[2].style.transform = '';
                }
            }
        },
        
        close() {
            this.isOpen = false;
            DOM.mobileMenu.classList.remove('open');
            const spans = DOM.hamburger.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        }
    };

    // ======================================================
    // 10. DECODE TEXT EFFECT (sama)
    // ======================================================
    const DecodeEffect = {
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—',
        observer: null,
        
        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const originalText = el.getAttribute('data-original') || el.textContent;
                        el.setAttribute('data-original', originalText);
                        this.decodeText(el, originalText);
                        this.observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            document.querySelectorAll('.section-label').forEach(el => this.observer.observe(el));
        },
        
        decodeText(element, originalText, duration = 900) {
            let startTime = null;
            const length = originalText.length;
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const revealedCount = Math.floor(progress * length);
                let result = '';
                for (let i = 0; i < length; i++) {
                    const char = originalText[i];
                    if (char === ' ' || char === '\n') { result += char; continue; }
                    if (i < revealedCount) result += char;
                    else result += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                element.textContent = result;
                if (progress < 1) requestAnimationFrame(animate);
                else element.textContent = originalText;
            };
            requestAnimationFrame(animate);
        }
    };

    // ======================================================
    // 11. VBS INTERACTIONS (SVG + Pills + Swatch Info)
    // ======================================================
    const VBSInteractions = {
        init() {
            // SVG Mark interactive pills
            const pills = document.querySelectorAll('.vbs-pill');
            const svgMark = document.getElementById('cafeinMark');
            if (svgMark && pills.length) {
                pills.forEach(pill => {
                    pill.addEventListener('click', () => {
                        const target = pill.getAttribute('data-target');
                        pills.forEach(p => p.classList.remove('active'));
                        pill.classList.add('active');
                        if (svgMark) {
                            svgMark.setAttribute('data-focus', target);
                            // Reset focus after 2 seconds for natural behavior
                            setTimeout(() => {
                                if (svgMark.getAttribute('data-focus') === target) {
                                    svgMark.removeAttribute('data-focus');
                                }
                            }, 1800);
                        }
                    });
                });
            }

            // Color swatch hover info
            const swatches = document.querySelectorAll('.vbs-swatch');
            const infoName = document.querySelector('.vbs-swatch-info-name');
            const infoHex = document.querySelector('.vbs-swatch-info-hex');
            if (swatches.length && infoName && infoHex) {
                swatches.forEach(swatch => {
                    swatch.addEventListener('mouseenter', () => {
                        const name = swatch.getAttribute('data-name') || '—';
                        const hex = swatch.getAttribute('data-hex') || '';
                        infoName.textContent = name;
                        infoHex.textContent = hex;
                    });
                    swatch.addEventListener('mouseleave', () => {
                        infoName.textContent = '—';
                        infoHex.textContent = 'Hover to explore';
                    });
                });
            }

            // Hover hint for SVG mark
            const hint = document.getElementById('vbsMarkHint');
            if (hint) {
                const svgWrapper = document.querySelector('.vbs-svg-wrapper');
                if (svgWrapper) {
                    svgWrapper.addEventListener('mouseenter', () => {
                        hint.style.opacity = '0';
                    });
                    svgWrapper.addEventListener('mouseleave', () => {
                        hint.style.opacity = '0.5';
                    });
                }
            }
        }
    };

    // ======================================================
    // 12. SHOWCASE MOBILE TAP (sama)
    // ======================================================
    const ShowcaseMobileTap = {
        init() {
            if (!Utils.isMobile()) return;
            const boxes = document.querySelectorAll('.showcase-box');
            const indicators = document.querySelectorAll('.showcase-indicator');
            const hint = document.getElementById('showcaseHint');
            const hintSeen = localStorage.getItem('cafein-team-hint-seen');
            if (hint && hintSeen) hint.classList.add('hidden');
            else if (hint) hint.textContent = 'tap to explore';
            
            const syncIndicators = (activeIndex) => indicators.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
            const closeAll = () => { boxes.forEach(b => b.classList.remove('tapped')); syncIndicators(-1); };
            
            boxes.forEach((box, index) => {
                box.addEventListener('click', (e) => {
                    const isAlreadyTapped = box.classList.contains('tapped');
                    closeAll();
                    if (!isAlreadyTapped) {
                        box.classList.add('tapped');
                        syncIndicators(index);
                        if (!hintSeen && hint) {
                            hint.textContent = 'tap again to close';
                            setTimeout(() => {
                                if (hint && !hint.classList.contains('hidden')) {
                                    hint.classList.add('fade-out');
                                    setTimeout(() => hint.classList.add('hidden'), 500);
                                    localStorage.setItem('cafein-team-hint-seen', '1');
                                }
                            }, 2000);
                        }
                    }
                    e.stopPropagation();
                });
            });
            indicators.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    const targetBox = boxes[index];
                    const isAlreadyTapped = targetBox.classList.contains('tapped');
                    closeAll();
                    if (!isAlreadyTapped) { targetBox.classList.add('tapped'); syncIndicators(index); }
                    e.stopPropagation();
                });
            });
            document.addEventListener('click', closeAll);
        }
    };

    // ======================================================
    // 13. FINANCIAL SIMULATOR (diringkas, tetap sama)
    // ======================================================
    const FinancialSimulator = {
        revenueChart: null,
        currentScenario: 'moderate',
        currentRangeIndex: 2,
        
        RANGES: [
            { amount: 37500000, badge: 'RANGE 01', roi: '22.4%', payback: '14-16 mo', breakeven: 'Month 10', multiplier: 0.14, equity: 4.0, perc: { space: 20, equip: 50, reno: 10, brand: 20 }, desc: { space: 'Sewa pop-up booth / kiosk (Rp 4-8 JT/bln) + deposit 1 bulan', equip: 'Flair Neo Flex manual + Comandante C40 hand grinder', reno: 'Setup modular + lighting portable + signage', brand: 'Pre-launch sosial media 60 hari + green bean sampling' } },
            { amount: 75000000, badge: 'RANGE 02', roi: '25.8%', payback: '12-14 mo', breakeven: 'Month 9', multiplier: 0.16, equity: 5.5, perc: { space: 15, equip: 45, reno: 20, brand: 20 }, desc: { space: 'Shared space / corner food hall premium (Rp 10-15 JT/bln)', equip: 'Breville Barista Express baru + grinder elektrik + roaster 1kg', reno: 'Linear wood bar + gallery lighting + signage custom', brand: 'Pre-launch campaign + micro-lot beans + operational cash' } },
            { amount: 175000000, badge: 'RANGE 03', roi: '29.2%', payback: '11-13 mo', breakeven: 'Month 8', multiplier: 0.19, equity: 7.0, perc: { space: 25, equip: 35, reno: 25, brand: 15 }, desc: { space: 'Ruko mandiri 30-50m² (Sewa Rp 15-25 JT/bln + deposit)', equip: 'Gemilai CRM3145 dual boiler + Mahlkönig X54 + roaster 3kg', reno: 'Cafe minimalis 30m² + desain interior premium', brand: 'Pre-launch campaign + inventory + legalitas' } },
            { amount: 375000000, badge: 'RANGE 04', roi: '32.5%', payback: '10-12 mo', breakeven: 'Month 7', multiplier: 0.22, equity: 8.5, perc: { space: 20, equip: 40, reno: 25, brand: 15 }, desc: { space: 'Dual-floor commercial 70-100m² (Sewa Rp 25-40 JT/bln)', equip: 'La Marzocco Linea Mini + Mahlkönig E65S + Diedrich IR-2.5', reno: 'Cafe industrial 70m² + acoustic glass partition', brand: 'Roastery launch campaign + wholesale program + merch' } },
            { amount: 750000000, badge: 'RANGE 05', roi: '36.8%', payback: '8-10 mo', breakeven: 'Month 6', multiplier: 0.26, equity: 10.0, perc: { space: 20, equip: 35, reno: 35, brand: 10 }, desc: { space: 'Standalone property heritage/distrik kreatif', equip: 'Nuova Simonelli Aurelia 2-Group + dual grinders + Probat', reno: 'Cafe besar >100m² + brutalist facade + art installation', brand: 'Global brand launch + international wholesale + CAFEIN Press' } },
            { amount: 1250000000, badge: 'RANGE 06', roi: '42.0%', payback: '6-8 mo', breakeven: 'Month 5', multiplier: 0.32, equity: 12.5, perc: { space: 20, equip: 30, reno: 40, brand: 10 }, desc: { space: 'Akuisisi bangunan ikonik + lahan premium', equip: 'Kees van der Westen Spirit + Mahlkönig EK43S + Probat P05', reno: 'Architectural masterpiece + signature design', brand: 'Global ecosystem + international expansion' } }
        ],
        
        SCENARIO_MULT: { conservative: 0.85, moderate: 1.0, aggressive: 1.18 },
        
        formatMoney(value) {
            if (value >= 1000000000) return 'Rp ' + (value / 1000000000).toFixed(1) + ' M';
            if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(0) + ' JT';
            return 'Rp ' + value.toLocaleString('id-ID');
        },
        
        initChart() {
            const canvas = document.getElementById('revenueChart');
            if (!canvas) return false;
            const ctx = canvas.getContext('2d');
            if (!ctx) return false;
            if (this.revenueChart) { this.revenueChart.destroy(); this.revenueChart = null; }
            
            try {
                this.revenueChart = new Chart(ctx, {
                    type: 'bar',
                    data: { labels: ['Month 1', 'Month 3', 'Month 6', 'Month 12'], datasets: [{ data: [0, 0, 0, 0], backgroundColor: (context) => { const chart = context.chart; const { ctx, chartArea } = chart; if (!chartArea) return '#c9b89a'; const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); gradient.addColorStop(0, 'rgba(201, 184, 154, 0.1)'); gradient.addColorStop(0.5, 'rgba(201, 184, 154, 0.5)'); gradient.addColorStop(1, '#d4a97a'); return gradient; }, borderRadius: 6, barPercentage: 0.65, categoryPercentage: 0.8, hoverBackgroundColor: '#d4a97a' }] },
                    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.85)', titleColor: '#c9b89a', bodyColor: '#e8e6e0', borderColor: '#c9b89a', borderWidth: 1, callbacks: { label: (context) => 'Revenue: ' + this.formatMoney(context.raw) } } }, scales: { y: { min: 0, max: 1000000000, grid: { color: 'rgba(200, 190, 170, 0.08)', drawBorder: false }, ticks: { callback: (value) => { if (value === 0) return '0'; if (value === 50000000) return '50JT'; if (value === 100000000) return '100JT'; if (value === 200000000) return '200JT'; if (value === 500000000) return '500JT'; if (value === 1000000000) return '1M'; return ''; }, color: 'var(--text-secondary)', font: { size: 10, weight: '300' } } }, x: { grid: { display: false }, ticks: { color: 'var(--text-secondary)', font: { size: 11, weight: '300' } } } }, layout: { padding: { top: 10, bottom: 5, left: 5, right: 5 } }, elements: { bar: { borderWidth: 0 } }, animation: { duration: 400, easing: 'easeOutQuart' } }
                });
                return true;
            } catch (error) { console.error('Chart error:', error); return false; }
        },
        
        updateChartData(amount, multiplier) {
            if (!this.revenueChart) this.initChart();
            if (!this.revenueChart) return;
            const scenarioMult = this.SCENARIO_MULT[this.currentScenario];
            const baseRevenue = amount * multiplier * scenarioMult;
            const revenues = [Math.round(baseRevenue * 0.65), Math.round(baseRevenue * 0.88), Math.round(baseRevenue * 1.10), Math.round(baseRevenue * 1.45)];
            this.revenueChart.data.datasets[0].data = revenues;
            this.revenueChart.update({ duration: 400, easing: 'easeOutQuart' });
            const insightValue = document.getElementById('insightValue');
            const insightSub = document.getElementById('insightSub');
            if (insightValue) insightValue.textContent = this.formatMoney(revenues[3]);
            if (insightSub) insightSub.textContent = '(' + this.currentScenario + ')';
        },
        
        updateAll(index) {
            if (index < 0 || index >= this.RANGES.length) return;
            const config = this.RANGES[index];
            const amount = config.amount;
            
            const rangeBadge = document.getElementById('rangeBadge');
            const liveCapital = document.getElementById('liveCapital');
            const metricRoi = document.getElementById('metricRoi');
            const metricPayback = document.getElementById('metricPayback');
            const metricBreakeven = document.getElementById('metricBreakeven');
            if (rangeBadge) rangeBadge.textContent = config.badge;
            if (liveCapital) liveCapital.textContent = this.formatMoney(amount);
            if (metricRoi) metricRoi.textContent = config.roi;
            if (metricPayback) metricPayback.textContent = config.payback;
            if (metricBreakeven) metricBreakeven.textContent = config.breakeven;
            
            const equityValue = document.getElementById('equityValue');
            const equityDesc = document.getElementById('equityDesc');
            if (equityValue) equityValue.textContent = config.equity + '%';
            if (equityDesc) equityDesc.textContent = 'pre-money valuation ' + this.formatMoney(Math.round(amount / (config.equity / 100)));
            
            const allocSpacePerc = document.getElementById('allocSpacePerc');
            const allocEquipPerc = document.getElementById('allocEquipPerc');
            const allocRenoPerc = document.getElementById('allocRenoPerc');
            const allocBrandPerc = document.getElementById('allocBrandPerc');
            if (allocSpacePerc) allocSpacePerc.textContent = config.perc.space + '%';
            if (allocEquipPerc) allocEquipPerc.textContent = config.perc.equip + '%';
            if (allocRenoPerc) allocRenoPerc.textContent = config.perc.reno + '%';
            if (allocBrandPerc) allocBrandPerc.textContent = config.perc.brand + '%';
            
            const allocSpaceBar = document.getElementById('allocSpaceBar');
            const allocEquipBar = document.getElementById('allocEquipBar');
            const allocRenoBar = document.getElementById('allocRenoBar');
            const allocBrandBar = document.getElementById('allocBrandBar');
            if (allocSpaceBar) allocSpaceBar.style.width = config.perc.space + '%';
            if (allocEquipBar) allocEquipBar.style.width = config.perc.equip + '%';
            if (allocRenoBar) allocRenoBar.style.width = config.perc.reno + '%';
            if (allocBrandBar) allocBrandBar.style.width = config.perc.brand + '%';
            
            const amtSpace = Math.round(amount * config.perc.space / 100);
            const amtEquip = Math.round(amount * config.perc.equip / 100);
            const amtReno = Math.round(amount * config.perc.reno / 100);
            const amtBrand = amount - amtSpace - amtEquip - amtReno;
            
            const allocSpaceAmt = document.getElementById('allocSpaceAmt');
            const allocEquipAmt = document.getElementById('allocEquipAmt');
            const allocRenoAmt = document.getElementById('allocRenoAmt');
            const allocBrandAmt = document.getElementById('allocBrandAmt');
            if (allocSpaceAmt) allocSpaceAmt.textContent = this.formatMoney(amtSpace);
            if (allocEquipAmt) allocEquipAmt.textContent = this.formatMoney(amtEquip);
            if (allocRenoAmt) allocRenoAmt.textContent = this.formatMoney(amtReno);
            if (allocBrandAmt) allocBrandAmt.textContent = this.formatMoney(amtBrand);
            
            const allocSpaceDesc = document.getElementById('allocSpaceDesc');
            const allocEquipDesc = document.getElementById('allocEquipDesc');
            const allocRenoDesc = document.getElementById('allocRenoDesc');
            const allocBrandDesc = document.getElementById('allocBrandDesc');
            if (allocSpaceDesc) allocSpaceDesc.textContent = config.desc.space;
            if (allocEquipDesc) allocEquipDesc.textContent = config.desc.equip;
            if (allocRenoDesc) allocRenoDesc.textContent = config.desc.reno;
            if (allocBrandDesc) allocBrandDesc.textContent = config.desc.brand;
            
            const totalCapital = document.getElementById('totalCapitalReminder');
            if (totalCapital) totalCapital.textContent = this.formatMoney(amount);
            
            this.updateChartData(amount, config.multiplier);
            
            const glow = document.getElementById('finAmbientGlow');
            if (glow) glow.style.opacity = 0.04 + index * 0.008;
        },
        
        bindEvents() {
            const slider = document.getElementById('finSlider');
            const fillDiv = document.getElementById('sliderFill');
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.currentRangeIndex = parseInt(e.target.value);
                    if (fillDiv) fillDiv.style.width = (this.currentRangeIndex / 5) * 100 + '%';
                    this.updateAll(this.currentRangeIndex);
                });
            }
            const scenarioBtns = document.querySelectorAll('.fin-scenario-btn');
            scenarioBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    scenarioBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentScenario = btn.getAttribute('data-scenario');
                    this.updateAll(this.currentRangeIndex);
                });
            });
        },
        
        init() {
            console.log('FinancialSimulator initializing...');
            if (typeof Chart === 'undefined') {
                const checkInterval = setInterval(() => {
                    if (typeof Chart !== 'undefined') {
                        clearInterval(checkInterval);
                        this.initChart();
                        this.bindEvents();
                        this.updateAll(2);
                        window.addEventListener('resize', () => { if (this.revenueChart) this.revenueChart.resize(); });
                        console.log('FinancialSimulator initialized');
                    }
                }, 100);
                return;
            }
            this.initChart();
            this.bindEvents();
            this.updateAll(2);
            window.addEventListener('resize', () => { if (this.revenueChart) this.revenueChart.resize(); });
        }
    };

    // ======================================================
    // 14. SHOWCASE FIREFOX FALLBACK (sama)
    // ======================================================
    const ShowcaseFirefoxFallback = {
        init() {
            if (!Utils.isFirefox()) return;
            const container = document.querySelector('.showcase-container');
            const boxes = document.querySelectorAll('.showcase-box');
            if (!container || !boxes.length) return;
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
        }
    };

    // ======================================================
    // 15. MAIN INITIALIZATION
    // ======================================================
    function init() {
        Preloader.init();
        ThemeManager.init();
        ScrollHandler.init();
        SteamParticles.init();
        RevealAnimations.init();
        MobileMenu.init();
        DecodeEffect.init();
        CustomCursor.init();
        ShowcaseMobileTap.init();
        FinancialSimulator.init();
        ShowcaseFirefoxFallback.init();
        VBSInteractions.init();
        console.log('CAFEIN — Initialized successfully');
    }
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
    
    window.closeMobile = () => MobileMenu.close();
    window.addEventListener('beforeunload', () => CustomCursor.destroy());
})();