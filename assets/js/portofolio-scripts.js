// assets/js/portfolio-scripts.js

const EduLabPortfolioPage = (() => {

    let portfolioData = {};
    let currentGalleryImages = []; // Stores images for current lightbox
    let currentImageIndex = 0;

    const fetchPortfolioData = async () => {
        try {
            const response = await fetch('./assets/data/portofolio.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            portfolioData = await response.json();
            console.log("Portfolio data loaded:", portfolioData);
        } catch (error) {
            console.error("Could not fetch portfolio data:", error);
        }
    };

    // --- Project Showcase (Filterable Grid) ---
    const renderProjectFilters = (categories) => {
        const filterContainer = document.getElementById('project-filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `project-filter-btn ${category.id === 'all' ? 'active' : ''}`;
            button.dataset.filter = category.id;
            button.textContent = category.name;
            filterContainer.appendChild(button);
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-filter-btn')) {
                document.querySelectorAll('.project-filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                filterProjects(e.target.dataset.filter);
            }
        });
    };

    const renderProjectCards = (projects) => {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = '';
        if (projects.length === 0) {
            portfolioGrid.innerHTML = '<p class="text-center text-gray-600 text-lg col-span-full">Tidak ada proyek yang ditemukan untuk kategori ini.</p>';
            return;
        }

        projects.forEach(project => {
            const cardHtml = `
                <div class="project-card" data-project-id="${project.id}">
                    <img src="${project.thumbnail_image}" alt="${project.title}">
                    <div class="project-card-content">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${project.title}</h3>
                        <p class="text-gray-700 text-sm mb-4">${project.short_description}</p>
                        <button class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 w-full view-details-btn">Lihat Detail</button>
                    </div>
                </div>
            `;
            portfolioGrid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Attach event listeners to "View Detail" buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = e.target.closest('.project-card').dataset.projectId;
                showProjectDetailModal(projectId);
            });
        });
    };

    const filterProjects = (filterCategory) => {
        const filteredProjects = filterCategory === 'all'
            ? portfolioData.projects
            : portfolioData.projects.filter(p => p.type === filterCategory || p.industry.toLowerCase().replace(/\s/g, '-') === filterCategory);
        renderProjectCards(filteredProjects);
    };

    // --- Project Detail Modal ---
    const projectDetailModal = document.getElementById('project-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const showProjectDetailModal = (projectId) => {
        const project = portfolioData.projects.find(p => p.id === projectId);
        if (!project || !projectDetailModal) return;

        document.getElementById('modal-project-title').textContent = project.title;
        document.getElementById('modal-project-long-desc').textContent = project.long_description;

        // Render gallery images within the modal
        const modalGalleryContainer = document.getElementById('modal-gallery-container');
        if (modalGalleryContainer) {
            modalGalleryContainer.innerHTML = '';
            project.gallery_images.forEach((imgSrc, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = `${project.title} screenshot ${index + 1}`;
                imgElement.className = 'w-full h-40 object-cover rounded-md cursor-pointer hover:opacity-80 transition';
                imgElement.dataset.originalSrc = imgSrc; // Store original for lightbox
                modalGalleryContainer.appendChild(imgElement);

                imgElement.addEventListener('click', () => {
                    currentGalleryImages = project.gallery_images; // Set global gallery images for lightbox
                    currentImageIndex = index;
                    showLightbox(imgSrc);
                });
            });
        }

        // Render client testimonial
        const testimonialQuote = document.getElementById('testimonial-quote');
        const testimonialClientInfo = document.getElementById('testimonial-client-info');
        if (project.client_testimonial && testimonialQuote && testimonialClientInfo) {
            testimonialQuote.textContent = `"${project.client_testimonial.quote}"`;
            testimonialClientInfo.textContent = `- ${project.client_testimonial.client_name}, ${project.client_testimonial.client_role}`;
            document.getElementById('modal-client-testimonial').classList.remove('hidden');
        } else {
            document.getElementById('modal-client-testimonial').classList.add('hidden');
        }

        projectDetailModal.classList.remove('hidden');
        // Add a class for CSS transition to trigger entry animation
        setTimeout(() => projectDetailModal.classList.add('active'), 10); 
    };

    const hideProjectDetailModal = () => {
        if (!projectDetailModal) return;
        projectDetailModal.classList.remove('active');
        setTimeout(() => projectDetailModal.classList.add('hidden'), 300); // Hide after transition
    };

    // Close modal on button click or outside click
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideProjectDetailModal);
    }
    if (projectDetailModal) {
        projectDetailModal.addEventListener('click', (e) => {
            if (e.target === projectDetailModal) { // Only close if clicking on the overlay
                hideProjectDetailModal();
            }
        });
    }

    // --- Lightbox Gallery ---
    const imageLightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');

    const showLightbox = (imgSrc) => {
        if (!imageLightbox || !lightboxImage) return;
        lightboxImage.src = imgSrc;
        imageLightbox.classList.remove('hidden');
        setTimeout(() => imageLightbox.classList.add('active'), 10);
    };

    const hideLightbox = () => {
        if (!imageLightbox) return;
        imageLightbox.classList.remove('active');
        setTimeout(() => imageLightbox.classList.add('hidden'), 300);
    };

    const navigateLightbox = (direction) => {
        if (currentGalleryImages.length === 0) return;

        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = currentGalleryImages.length - 1;
        } else if (currentImageIndex >= currentGalleryImages.length) {
            currentImageIndex = 0;
        }
        lightboxImage.src = currentGalleryImages[currentImageIndex];
    };

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', hideLightbox);
    if (imageLightbox) {
        imageLightbox.addEventListener('click', (e) => {
            if (e.target === imageLightbox) { // Only close if clicking on the overlay
                hideLightbox();
            }
        });
    }
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

    // --- Main Initialization Function ---
    const init = async () => {
        await fetchPortfolioData();

        // Populate Hero Section
        const portfolioHeroTitle = document.getElementById('portfolio-hero-title');
        const portfolioHeroSubtitle = document.getElementById('portfolio-hero-subtitle');
        if (portfolioHeroTitle && portfolioData.hero_portfolio) {
            portfolioHeroTitle.textContent = portfolioData.hero_portfolio.title;
        }
        if (portfolioHeroSubtitle && portfolioData.hero_portfolio) {
            portfolioHeroSubtitle.textContent = portfolioData.hero_portfolio.subtitle;
        }

        renderProjectFilters(portfolioData.project_categories);
        renderProjectCards(portfolioData.projects); // Initial render of all projects

        console.log("EduLab Portfolio Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabPortfolioPage.init);