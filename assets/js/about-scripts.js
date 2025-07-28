// assets/js/about-scripts.js

const EduLabAboutPage = (() => {

    let aboutData = {}; // To store data from about.json

    // --- Helper Functions ---
    const fetchAboutData = async () => {
        try {
            const response = await fetch('./assets/data/about.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            aboutData = await response.json();
            console.log("About data loaded:", aboutData);
        } catch (error) {
            console.error("Could not fetch about data:", error);
        }
    };

    const animateCounter = (element, targetValue, duration, suffix = '') => {
        if (!element) return;
        let start = 0;
        const increment = targetValue / (duration / 10);
        const counter = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
                element.textContent = targetValue.toLocaleString() + suffix;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(start).toLocaleString() + suffix;
            }
        }, 10);
    };

    // --- Company Story with Timeline ---
    const setupTimeline = () => {
        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer || !aboutData.timeline) return;

        timelineContainer.innerHTML = ''; // Clear placeholder
        aboutData.timeline.forEach((item, index) => {
            const timelineItemHtml = `
                <div class="timeline-item flex items-center justify-center mb-12">
                    <div class="timeline-item-content w-1/2 p-6 rounded-lg shadow-md bg-white text-gray-800">
                        <h3 class="text-xl font-bold mb-2">${item.year} - ${item.title}</h3>
                        <p class="text-gray-700">${item.description}</p>
                    </div>
                    <div class="timeline-item-dot bg-blue-500 border-4 border-white rounded-full flex-shrink-0"></div>
                    <div class="w-1/2"></div> </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', timelineItemHtml);
        });

        // Intersection Observer for timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        const observerOptions = {
            threshold: 0.5 // Trigger when 50% of the item is visible
        };

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => timelineObserver.observe(item));
    };

    // --- Team Member Cards ---
    const setupTeamMembers = () => {
        const teamCardsContainer = document.getElementById('team-cards-container');
        if (!teamCardsContainer || !aboutData.team_members) return;

        teamCardsContainer.innerHTML = '';
        aboutData.team_members.forEach(member => {
            const teamCardHtml = `
                <div class="team-card-container bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div class="team-card-inner">
                        <div class="team-card-front">
                            <img src="${member.image}" alt="${member.name}" class="w-32 h-32 rounded-full object-cover mb-4">
                            <h3 class="text-xl font-bold text-gray-800 mb-1">${member.name}</h3>
                            <p class="text-blue-600 font-semibold">${member.role}</p>
                            <p class="text-gray-600 mt-2 text-sm">${member.short_bio}</p>
                        </div>
                        <div class="team-card-back bg-blue-600 text-white p-6 rounded-xl">
                            <h3 class="text-2xl font-bold mb-2">${member.name}</h3>
                            <p class="text-lg mb-1">${member.role}</p>
                            <p class="text-sm leading-relaxed mb-4">${member.long_bio}</p>
                            <div class="team-card-social flex justify-center space-x-4">
                                ${member.social.linkedin ? `<a href="${member.social.linkedin}" target="_blank" class="hover:scale-110 transition-transform">LinkedIn</a>` : ''}
                                ${member.social.twitter ? `<a href="${member.social.twitter}" target="_blank" class="hover:scale-110 transition-transform">Twitter</a>` : ''}
                                </div>
                        </div>
                    </div>
                </div>
            `;
            teamCardsContainer.insertAdjacentHTML('beforeend', teamCardHtml);
        });
    };

    // --- Company Statistics ---
    const setupCompanyStats = () => {
        const statsContainer = document.getElementById('stats-about-container');
        if (!statsContainer || !aboutData.company_stats) return;

        statsContainer.innerHTML = '';
        aboutData.company_stats.forEach(stat => {
            const statCardHtml = `
                <div class="p-6 bg-white rounded-lg shadow-md text-center stats-card">
                    <p class="text-5xl font-extrabold text-blue-600 mb-2" id="${stat.id}">0${stat.suffix}</p>
                    <p class="text-lg font-semibold text-gray-700">${stat.label}</p>
                </div>
            `;
            statsContainer.insertAdjacentHTML('beforeend', statCardHtml);
        });

        // Intersection Observer for stats animation
        const statsToAnimate = aboutData.company_stats.map(stat => document.getElementById(stat.id)).filter(Boolean);
        const observerOptions = {
            threshold: 0.5
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statData = aboutData.company_stats.find(s => s.id === entry.target.id);
                    if (statData) {
                        animateCounter(entry.target, statData.target, 2000, statData.suffix); // 2000ms duration
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsToAnimate.forEach(element => statsObserver.observe(element));
    };

    // --- Company Values Section ---
    const setupCompanyValues = () => {
        const valuesContainer = document.getElementById('values-container');
        if (!valuesContainer || !aboutData.company_values) return;

        valuesContainer.innerHTML = '';
        aboutData.company_values.forEach(value => {
            const valueCardHtml = `
                <div class="value-card bg-white p-6 rounded-lg shadow-md">
                    <span class="value-icon">${value.icon}</span>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${value.title}</h3>
                    <p class="text-gray-600 value-short-desc mb-3">${value.short_desc}</p>
                    <div class="value-card-details hidden">
                        <p class="text-gray-700 text-sm mt-4 border-t pt-4">${value.long_desc}</p>
                    </div>
                    <button class="toggle-details-btn text-blue-600 hover:text-blue-800 font-semibold mt-2">
                        Baca Selengkapnya <span class="arrow-icon transition-transform duration-300">&rarr;</span>
                    </button>
                </div>
            `;
            valuesContainer.insertAdjacentHTML('beforeend', valueCardHtml);
        });

        // Progressive disclosure for values (similar to features section)
        const toggleButtons = document.querySelectorAll('#company-values .toggle-details-btn');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const valueCard = button.closest('.value-card');
                if (!valueCard) return;

                const detailsContainer = valueCard.querySelector('.value-card-details');
                const arrowIcon = button.querySelector('.arrow-icon');

                if (!detailsContainer) return;

                detailsContainer.classList.toggle('expanded');

                if (detailsContainer.classList.contains('expanded')) {
                    button.innerHTML = `Sembunyikan Detail <span class="arrow-icon transition-transform duration-300" style="transform: rotate(90deg);">&rarr;</span>`;
                    detailsContainer.style.height = detailsContainer.scrollHeight + 'px';
                } else {
                    button.innerHTML = `Baca Selengkapnya <span class="arrow-icon transition-transform duration-300" style="transform: rotate(0deg);">&rarr;</span>`;
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

    // --- Main Initialization Function ---
    const init = async () => {
        await fetchAboutData();

        // Populate Hero Section
        const aboutHeroTitle = document.getElementById('about-hero-title');
        const aboutHeroSubtitle = document.getElementById('about-hero-subtitle');
        if (aboutHeroTitle && aboutData.hero_about) {
            aboutHeroTitle.textContent = aboutData.hero_about.title;
        }
        if (aboutHeroSubtitle && aboutData.hero_about) {
            aboutHeroSubtitle.textContent = aboutData.hero_about.subtitle;
        }

        setupTimeline();
        setupCompanyStats();
        setupTeamMembers();
        setupCompanyValues();

        console.log("EduLab About Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabAboutPage.init);