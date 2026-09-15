'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('.main-header');
    const isHome = body.classList.contains('home-page');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // Scroll-driven effects
    // One shared, passive, rAF-throttled listener instead of
    // multiple naive listeners firing on every scroll event.
    // ============================================================
    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    const backToTop = document.querySelector('.back-to-top');
    let ticking = false;

    const onScroll = () => {
        ticking = false;
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 600);
        }
        if (!isHome) return;
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > window.innerHeight / 2);
        }
        if (heroBgWrapper && window.innerWidth > 768) {
            heroBgWrapper.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
    };

    const onScrollRequest = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    };

    if (header || heroBgWrapper || backToTop) {
        window.addEventListener('scroll', onScrollRequest, { passive: true });
        onScroll();
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // ============================================================
    // Reveal-on-scroll animation (IntersectionObserver is far
    // cheaper than measuring every element on every scroll event).
    // ============================================================
    const revealTargets = document.querySelectorAll(
        '.handmade-intro, .handmade-photos, .products-grid-container'
    );

    if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                // Clear inline styles once the transition ends so that
                // hover transitions defined in CSS keep working.
                el.addEventListener('transitionend', e => {
                    if (e.target !== el) return;
                    el.style.opacity = '';
                    el.style.transform = '';
                    el.style.transition = '';
                }, { once: true });
                observer.unobserve(el);
            });
        }, { threshold: 0.2 });

        revealTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            revealObserver.observe(el);
        });
    }

    // ============================================================
    // Mobile menu overlay
    // ============================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    const setMenuState = open => {
        if (!mobileMenu || !hamburgerBtn) return;
        hamburgerBtn.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        if (header) header.classList.toggle('menu-open', open);
        body.classList.toggle('no-scroll', open);

        hamburgerBtn.setAttribute('aria-expanded', String(open));
        hamburgerBtn.setAttribute('aria-label', open ? 'Chiudi Menu' : 'Apri Menu');
        mobileMenu.setAttribute('aria-hidden', String(!open));
        mobileMenu.toggleAttribute('inert', !open);

        if (open) {
            const firstFocusable = mobileMenu.querySelector('a[href], button:not([disabled])');
            if (firstFocusable) firstFocusable.focus();
        } else if (document.activeElement && mobileMenu.contains(document.activeElement)) {
            hamburgerBtn.focus();
        }
    };

    const closeMobileMenu = () => setMenuState(false);

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            setMenuState(!mobileMenu.classList.contains('active'));
        });

        // Close when clicking the overlay backdrop
        mobileMenu.addEventListener('click', e => {
            if (e.target === mobileMenu) closeMobileMenu();
        });

        // Trap focus inside the open overlay
        mobileMenu.addEventListener('keydown', e => {
            if (e.key !== 'Tab' || !mobileMenu.classList.contains('active')) return;
            const focusables = mobileMenu.querySelectorAll('a[href], button:not([disabled])');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMobileMenu();
        });
    }

    // ============================================================
    // Smooth scroll for in-page anchor links, with header offset
    // ============================================================
    const scrollToSection = e => {
        const btn = e.currentTarget;
        const href = btn.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();

        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 20;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', scrollToSection);
    });

    // ============================================================
    // Expandable "La Nostra Storia" section (mobile)
    // ============================================================
    const readMoreStoryBtn = document.getElementById('readMoreStoryBtn');
    const philosophyCollapsed = document.getElementById('philosophyCollapsed');

    if (readMoreStoryBtn && philosophyCollapsed) {
        readMoreStoryBtn.addEventListener('click', () => {
            const isExpanded = philosophyCollapsed.classList.toggle('expanded');
            readMoreStoryBtn.classList.toggle('active', isExpanded);
            readMoreStoryBtn.setAttribute('aria-expanded', String(isExpanded));
            const label = readMoreStoryBtn.querySelector('span');
            if (label) label.textContent = isExpanded ? 'Leggi meno' : 'Leggi di più';
        });
    }

    // ============================================================
    // Hero carousel (index)
    // ============================================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const heroContents = document.querySelectorAll('.hero-content');

    if (slides.length && dots.length) {
        const intervalTime = 5500;
        let currentSlide = 0;
        let slideInterval = null;
        let paused = false;

        const changeSlide = index => {
            dots[currentSlide].classList.remove('active');
            dots[currentSlide].removeAttribute('aria-current');
            currentSlide = index;
            dots[currentSlide].classList.add('active');
            dots[currentSlide].setAttribute('aria-current', 'true');

            slides.forEach((slide, idx) => {
                slide.style.transform = `translateX(${(idx - currentSlide) * 100}%)`;
            });

            heroContents.forEach((content, idx) => {
                content.classList.toggle('active', idx === currentSlide);
                content.setAttribute('aria-hidden', String(idx !== currentSlide));
            });
        };

        const stopSlideShow = () => {
            clearInterval(slideInterval);
            slideInterval = null;
        };

        const startSlideShow = () => {
            stopSlideShow();
            if (paused) return;
            slideInterval = setInterval(() => changeSlide((currentSlide + 1) % slides.length), intervalTime);
        };

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                changeSlide(idx);
                startSlideShow();
            });
        });

        // Pause / play control
        const pauseBtn = document.getElementById('heroPauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                paused = !paused;
                pauseBtn.setAttribute('aria-pressed', String(paused));
                pauseBtn.setAttribute('aria-label', paused ? 'Riprendi presentazione' : 'Metti in pausa presentazione');
                pauseBtn.classList.toggle('paused', paused);
                if (paused) stopSlideShow();
                else startSlideShow();
            });
        }

        changeSlide(0);
        startSlideShow();
    }
});
