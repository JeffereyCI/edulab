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
                            <div class="social-share-links">
                                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" title="Bagikan ke Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.633 9.176 8.438 9.998V14.88h-2.54V12h2.54V9.75c0-2.502 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195V8.5h-1.229c-1.246 0-1.637.77-1.637 1.562V12h2.773l-.443 2.88h-2.33V22c4.805-.822 8.438-5.007 8.438-9.998C22 6.477 17.523 2 12 2z"></path></svg>
                                </a>
                                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" target="_blank" title="Bagikan ke Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M22.46 6c-.8.36-1.64.6-2.5.71a4.36 4.36 0 00-7.39-3.95 4.36 4.36 0 00-3.95 7.39c-2.88-.13-5.5-1.53-7.24-4.04a4.36 4.36 0 00.5 5.92c-.67-.01-1.3-.18-1.85-.5a4.36 4.36 0 001.76 5.48c-.64.01-1.25-.09-1.8-.32a4.36 4.36 0 003.58 4.29c-.61.16-1.25.21-1.9.08a4.36 4.36 0 004.07 3c-3.15 2.47-7.1.33-8.8-.94a4.36 4.36 0 00.5 5.92c-.67-.01-1.3-.18-1.85-.5a4.36 4.36 0 001.76 5.48c-.64.01-1.25-.09-1.8-.32a4.36 4.36 0 003.58 4.29c-.61.16-1.25.21-1.9.08a4.36 4.36 0 004.07 3c-3.15 2.47-7.1.33-8.8-.94Z"/></svg>
                                </a>
                                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}" target="_blank" title="Bagikan ke LinkedIn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.565c0-1.352-.027-3.085-1.875-3.085-1.875 0-2.167 1.47-2.167 3.003v5.647H9.288V9.18h3.415v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.467v6.009zM7.229 7.48a2.585 2.585 0 110-5.17 2.585 2.585 0 010 5.17zm3.554 12.972H7.229V9.18h3.554v11.272zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/></svg>
                                </a>
                            </div>
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