document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.oc-carousel-wrapper');
    
    carousels.forEach(carousel => {
        const settings = {
            effect: carousel.dataset.effect || 'coverflow',
            slidesPerView: parseInt(carousel.dataset.slidesPerView) || 3,
            centeredSlides: true,
            loop: true,
            slideToClickedSlide: true,
            autoplay: carousel.dataset.autoplay === 'true' ? {
                delay: parseInt(carousel.dataset.autoplayDelay) || 3000,
                disableOnInteraction: false
            } : false,
            pagination: {
                el: carousel.querySelector('.swiper-pagination'),
                clickable: true,
            },
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    coverflowEffect: {
                        modifier: 1
                    }
                },
                640: {
                    slidesPerView: Math.min(2, parseInt(carousel.dataset.slidesPerView)),
                    spaceBetween: 15
                },
                1024: {
                    slidesPerView: parseInt(carousel.dataset.slidesPerView) || 3,
                    spaceBetween: 20
                }
            },
            on: {
                init: function() {
                    // Add active class to center slide
                    this.slides[this.activeIndex].classList.add('swiper-slide-active');
                },
                slideChange: function() {
                    // Update active class
                    this.slides.forEach(slide => slide.classList.remove('swiper-slide-active'));
                    this.slides[this.activeIndex].classList.add('swiper-slide-active');
                }
            }
        };

        // Initialize Swiper
        new Swiper(carousel.querySelector('.swiper-container'), settings);

        // Handle button clicks
        carousel.addEventListener('click', function(e) {
            const button = e.target.closest('.oc-coupon-button');
            if (button) {
                const slide = button.closest('.swiper-slide');
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
    });
});