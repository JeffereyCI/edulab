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
            // Menggunakan kelas untuk tab filter yang baru
            button.className = `category-tab-btn ${category.id === 'data-science' ? 'active' : ''}`; // Set 'data-science' as default active
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
        return `${new Intl.NumberFormat('en-US').format(count)} review`; // Format like "50,568 review"
    };

    // Helper untuk merender rating bintang sederhana (sesuai komponen catalog-card)
    const renderSimpleStarRating = (rating) => {
        // Karena komponen hanya menampilkan "⭐ 0", kita bisa sederhanakan atau tampilkan rating numerik
        // Untuk konsisten dengan "⭐ 0" dari komponen:
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
            // Logika untuk menampilkan/menyembunyikan badge dan kelas warnanya
            const badgeClass = product.badge ? '' : 'hidden'; // Jika ada badge, jangan hidden
            let badgeBgClass = 'bg-yellow-400'; // Default warna badge
            if (product.badge === 'Bestseller') {
                badgeBgClass = 'bg-indigo-600'; // Contoh warna berbeda untuk Bestseller
            } else if (product.badge === 'Premium') {
                badgeBgClass = 'bg-green-600'; // Contoh warna berbeda untuk Premium
            }

            // Menggunakan struktur catalog-card yang Anda berikan
            const cardHtml = `
                <div class="product-card shadow-lg rounded-xl border border-gray-200 p-4 transition hover:shadow-xl" data-category="${product.category}">
                    <img class="w-full h-40 object-cover rounded-md mb-3" src="${product.image}" alt="${product.title}">
                    <div class="flex items-center justify-between">
                        <span class="text-xs ${badgeBgClass} text-white font-semibold rounded px-2 py-1 badge ${badgeClass}">${product.badge}</span>
                        <span class="text-sm font-semibold text-gray-700 rating">${renderSimpleStarRating(product.rating)}</span>
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
        const durationSelect = document.getElementById('duration-select');
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

    const renderComparisonTable = (packages) => {
        const tableBody = document.getElementById('comparison-table-body');
        const tableHeadRow = document.querySelector('#comparison-table thead tr');

        if (!tableBody || !tableHeadRow) return;

        while (tableHeadRow.children.length > 1) {
            tableHeadRow.removeChild(tableHeadRow.lastChild);
        }
        tableBody.innerHTML = '';

        packages.forEach(pkg => {
            const th = document.createElement('th');
            th.className = `py-4 px-6 border-b text-gray-700 font-semibold text-lg text-center ${pkg.highlight ? 'comparison-highlight' : ''}`;
            th.textContent = pkg.name;
            tableHeadRow.appendChild(th);
        });

        const allFeatures = new Set();
        packages.forEach(pkg => {
            pkg.features.forEach(feature => allFeatures.add(feature));
        });

        allFeatures.forEach(feature => {
            const tr = document.createElement('tr');
            const featureTd = document.createElement('td');
            featureTd.className = 'py-4 px-6 border-b';
            featureTd.textContent = feature;
            tr.appendChild(featureTd);

            packages.forEach(pkg => {
                const td = document.createElement('td');
                td.className = 'py-4 px-6 border-b';
                if (pkg.features.includes(feature)) {
                    td.innerHTML = '<span class="text-green-500 font-bold">✓</span>';
                } else {
                    td.innerHTML = '<span class="text-red-500">✗</span>';
                }
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
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
        // Default filter to "Data Science" as per reference, if it exists
        const defaultCategory = servicesData.categories.find(cat => cat.id === 'data-science') ? 'data-science' : 'all';
        filterProducts(defaultCategory); // Initial render with default category

        setupPriceCalculator();

        renderComparisonTable(servicesData.comparison_packages);

        console.log("EduLab Services Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabServicesPage.init);