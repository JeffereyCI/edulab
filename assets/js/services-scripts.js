// assets/js/services-scripts.js

const EduLabServicesPage = (() => {

    let servicesData = {};
    let currentSelectedProgram = null;

    const fetchServicesData = async () => {
        try {
            const response = await fetch('./assets/data/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            servicesData = await response.json();
            console.log("Services data loaded:", servicesData);
        } catch (error) {
            console.error("Could not fetch services data:", error);
        }
    };

    const renderCategoryFilters = (categories) => {
        const filterContainer = document.getElementById('category-filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `category-tab-btn ${category.id === 'data-science' ? 'active' : ''}`;
            button.dataset.category = category.id;
            button.textContent = category.name;
            filterContainer.appendChild(button);
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tab-btn')) {
                document.querySelectorAll('.category-tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                filterProducts(e.target.dataset.category);
            }
        });
    };

    const formatReviewCount = (count) => {
        return `${new Intl.NumberFormat('en-US').format(count)} review`;
    };

    const renderSimpleStarRating = (rating) => {
        return `⭐ ${rating.toFixed(1)}`;
    };

    const renderProductCards = (products) => {
        const cardsContainer = document.getElementById('product-cards-container');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        if (products.length === 0) {
            cardsContainer.innerHTML = '<p class="text-center text-gray-600 text-lg col-span-full">Tidak ada produk yang ditemukan untuk kategori ini.</p>';
            return;
        }

        products.forEach(product => {
            const badgeClass = product.badge ? '' : 'hidden';
            let badgeBgClass = 'bg-yellow-400';
            if (product.badge === 'Bestseller') {
                badgeBgClass = 'bg-indigo-600';
            } else if (product.badge === 'Premium') {
                badgeBgClass = 'bg-green-600';
            } else if (product.badge === 'Highest Rated') {
                badgeBgClass = 'bg-orange-500';
            }

            const cardHtml = `
                <div class="product-card shadow-lg rounded-xl border border-gray-200 p-4 transition hover:shadow-xl" data-category="${product.category}">
                    <img class="w-full h-40 object-cover rounded-md mb-3" src="${product.image}" alt="${product.title}">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-gray-700 rating">⭐ ${product.rating.toFixed(1)}</span>
                        <span class="text-xs ${badgeBgClass} text-white font-semibold rounded px-2 py-1 badge ${badgeClass}">${product.badge}</span>
                    </div>
                    <h3 class="text-base font-bold mt-2 title">${product.title}</h3>
                    <p class="text-sm text-gray-600 instructor">${product.instructor}</p>
                    <div class="mt-2 flex items-center justify-between">
                        <span class="text-lg font-bold text-indigo-600 price">${formatRupiah(product.price)}</span>
                        <span class="text-xs text-gray-500 reviews">${formatReviewCount(product.reviews)}</span>
                    </div>
                </div>
            `;
            cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    const filterProducts = (categoryId) => {
        const filteredProducts = categoryId === 'all'
            ? servicesData.products
            : servicesData.products.filter(p => p.category === categoryId);
        renderProductCards(filteredProducts);
    };

    const setupPriceCalculator = () => {
        const programSelect = document.getElementById('program-select');
        const durationSelect = document.getElementById('duration-select'); // Menggunakan ID yang benar
        const estimatedPriceDisplay = document.getElementById('estimated-price');

        if (!programSelect || !durationSelect || !estimatedPriceDisplay) return;

        programSelect.innerHTML = '<option value="">-- Pilih Program --</option>';
        servicesData.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            programSelect.appendChild(option);
        });

        programSelect.addEventListener('change', () => {
            const selectedProductId = programSelect.value;
            currentSelectedProgram = servicesData.products.find(p => p.id === selectedProductId);
            
            durationSelect.innerHTML = '<option value="">-- Pilih Durasi --</option>';
            durationSelect.disabled = true;
            estimatedPriceDisplay.textContent = formatRupiah(0);

            if (currentSelectedProgram && currentSelectedProgram.duration_options) {
                currentSelectedProgram.duration_options.forEach((option, index) => {
                    const durationOption = document.createElement('option');
                    durationOption.value = index;
                    durationOption.textContent = option.label;
                    durationSelect.appendChild(durationOption);
                });
                durationSelect.disabled = false;
            }
        });

        durationSelect.addEventListener('change', () => {
            if (!currentSelectedProgram) {
                estimatedPriceDisplay.textContent = formatRupiah(0);
                return;
            }
            const selectedDurationIndex = parseInt(durationSelect.value);
            const durationOption = currentSelectedProgram.duration_options[selectedDurationIndex];

            if (durationOption) {
                const calculatedPrice = currentSelectedProgram.base_price * durationOption.multiplier;
                estimatedPriceDisplay.textContent = formatRupiah(calculatedPrice);
            } else {
                estimatedPriceDisplay.textContent = formatRupiah(0);
            }
        });
    };

    const renderPricingCards = (packages) => {
        const pricingCardsContainer = document.getElementById('pricing-cards-container');
        if (!pricingCardsContainer || !packages) return;

        pricingCardsContainer.innerHTML = '';

        packages.forEach(pkg => {
            const highlightClass = pkg.highlight ? 'highlight' : '';
            const popularBadgeHtml = pkg.highlight ? '<span class="popular-badge">TERPOPULER!</span>' : '';
            const limitedStockHtml = pkg.limited_stock ? `
            ` : '';

            // Menggunakan kelas standar Tailwind untuk warna tombol, bukan string langsung dari JSON
            let subscribeButtonClasses = 'bg-blue-600 hover:bg-blue-700'; // Default button color
            if (pkg.highlight) {
                subscribeButtonClasses = 'bg-white text-blue-600 hover:bg-gray-200'; // White button for highlight card
            } else if (pkg.name === '1 Bulan') {
                subscribeButtonClasses = 'bg-blue-600 hover:bg-blue-700'; // Default blue for 1 Bulan
            } else if (pkg.name === '12 Bulan') {
                subscribeButtonClasses = 'bg-purple-600 hover:bg-purple-700'; // Purple for 12 Bulan
            }
            // Button color logic can be more sophisticated if needed, but this aligns with simplicity.


            const cardHtml = `
                <div class="pricing-card ${highlightClass}">
                    ${popularBadgeHtml}
                    <h3 class="package-name">${pkg.name}</h3>
                    <p class="package-tagline">${pkg.tagline}</p>
                    <div class="price-block">
                        <p class="original-price">${formatRupiah(pkg.original_price)}</p>
                        <p class="current-price">${formatRupiah(pkg.price)}</p>
                        <p class="per-unit-price">${pkg.per_unit_price}</p>
                    </div>
                    <ul class="features-list">
                        ${pkg.features.map(feature => `<li><span class="check-icon">✓</span>${feature}</li>`).join('')}
                    </ul>
                    <button class="${subscribeButtonClasses} text-white subscribe-btn">${pkg.button_text}</button>
                    ${limitedStockHtml}
                </div>
            `;
            pricingCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    };


    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const init = async () => {
        await fetchServicesData();

        renderCategoryFilters(servicesData.categories);
        const defaultCategory = servicesData.categories.find(cat => cat.id === 'data-science') ? 'data-science' : 'all';
        filterProducts(defaultCategory);

        setupPriceCalculator();
        renderPricingCards(servicesData.comparison_packages);

        console.log("EduLab Services Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabServicesPage.init);