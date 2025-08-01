// assets/js/blog-scripts.js

const EduLabBlogPage = (() => {

    let blogData = {};
    let currentCategory = 'all';
    let searchTerm = '';
    let currentPage = 1;
    const articlesPerPage = 6; // Number of articles per page

    // --- Helper Functions ---
    const fetchBlogData = async () => {
        try {
            const response = await fetch('./assets/data/blog.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            blogData = await response.json();
            console.log("Blog data loaded:", blogData);
        } catch (error) {
            console.error("Could not fetch blog data:", error);
        }
    };

    const calculateReadTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const wordCount = text.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min baca`;
    };

    // --- Content Management System Sederhana ---

    // Render Category Filters
    const renderCategoryFilters = (categories) => {
        const filterContainer = document.getElementById('category-filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = `blog-filter-btn ${category.id === currentCategory ? 'active' : ''}`;
            button.dataset.category = category.id;
            button.textContent = category.name;
            filterContainer.appendChild(button);
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-filter-btn')) {
                document.querySelectorAll('.blog-filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.category;
                currentPage = 1; // Reset to first page on filter change
                applyFiltersAndSearch();
            }
        });
    };

    // Render Article List
    const renderArticles = (articles) => {
        const articleListContainer = document.getElementById('article-list-container');
        if (!articleListContainer) return;

        articleListContainer.innerHTML = '';
        if (articles.length === 0) {
            articleListContainer.innerHTML = '<p class="text-center text-gray-600 text-lg col-span-full">Tidak ada artikel yang ditemukan.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToDisplay = articles.slice(startIndex, endIndex);

        articlesToDisplay.forEach(article => {
            const readTime = calculateReadTime(article.content_full);
            const formattedDate = new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

            const articleCardHtml = `
                <div class="article-card">
                    <img src="${article.thumbnail}" alt="${article.title}">
                    <div class="article-card-content">
                        <p class="article-card-meta">
                            <span>Oleh ${article.author}</span> | 
                            <span>${formattedDate}</span> | 
                            <span>${readTime}</span>
                        </p>
                        <h3>${article.title}</h3>
                        <p class="preview">${article.content_preview}</p>
                        <div class="article-card-footer">
                            <a href="#" class="read-more-btn">Baca Selengkapnya</a>
                        </div>
                    </div>
                </div>
            `;
            articleListContainer.insertAdjacentHTML('beforeend', articleCardHtml);
        });
    };

    // Pagination
    const setupPagination = (filteredArticlesCount) => {
        const pageNumbersContainer = document.getElementById('page-numbers');
        const prevPageBtn = document.getElementById('prev-page-btn');
        const nextPageBtn = document.getElementById('next-page-btn');
        if (!pageNumbersContainer || !prevPageBtn || !nextPageBtn) return;

        const totalPages = Math.ceil(filteredArticlesCount / articlesPerPage);
        pageNumbersContainer.innerHTML = ''; // Clear previous page numbers

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number-btn ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.dataset.page = i;
            pageNumbersContainer.appendChild(pageButton);

            pageButton.addEventListener('click', (e) => {
                currentPage = parseInt(e.target.dataset.page);
                applyFiltersAndSearch();
            });
        }

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        prevPageBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                applyFiltersAndSearch();
            }
        };

        nextPageBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyFiltersAndSearch();
            }
        };
    };

    // Apply Filters & Search
    const applyFiltersAndSearch = () => {
        let filteredArticles = blogData.articles;

        // Apply category filter
        if (currentCategory !== 'all') {
            filteredArticles = filteredArticles.filter(article => article.category === currentCategory);
        }

        // Apply search term filter
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredArticles = filteredArticles.filter(article =>
                article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                article.author.toLowerCase().includes(lowerCaseSearchTerm) ||
                article.content_preview.toLowerCase().includes(lowerCaseSearchTerm) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            );
        }

        renderArticles(filteredArticles);
        setupPagination(filteredArticles.length);
    };

    // --- Search Functionality ---
    const setupSearch = () => {
        const searchInput = document.getElementById('blog-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            currentPage = 1; // Reset to first page on search
            applyFiltersAndSearch();
        });
    };

    // --- Main Initialization Function ---
    const init = async () => {
        await fetchBlogData();

        // Populate Hero Section
        const blogHeroTitle = document.getElementById('blog-hero-title');
        const blogHeroSubtitle = document.getElementById('blog-hero-subtitle');
        if (blogHeroTitle && blogData.hero_blog) {
            blogHeroTitle.textContent = blogData.hero_blog.title;
        }
        if (blogHeroSubtitle && blogData.hero_blog) {
            blogHeroSubtitle.textContent = blogData.hero_blog.subtitle;
        }

        renderCategoryFilters(blogData.categories);
        setupSearch();
        applyFiltersAndSearch(); // Initial render

        console.log("EduLab Blog Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabBlogPage.init);