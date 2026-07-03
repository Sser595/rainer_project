document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll with offset for nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const href = btn.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 20;
                window.scrollTo({ top, behavior: 'smooth' });
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
});


// --- LOGICA PROCESS CAROUSEL ---




const wrapper = document.getElementById('carouselWrapper');
if (wrapper) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    const totalRealSlides = dots.length;

    function updateDots() {
        if (totalRealSlides > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index % totalRealSlides].classList.add('active');
        }
    }

    function autoScroll() {
        index++;
        wrapper.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        wrapper.style.transform = `translateX(-${index * 100}%)`;

        // Aggiorna i pallini
        updateDots();

        if (index >= slides.length - 1) {
            wrapper.addEventListener('transitionend', function reset() {
                wrapper.style.transition = 'none';
                index = 0;
                wrapper.style.transform = `translateX(0)`;
                updateDots(); // Reset pallini
                wrapper.removeEventListener('transitionend', reset);
            });
        }
    }

    let intervalId = setInterval(autoScroll, 4000);

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(autoScroll, 4000);
    }

    dots.forEach((dot, dotIdx) => {
        dot.addEventListener('click', () => {
            index = dotIdx;
            wrapper.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            wrapper.style.transform = `translateX(-${index * 100}%)`;
            updateDots();
            resetInterval();
        });
    });
}
