document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.oc-carousel-wrapper');
    
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.oc-carousel-container');
        const slides = Array.from(carousel.querySelectorAll('.oc-slide'));
        const prevBtn = carousel.querySelector('.oc-carousel-nav.prev');
        const nextBtn = carousel.querySelector('.oc-carousel-nav.next');
        const dots = Array.from(carousel.querySelectorAll('.oc-carousel-dot'));
        
        // Get settings from data attributes
        const slidesPerView = parseInt(carousel.dataset.slidesPerView) || 3;
        const autoplayDelay = parseInt(carousel.dataset.autoplayDelay) || 3000;
        const autoplay = carousel.dataset.autoplay === 'true';
        
        let currentIndex = 0;
        let autoplayInterval;
        
        // Initialize carousel
        function initCarousel() {
            updateCarousel();
            setupEventListeners();
            
            if (autoplay) {
                startAutoplay();
            }
        }
        
        // Update carousel position and active states
        function updateCarousel() {
            const slideWidth = slides[0].offsetWidth + 20; // Include margin
            const offset = -currentIndex * slideWidth;
            container.style.transform = `translateX(${offset}px)`;
            
            // Update active states
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
            
            // Update pagination dots
            if (dots.length) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            updateCarousel();
        }
        
        // Go to next slide
        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0); // Loop to beginning
            }
        }
        
        // Go to previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(slides.length - 1); // Loop to end
            }
        }
        
        // Start autoplay
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
        
        // Stop autoplay
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }
        
        // Setup event listeners
        function setupEventListeners() {
            // Navigation buttons
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            
            // Pagination dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            // Pause autoplay on hover
            if (autoplay) {
                carousel.addEventListener('mouseenter', stopAutoplay);
                carousel.addEventListener('mouseleave', startAutoplay);
            }
            
            // Handle button clicks
            carousel.addEventListener('click', function(e) {
                const button = e.target.closest('.oc-coupon-button');
                if (button) {
                    const slide = button.closest('.oc-slide');
                    const link = slide.querySelector('a');
                    if (link) {
                        window.location.href = link.href;
                    }
                }
            });
            
            // Lazy load images
            const images = carousel.querySelectorAll('.oc-coupon-bg');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            images.forEach(img => {
                img.dataset.src = img.src;
                img.src = '';
                observer.observe(img);
            });
        }
        
        // Initialize the carousel
        initCarousel();
    });
});
