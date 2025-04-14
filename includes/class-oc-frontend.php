<?php
class OC_Frontend {
    public function __construct() {
        add_shortcode('offers_carousel', [$this, 'render_carousel']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets() {
        wp_enqueue_style('oc-frontend-css', OC_PLUGIN_URL . 'assets/css/frontend.css');
        wp_enqueue_script('oc-swiper', OC_PLUGIN_URL . 'assets/js/swiper-bundle.min.js', [], OC_VERSION, true);
        wp_enqueue_script('oc-frontend-js', OC_PLUGIN_URL . 'assets/js/frontend.js', ['oc-swiper'], OC_VERSION, true);
        
        // Localize script with plugin URL for lazy loading
        wp_localize_script('oc-frontend-js', 'oc_frontend_vars', [
            'plugin_url' => OC_PLUGIN_URL
        ]);
    }

   public function render_carousel($atts) {
    $atts = shortcode_atts(['slug' => ''], $atts);
    if (empty($atts['slug'])) return '';
    
    $carousel = OC_DB::get_carousel($atts['slug']);
    if (!$carousel) return '';
    
    $slides = json_decode($carousel->slides, true);
    $settings = json_decode($carousel->settings, true);
    
    ob_start();
    ?>
    <section class="oc-carousel-wrapper"
             data-slides-per-view="<?php echo esc_attr($settings['slides_per_view']); ?>"
             data-autoplay="<?php echo $settings['autoplay'] ? 'true' : 'false'; ?>"
             data-autoplay-delay="<?php echo esc_attr($settings['autoplay_delay']); ?>">
        <h2 class="oc-carousel-title">Offers Zone</h2>
        
        <div class="oc-carousel-container">
            <?php foreach ($slides as $slide) : ?>
                <div class="oc-slide">
                    <div class="oc-coupon">
                        <!-- Your existing coupon HTML structure -->
                        <div class="oc-coupon-cuts top">
                            <div class="oc-top-cut"></div>
                        </div>
                        
                        <div class="oc-coupon-container">
                            <img draggable="false" alt="offer-bg" 
                                 src="<?php echo esc_url($slide['bg_image']); ?>" 
                                 class="oc-coupon-bg">
                            <div class="oc-coupon-content">
                                <p class="oc-coupon-title"><?php echo esc_html($slide['title']); ?></p>
                                <p class="oc-coupon-subtitle"><?php echo esc_html($slide['subtitle']); ?></p>
                            </div>
                        </div>
                        
                        <div class="oc-center-cut"></div>
                        
                        <button class="oc-coupon-button oc-shine-effect">
                            <div class="oc-cta-text">
                                <p class="flex justify-center gap-1">
                                    <span><?php echo esc_html($slide['button_text'] ?: 'Shop Now'); ?></span>
                                </p>
                            </div>
                        </button>
                        
                        <div class="oc-coupon-cuts bottom">
                            <div class="oc-bottom-cut">
                                <span></span><span></span><span></span><span></span>
                                <span></span><span></span><span></span><span></span>
                                <span></span><span></span><span></span><span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Navigation Buttons -->
        <button class="oc-carousel-nav prev">‹</button>
        <button class="oc-carousel-nav next">›</button>
        
        <!-- Pagination -->
        <div class="oc-carousel-pagination">
            <?php for ($i = 0; $i < count($slides); $i++) : ?>
                <button class="oc-carousel-dot <?php echo $i === 0 ? 'active' : ''; ?>" 
                        data-index="<?php echo $i; ?>"></button>
            <?php endfor; ?>
        </div>
        
        <!-- Bottom strip with stars (keep your existing code) -->
        <div class="oc-bottom-strip-container">
            <!-- Your existing bottom strip HTML -->
        </div>
    </section>
    <?php
    return ob_get_clean();
}
}
