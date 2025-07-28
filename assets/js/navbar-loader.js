const NAV_COMPONENT_PATH = './assets/components/navbar.html';

let lastScrollTop = 0;
let mainNavbarElement = null;

const loadHtmlComponent = async (placeholderId, componentPath) => {
    const placeholderElement = document.getElementById(placeholderId);
    if (!placeholderElement) {
        console.error(`Placeholder element with ID '${placeholderId}' not found. Cannot load navbar.`);
        return;
    }

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
        }
        const htmlContent = await response.text();
        placeholderElement.innerHTML = htmlContent;

        mainNavbarElement = document.getElementById('main-navbar');
        
        setupMobileMenu();
        setupHideOnScroll();
        
    } catch (error) {
        console.error(`Error loading component '${componentPath}':`, error);
    }
};

const setupMobileMenu = () => {
    const menuToggleButton = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggleButton && mobileMenu) {
        menuToggleButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
};

const setupHideOnScroll = () => {
    if (!mainNavbarElement) return;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > mainNavbarElement.offsetHeight) {
            if (currentScroll > lastScrollTop) {
                mainNavbarElement.classList.add('-translate-y-full');
            } else {
                mainNavbarElement.classList.remove('-translate-y-full');
            }
        } else {
            mainNavbarElement.classList.remove('-translate-y-full');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadHtmlComponent('navbar-placeholder', NAV_COMPONENT_PATH);
});