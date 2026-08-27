'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('.main-header');
    const isHome = body.classList.contains('home-page');

    // ============================================================
    // Scroll-driven effects
    // One shared, passive, rAF-throttled listener instead of
    // multiple naive listeners firing on every scroll event.
    // ============================================================
    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    let ticking = false;

    const onScroll = () => {
        ticking = false;
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

    if (isHome && (header || heroBgWrapper)) {
        window.addEventListener('scroll', onScrollRequest, { passive: true });
        onScroll();
    }

    // ============================================================
    // Reveal-on-scroll animation (IntersectionObserver is far
    // cheaper than measuring every element on every scroll event).
    // ============================================================
    const revealTargets = document.querySelectorAll(
        '.handmade-intro, .handmade-photos, .products-grid-container'
    );

    if (revealTargets.length) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    el.classList.add('is-animated');
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
        } else {
            revealTargets.forEach(el => el.classList.add('is-animated'));
        }
    }

    // ============================================================
    // Mobile menu overlay
    // ============================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    const closeMobileMenu = () => {
        if (!mobileMenu || !hamburgerBtn) return;
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (header) header.classList.remove('menu-open');
        body.classList.remove('no-scroll');
    };

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if (header) header.classList.toggle('menu-open');
            body.classList.toggle('no-scroll');
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close when clicking the overlay backdrop
        mobileMenu.addEventListener('click', e => {
            if (e.target === mobileMenu) closeMobileMenu();
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
        window.scrollTo({ top, behavior: 'smooth' });
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
        let slideInterval;

        const changeSlide = index => {
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            dots[currentSlide].classList.add('active');

            slides.forEach((slide, idx) => {
                slide.style.transform = `translateX(${(idx - currentSlide) * 100}%)`;
            });

            heroContents.forEach((content, idx) => {
                content.classList.toggle('active', idx === currentSlide);
            });
        };

        const startSlideShow = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => changeSlide((currentSlide + 1) % slides.length), intervalTime);
        };

        slides.forEach((slide, idx) => {
            slide.style.transform = `translateX(${idx * 100}%)`;
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                changeSlide(idx);
                startSlideShow();
            });
        });

        startSlideShow();
    }
});
