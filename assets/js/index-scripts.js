const EduLabHomepage = (() => {

    const TYPING_SPEED_NORMAL = 150;
    const TYPING_SPEED_DELETING = 70;
    const TYPING_PAUSE_BEFORE_DELETE = 2000;
    const TYPING_PAUSE_BEFORE_NEXT = 500;
    const COUNTER_ANIMATION_DURATION = 2000;
    const CAROUSEL_AUTOPLAY_INTERVAL = 5000;

    let currentTaglineIndex = 0;
    let currentCharIndex = 0;
    let isDeletingText = false;
    let taglineElement = null; // Elemen tagline dari HTML

    let currentSlide = 0;
    let totalSlides = 0; // Total slide akan dihitung dari HTML
    let carouselInterval = null;

    let contentData = {}; // Akan memuat content.json
    let testimonialsData = []; // Akan memuat testimonials.json
    let servicesProductsData = []; // Akan memuat services.json

    const fetchContentData = async () => {
        try {
            const response = await fetch('./assets/data/content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            contentData = await response.json();
            console.log("Content data loaded:", contentData);
        } catch (error) {
            console.error("Could not fetch content data:", error);
        }
    };

    const fetchTestimonialsData = async () => {
        try {
            const response = await fetch('./assets/data/testimonials.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            testimonialsData = await response.json();
            console.log("Testimonials data loaded:", testimonialsData);
        } catch (error) {
            console.error("Could not fetch testimonials data:", error);
        }
    };

    const fetchServicesProductsData = async () => {
        try {
            const response = await fetch('./assets/data/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            servicesProductsData = await response.json();
            console.log("Services Products data loaded:", servicesProductsData);
        } catch (error) {
            console.error("Could not fetch services products data:", error);
        }
    };

    const typeTaglineEffect = () => {
        const taglines = contentData.hero && contentData.hero.taglines ? contentData.hero.taglines : ["Kembangkan Potensi Anda Tanpa Batas."];
        if (!taglineElement || taglines.length === 0) {
            return;
        }

        const currentTagline = taglines[currentTaglineIndex];

        if (taglines.length === 1 && !isDeletingText && currentCharIndex === currentTagline.length) {
            return;
        }

        if (isDeletingText) {
            taglineElement.textContent = currentTagline.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            taglineElement.textContent = currentTagline.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        if (!isDeletingText && currentCharIndex === currentTagline.length) {
            setTimeout(() => isDeletingText = true, TYPING_PAUSE_BEFORE_DELETE);
        } else if (isDeletingText && currentCharIndex === 0) {
            isDeletingText = false;
            currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
            setTimeout(typeTaglineEffect, TYPING_PAUSE_BEFORE_NEXT);
        }

        const typingSpeed = isDeletingText ? 70 : 150;
        setTimeout(typeTaglineEffect, typingSpeed);
    };

    const animateCounter = (element, targetValue, duration, isPercentage = false) => {
        if (!element) return;
        let start = 0;
        const increment = targetValue / (duration / 10);
        const counter = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
                element.textContent = isPercentage ? targetValue + '%' : targetValue.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(start).toLocaleString() + (isPercentage ? '%' : '');
            }
        }, 10);
    };

    const setupStatisticsCounters = () => {
        const usersCountElement = document.getElementById('users-count');
        const projectsCountElement = document.getElementById('projects-count');
        const successRateElement = document.getElementById('success-rate');

        const observerOptions = { threshold: 0.5 };
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let targetStat = null;
                    if (contentData.hero && contentData.hero.stats) {
                        targetStat = contentData.hero.stats.find(s => s.id === entry.target.id);
                    }
                    
                    if (targetStat) {
                        animateCounter(entry.target, targetStat.target, COUNTER_ANIMATION_DURATION, targetStat.isPercentage);
                    } else {
                        switch (entry.target.id) {
                            case 'users-count': animateCounter(usersCountElement, 15000, COUNTER_ANIMATION_DURATION, false); break;
                            case 'projects-count': animateCounter(projectsCountElement, 2500, COUNTER_ANIMATION_DURATION, false); break;
                            case 'success-rate': animateCounter(successRateElement, 95, COUNTER_ANIMATION_DURATION, true); break;
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (usersCountElement) observer.observe(usersCountElement);
        if (projectsCountElement) observer.observe(projectsCountElement);
        if (successRateElement) observer.observe(successRateElement);
    };

    const setupHeroSmoothScroll = () => {
        const ctaScrollButton = document.getElementById('hero-cta-scroll');
        const targetSectionId = ctaScrollButton ? ctaScrollButton.dataset.scrollTarget : null;

        if (ctaScrollButton && targetSectionId) {
            ctaScrollButton.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    };

    const setupProgressiveDisclosure = () => {
        const toggleButtons = document.querySelectorAll('.toggle-details-btn');

        toggleButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const serviceCard = button.closest('.feature-highlight-card') || button.closest('.feature-card-small');
                if (!serviceCard) return;

                const detailsContainer = serviceCard.querySelector('.feature-details-expandable');
                if (!detailsContainer) return;

                const arrowIcon = button.querySelector('.arrow-icon');
                const buttonText = button.querySelector('.button-text');

                detailsContainer.classList.toggle('expanded');

                if (detailsContainer.classList.contains('expanded')) {
                    if (buttonText) buttonText.textContent = 'Sembunyikan Detail';
                    if (arrowIcon) arrowIcon.style.transform = 'rotate(90deg)';
                    detailsContainer.style.height = detailsContainer.scrollHeight + 'px';
                } else {
                    if (buttonText) buttonText.textContent = 'Jelajahi Detail';
                    if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
                    detailsContainer.style.height = '0';
                }

                detailsContainer.addEventListener('transitionend', function handler() {
                    if (detailsContainer.classList.contains('expanded')) {
                        detailsContainer.style.height = 'auto';
                    }
                    detailsContainer.removeEventListener('transitionend', handler);
                });
            });
        });
    };
    
    // Fungsi untuk merender kartu produk/layanan di index (dari services.json)
    const renderServiceProductCards = () => {
        const container = document.getElementById('service-product-cards-container');
        if (!container || !servicesProductsData || !servicesProductsData.products) return;

        container.innerHTML = ''; // Clear existing content

        // Hanya tampilkan beberapa produk, misalnya 6 teratas, atau acak
        const productsToShow = servicesProductsData.products.slice(0, 6);

        productsToShow.forEach(product => {
            const cardHtml = `
                <a href="/services.html#${product.id}" class="product-card">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-40 object-cover rounded-t-lg">
                    <div class="product-card-content p-4 flex flex-col flex-grow border-2 border-gray-200 rounded-b-lg">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${product.title}</h3>
                        <p class="text-gray-700 text-sm mb-4 flex-grow">${product.short_desc}</p>
                        <p class="text-lg font-bold text-indigo-600">${formatRupiah(product.price)}</p>
                    </div>
                </a>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    const showSlide = (index) => {
        const carousel = document.getElementById('testimonial-carousel');
        const dots = document.querySelectorAll('.carousel-dot');
        const slides = carousel ? Array.from(carousel.children) : [];

        if (!carousel || slides.length === 0) return;

        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + totalSlides) % totalSlides;
        
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const renderStarRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += `<span class="star text-yellow-400 text-2xl cursor-pointer" data-value="${i + 1}">★</span>`;
            } else if (hasHalfStar && i === fullStars) {
                starsHtml += `<span class="star text-yellow-400 text-2xl cursor-pointer star-half" data-value="${i + 1}">★</span>`;
            } else {
                starsHtml += `<span class="star text-gray-300 text-2xl cursor-pointer" data-value="${i + 1}">★</span>`;
            }
        }
        return `
            <div class="star-rating flex justify-center mt-3" data-rating="${rating}">
                ${starsHtml}
                <span class="rating-detail absolute bg-gray-800 text-white text-sm px-2 py-1 rounded hidden">${rating.toFixed(1)} dari 5</span>
            </div>
        `;
    };

    const setupTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!carousel || !dotsContainer || !testimonialsData) { // Gunakan testimonialsData dari fetch
            return;
        }
        
        carousel.innerHTML = ''; // Hapus konten statis jika ada
        dotsContainer.innerHTML = ''; // Hapus dots statis jika ada

        testimonialsData.forEach((testimonial, index) => { // Render dari JSON
            const testimonialHtml = `
                <div class="w-full flex-shrink-0 p-8 bg-white rounded-lg shadow-md flex flex-col items-center text-center testimonial-card">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-20 h-20 rounded-full mb-4 object-cover">
                    <p class="text-lg text-gray-700 italic mb-4">"${testimonial.quote}"</p>
                    <p class="font-semibold text-gray-800">- ${testimonial.name} (${testimonial.title})</p>
                    ${renderStarRating(testimonial.rating)}
                </div>
            `;
            carousel.insertAdjacentHTML('beforeend', testimonialHtml);

            const dotButton = document.createElement('button');
            dotButton.className = `w-3 h-3 bg-gray-300 rounded-full carousel-dot${index === 0 ? ' active' : ''}`;
            dotButton.dataset.page = index;
            dotsContainer.appendChild(dotButton);
        });

        const slides = Array.from(carousel.children);
        totalSlides = slides.length;

        document.querySelectorAll('.carousel-dot').forEach(dotBtn => {
            dotBtn.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.page);
                showSlide(slideIndex);
                resetAutoplay();
            });
        });

        const startAutoplay = () => {
            carouselInterval = setInterval(nextSlide, CAROUSEL_AUTOPLAY_INTERVAL);
        };

        const stopAutoplay = () => {
            clearInterval(carouselInterval);
        };

        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        showSlide(0);
        startAutoplay();

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    };

    // Helper for Rupiah Formatting (from services.html context)
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const init = async () => {
        await fetchContentData(); // Untuk tagline dan statistik
        await fetchTestimonialsData(); // Untuk testimoni
        await fetchServicesProductsData(); // Untuk kartu produk di index

        taglineElement = document.getElementById('tagline');
        if (taglineElement) {
            typeTaglineEffect();
        } else {
            console.warn("Element with ID 'tagline' not found. Typing effect will not run.");
        }
        setupStatisticsCounters();
        setupHeroSmoothScroll();

        // Panggil render untuk bagian Services/Products (Belajar & Program Kami)
        renderServiceProductCards();

        setupProgressiveDisclosure(); // Untuk fitur highlight yang statis

        setupTestimonialCarousel();

        console.log("EduLab Homepage scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabHomepage.init);