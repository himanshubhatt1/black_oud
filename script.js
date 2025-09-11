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
    
    // Scroll-based bottle movement
    let ticking = false;
    
    function updateBottlePosition() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const productSectionTop = productSection.offsetTop;
        const productCenterElement = document.querySelector('.product-center');
        
        // Hide the static bottle in product section initially
        const staticBottle = document.querySelector('.product-bottle img');
        if (staticBottle) {
            staticBottle.style.opacity = '0';
        }
        
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.min(scrollY / (productSectionTop - heroHeight), 1);
        
        if (scrollProgress < 1) {
            // Bottle is still in hero section - only move vertically
            floatingBottle.style.position = 'fixed';
            floatingBottle.style.top = '50%';
            floatingBottle.style.left = '50%';
            floatingBottle.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.5}px)`;
            floatingBottle.style.opacity = 1 - (scrollProgress * 0.2);
            floatingBottle.style.zIndex = '9999';
            floatingBottle.style.display = 'block';
            
            // Add subtle rotation based on scroll
            const rotation = scrollProgress * 3;
            floatingBottle.style.transform += ` rotate(${rotation}deg)`;
            
        } else {
            // Calculate the transition to product section
            const transitionProgress = Math.min((scrollY - (productSectionTop - heroHeight)) / heroHeight, 1);
            
            if (transitionProgress < 1) {
                // Smooth vertical transition to product section
                const productCenterRect = productCenterElement.getBoundingClientRect();
                const productCenterTop = productCenterRect.top + window.scrollY;
                
                // Only move vertically, keep horizontal position centered
                const startTop = heroHeight / 2;
                const endTop = productCenterTop;
                
                const currentTop = startTop + (endTop - startTop) * transitionProgress;
                
                floatingBottle.style.position = 'absolute';
                floatingBottle.style.top = `${currentTop}px`;
                floatingBottle.style.left = '50%'; // Always keep centered horizontally
                floatingBottle.style.transform = 'translate(-50%, -30%)';
                floatingBottle.style.opacity = 1 - transitionProgress;
                floatingBottle.style.zIndex = '9999';
                floatingBottle.style.display = 'block';
                
                // Scale down during transition
                const scale = 1 - (transitionProgress * 0.2);
                floatingBottle.style.transform += ` scale(${scale})`;
                
            } else {
                // Hide floating bottle and show static bottle in product section
                floatingBottle.style.opacity = '0';
                floatingBottle.style.pointerEvents = 'none';
                floatingBottle.style.display = 'none';
                
                // Show the static bottle in product section
                if (staticBottle) {
                    staticBottle.style.opacity = '1';
                    staticBottle.style.transition = 'opacity 0.5s ease-in-out';
                }
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateBottlePosition);
            ticking = true;
        }
    }
    
    // Scroll event listener
    window.addEventListener('scroll', requestTick);
    
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
