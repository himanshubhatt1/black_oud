// Smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    const floatingBottle = document.getElementById('floatingBottle');
    const heroSection = document.querySelector('.hero-section');
    const productSection = document.querySelector('.product-section');
    const productLeft = document.querySelector('.product-left');
    const productCenter = document.querySelector('.product-center');
    const productRight = document.querySelector('.product-right');
    
    // Intersection Observer for fade animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    observer.observe(productLeft);
    observer.observe(productCenter);
    observer.observe(productRight);
    
    // Scroll-based animation: move 5th bottle to product position
    const bannerBottle = document.getElementById('bottle5');
    const staticBottle = document.getElementById('productBottle');
    const productCenterElement = document.querySelector('.product-bottle');

    // Ensure initial states
    // Keep static bottle visible initially; do not hide other content

    let ticking = false;
    let cachedStartCenter = null; // {x,y,w,h}

    function lerp(start, end, t) { return start + (end - start) * t; }

    function getCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            w: rect.width,
            h: rect.height
        };
    }

    function updateBottlePosition() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const productTop = productSection.offsetTop;
        const scrollY = window.scrollY + window.innerHeight * 0.5; // viewport center

        // progress from 0 (banner) to 1 (product)
        const start = heroBottom - window.innerHeight * 0.25;
        const end = productTop + window.innerHeight * 0.25;
        const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

        const productTarget = getCenter(productCenterElement);

        if (progress > 0 && progress < 1) {
            // animate banner bottle
            if (!cachedStartCenter) {
                // measure before switching to fixed
                cachedStartCenter = getCenter(bannerBottle);
            }
            bannerBottle.classList.add('is-animating');
            const targetX = productTarget.x;
            const targetY = productTarget.y;

            const currentX = lerp(cachedStartCenter.x, targetX, progress);
            const currentY = lerp(cachedStartCenter.y, targetY, progress);
            const currentScale = lerp(1, productTarget.h / cachedStartCenter.h, progress);

            bannerBottle.style.top = `${currentY}px`;
            bannerBottle.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
            bannerBottle.style.left = `${currentX}px`;
            bannerBottle.style.zIndex = '99999';

            // Do not alter static bottle visibility
        } else if (progress >= 1) {
            // lock into product state
            bannerBottle.classList.add('is-animating');
            bannerBottle.style.top = `${productTarget.y}px`;
            bannerBottle.style.left = `${productTarget.x}px`;
            if (!cachedStartCenter) cachedStartCenter = getCenter(bannerBottle);
            bannerBottle.style.transform = `translate(-50%, -50%) scale(${productTarget.h / cachedStartCenter.h})`;
            // Do not alter static bottle visibility
        } else {
            // reset to banner row
            bannerBottle.classList.remove('is-animating');
            bannerBottle.style.cssText = '';
            // Do not alter static bottle visibility
            cachedStartCenter = null;
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateBottlePosition);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    updateBottlePosition();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
    
    // Parallax effect for golden waves
    const goldenWaves = document.querySelector('.golden-waves');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        goldenWaves.style.transform = `translateY(${parallax}px)`;
    });
    
    // Add hover effects to navigation arrows
    const navArrows = document.querySelectorAll('.nav-arrow');
    navArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add subtle mouse movement effect to bottle image
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const bottleImg = document.querySelector('.floating-bottle img');
        if (bottleImg && window.scrollY < heroSection.offsetHeight) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            
            bottleImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
    
    // Reset bottle position when mouse leaves
    document.addEventListener('mouseleave', () => {
        const bottleImg = document.querySelector('.floating-bottle img');
        if (bottleImg) {
            bottleImg.style.transform = '';
        }
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Performance optimization: throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Additional scroll-based effects can be added here
        }, 10);
    });
});
