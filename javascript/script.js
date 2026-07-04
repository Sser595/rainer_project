document.addEventListener('DOMContentLoaded', () => {
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

    // Effetto Fade-In allo scroll per gli elementi
    const elementsToAnimate = document.querySelectorAll('.place-card, .info-item, .philosophy-text-col, .philosophy-image-col, .products-main-wrapper');

    // Imposta l'opacità iniziale a 0
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });

    const checkVisibility = () => {
        const triggerBottom = window.innerHeight / 5 * 4;

        elementsToAnimate.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    // Controllo al caricamento iniziale
    checkVisibility();

    // Toggle Mobile Menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
});
