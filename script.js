document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery-container');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-content img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    const loadingText = document.querySelector('.loading-text');

    const numberOfImages = 300;
    let currentImageIndex = 0;
    const images = [];
    let imagesLoadedCount = 0;

    // Create a temporary array to hold image elements for loading tracking
    const tempImagesForLoading = [];

    for (let i = 1; i <= numberOfImages; i++) {
        const imgPath = `./imagenes_aniversario/${i}.jpg`; // Asumiendo que las imágenes son .jpg
        images.push(imgPath);

        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.style.setProperty('--delay', `${i * 0.05}s`); // Retraso de animación secuencial

        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = `Recuerdo de nuestro aniversario #${i}`;
        img.loading = 'eager'; // Cargar activamente las imágenes para el preloader
        img.dataset.index = i - 1; // Guardar el índice para el lightbox

        // Track image loading
        tempImagesForLoading.push(img);
        img.onload = imageLoaded;
        img.onerror = imageLoaded; // También cuenta errores de carga como "cargado" para no bloquear

        const imageNumber = document.createElement('div');
        imageNumber.classList.add('image-number');
        imageNumber.textContent = `#${i}`;

        galleryItem.appendChild(img);
        galleryItem.appendChild(imageNumber);
        galleryContainer.appendChild(galleryItem);
    }

    function imageLoaded() {
        imagesLoadedCount++;
        const progress = (imagesLoadedCount / numberOfImages) * 100;
        progressBar.style.width = `${progress}%`;
        loadingText.textContent = `Cargando Momentos Preciosos... (${Math.floor(progress)}%)`;

        if (imagesLoadedCount === numberOfImages) {
            // Give a small delay to ensure progress bar reaches 100%
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Allow preloader to fade out before removing it completely
                preloader.addEventListener('transitionend', () => {
                    preloader.remove();
                    // Trigger animations for header/footer/gallery after preloader is gone
                    document.body.classList.add('loaded');
                });
            }, 300);
        }
    }

    // Lightbox functionality
    galleryContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            currentImageIndex = parseInt(e.target.dataset.index);
            openLightbox(currentImageIndex);
        }
    });

    function openLightbox(index) {
        lightboxImage.src = images[index];
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function navigateLightbox(direction) {
        lightboxImage.classList.add('fading'); // Iniciar la animación de desvanecimiento
        setTimeout(() => {
            currentImageIndex += direction;
            if (currentImageIndex < 0) {
                currentImageIndex = images.length - 1;
            } else if (currentImageIndex >= images.length) {
                currentImageIndex = 0;
            }
            lightboxImage.src = images[currentImageIndex];
            // Esperar un breve momento para que el navegador aplique el cambio de src antes de quitar 'fading'
            setTimeout(() => {
                lightboxImage.classList.remove('fading'); // Eliminar la clase para mostrar la nueva imagen
            }, 50); // Un pequeño retraso para asegurar la transición
        }, 300); // Duración de la animación de desvanecimiento en CSS
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});
