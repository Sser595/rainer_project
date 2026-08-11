document.addEventListener('DOMContentLoaded', () => {
    // Transparent to solid header on scroll (home page only)
    const header = document.querySelector('.main-header');
    if (header && document.body.classList.contains('home-page')) {
        const handleScroll = () => {
            const heroHeight = window.innerHeight;
            if (window.scrollY > (heroHeight / 2)) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // Smooth scroll with offset for nav buttons
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const href = btn.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 20;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // Toggle read more in history section on mobile
    const readMoreStoryBtn = document.getElementById('readMoreStoryBtn');
    const philosophyCollapsed = document.getElementById('philosophyCollapsed');

    if (readMoreStoryBtn && philosophyCollapsed) {
        readMoreStoryBtn.addEventListener('click', () => {
            const isExpanded = philosophyCollapsed.classList.toggle('expanded');
            readMoreStoryBtn.classList.toggle('active');
            
            const btnText = readMoreStoryBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = isExpanded ? 'Leggi meno' : 'Leggi di più';
            }
        });
    }

    // Effetto Fade-In allo scroll per gli elementi
    const elementsToAnimate = document.querySelectorAll(
        '.handmade-intro, .handmade-photos, .products-grid-container'
    );

    // Imposta l'opacità iniziale a 0
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const checkVisibility = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        elementsToAnimate.forEach(el => {
            if (el.classList.contains('is-animated')) return;

            const boxTop = el.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                el.classList.add('is-animated');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';

                // Rimuove gli stili inline a fine animazione per consentire
                // le transizioni dell'hover definite nei file CSS
                el.addEventListener('transitionend', (e) => {
                    if (e.target === el) {
                        el.style.opacity = '';
                        el.style.transform = '';
                        el.style.transition = '';
                    }
                }, { once: true });
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    // Controllo al caricamento iniziale
    checkVisibility();

    // Toggle Mobile Menu Overlay
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if (header) header.classList.toggle('menu-open');
            document.body.classList.toggle('no-scroll');
        };

        const closeMenu = () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            if (header) header.classList.remove('menu-open');
            document.body.classList.remove('no-scroll');
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking mobile links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking the overlay backdrop
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }



    // Hero Carousel background changer
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5500; // 5.5 seconds for readable/user-friendly pacing

    if (slides.length > 0 && dots.length > 0) {
        // Initialize slides positions side-by-side
        const initializeSlides = () => {
            slides.forEach((slide, idx) => {
                slide.style.transform = `translateX(${idx * 100}%)`;
            });
        };

        const changeSlide = (index) => {
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            dots[currentSlide].classList.add('active');

            // Shift all slides relative to the new active index
            slides.forEach((slide, idx) => {
                slide.style.transform = `translateX(${(idx - currentSlide) * 100}%)`;
            });

            // Update active hero content text
            const heroContents = document.querySelectorAll('.hero-content');
            heroContents.forEach((content, idx) => {
                if (idx === currentSlide) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        };

        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            changeSlide(nextIndex);
        };

        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        };

        const resetSlideShow = () => {
            clearInterval(slideInterval);
            startSlideShow();
        };

        // Click on dots to change slide
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                changeSlide(idx);
                resetSlideShow();
            });
        });

        initializeSlides();
        startSlideShow();
    }

    // Parallax scroll effect for hero background
    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    if (heroBgWrapper) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) {
                const scrolled = window.scrollY;
                // Slowly translate the background wrapper to create a parallax cover effect
                heroBgWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
            } else {
                heroBgWrapper.style.transform = '';
            }
        });
    }
});
