document.addEventListener('DOMContentLoaded', function() {
    // Toggle between list and editor views
    const addNewBtn = document.getElementById('oc-add-new');
    const carouselList = document.querySelector('.oc-carousel-list');
    const carouselEditor = document.querySelector('.oc-carousel-editor');

    if (addNewBtn && carouselList && carouselEditor) {
        addNewBtn.addEventListener('click', function() {
            carouselList.style.display = 'none';
            carouselEditor.style.display = 'block';
            resetEditor();
        });

        document.getElementById('oc-cancel-edit').addEventListener('click', function() {
            carouselList.style.display = 'block';
            carouselEditor.style.display = 'none';
        });
    }

    function resetEditor() {
        document.getElementById('oc-carousel-name').value = '';
        document.getElementById('oc-carousel-slug').value = '';
        document.getElementById('oc-slides-container').innerHTML = '';
        document.querySelector('.oc-carousel-editor').dataset.id = '';
        
        // Reset settings to defaults
        document.getElementById('oc-slides-per-view').value = '3';
        document.getElementById('oc-effect').value = 'slide';
        document.getElementById('oc-autoplay').checked = true;
        document.getElementById('oc-autoplay-delay').value = '3000';
    }

    // Generate slug from name
    const nameInput = document.getElementById('oc-carousel-name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const slugInput = document.getElementById('oc-carousel-slug');
            if (!slugInput.value) {
                slugInput.value = this.value.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
            }
        });
    }

    // Add new slide
    document.getElementById('oc-add-slide')?.addEventListener('click', function(e) {
        e.preventDefault();
        addNewSlide();
    });

    function addNewSlide(slideData = {}) {
        const slideId = Date.now();
        const slidesContainer = document.getElementById('oc-slides-container');
        
        const slideElement = document.createElement('div');
        slideElement.className = 'oc-slide';
        slideElement.dataset.slideId = slideId;
        
        slideElement.innerHTML = `
            <div class="oc-slide-header">
                <h4>Slide #${slidesContainer.children.length + 1}</h4>
                <button class="button oc-remove-slide">Remove</button>
            </div>
            <div class="oc-slide-fields">
                <div class="oc-form-group">
                    <label>Background Image</label>
                    <button class="button oc-upload-bg">Upload</button>
                    <input type="text" class="oc-bg-image regular-text" 
                           value="${slideData.bg_image || ''}">
                    <div class="oc-image-preview" style="display: ${slideData.bg_image ? 'block' : 'none'}">
                        <img src="${slideData.bg_image || ''}" style="max-width:100px;">
                    </div>
                </div>
                <div class="oc-form-group">
                    <label>Title Text</label>
                    <input type="text" class="oc-title-text regular-text" 
                           value="${slideData.title || ''}" 
                           placeholder="e.g. Buy 2 @999">
                </div>
                <div class="oc-form-group">
                    <label>Subtitle Text</label>
                    <input type="text" class="oc-subtitle-text regular-text" 
                           value="${slideData.subtitle || ''}" 
                           placeholder="e.g. Get any 2 T-shirts for 999">
                </div>
                <div class="oc-form-group">
                    <label>Button Link</label>
                    <input type="text" class="oc-button-link regular-text" 
                           value="${slideData.button_link || ''}" 
                           placeholder="URL when clicked">
                </div>
                <div class="oc-form-group">
                    <label>Button Text</label>
                    <input type="text" class="oc-button-text regular-text" 
                           value="${slideData.button_text || 'Shop Now'}">
                </div>
            </div>
        `;
        
        slidesContainer.appendChild(slideElement);
        
        // Initialize media uploader for this slide
        initMediaUploader(slideElement);
    }

    function initMediaUploader(slideElement) {
        const uploadBtn = slideElement.querySelector('.oc-upload-bg');
        const input = slideElement.querySelector('.oc-bg-image');
        const preview = slideElement.querySelector('.oc-image-preview');
        
        uploadBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            
            const frame = wp.media({
                title: 'Select Background Image',
                button: { text: 'Use this image' },
                multiple: false
            });
            
            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                input.value = attachment.url;
                preview.style.display = 'block';
                preview.querySelector('img').src = attachment.url;
            });
            
            frame.open();
        });
    }

    // Remove slide
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('oc-remove-slide')) {
            e.preventDefault();
            e.target.closest('.oc-slide').remove();
        }
    });

    // Edit carousel handler will be added in Part 3
    // Save carousel handler will be added in Part 3
});