/* =============================================
   ARAGÓN TE ESPERA – Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Configurar GSAP con Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    // Header Scrolled State
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Parallax Logic (Hero y Footer)
    const mainContent = document.getElementById('main-content');
    const footerSection = document.getElementById('footer-section');
    const heroSection = document.getElementById('hero-section');

    function updateParallaxLayout() {
        if (mainContent && footerSection) {
            mainContent.style.marginBottom = `${footerSection.offsetHeight}px`;
        }
    }

    function handleParallaxScroll() {
        if (!heroSection || !footerSection) return;
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const threshold = heroHeight * 0.8;

        if (scrollY > threshold) {
            footerSection.classList.remove('opacity-0', 'pointer-events-none');
            heroSection.style.visibility = 'hidden';
        } else {
            footerSection.classList.add('opacity-0', 'pointer-events-none');
            heroSection.style.visibility = 'visible';
        }
    }

    const footerIsFixed = footerSection && getComputedStyle(footerSection).position === 'fixed';

    if (mainContent && footerSection && footerIsFixed) {
        window.addEventListener('resize', updateParallaxLayout);
        window.addEventListener('scroll', handleParallaxScroll);
        updateParallaxLayout();
        handleParallaxScroll();
    }

    // GSAP Scroll Animations – fade-up
    gsap.utils.toArray('.fade-up').forEach((elem) => {
        gsap.fromTo(elem,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // GSAP Scroll Animations – fade-in
    gsap.utils.toArray('.fade-in').forEach((elem) => {
        gsap.fromTo(elem,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
});
