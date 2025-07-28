// assets/js/about-scripts.js

const EduLabAboutPage = (() => {

    let aboutData = {};

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

    const setupTimeline = () => {
        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer || !aboutData.timeline) return;

        timelineContainer.innerHTML = '';
        aboutData.timeline.forEach((item, index) => {
            const timelineItemHtml = `
                <div class="timeline-item flex items-center justify-center mb-12">
                    <div class="timeline-item-content w-1/2 p-6 rounded-lg shadow-md bg-white text-gray-800">
                        <h3 class="text-xl font-bold mb-2">${item.year} - ${item.title}</h3>
                        <p class="text-gray-700">${item.description}</p>
                    </div>
                    <div class="timeline-item-dot bg-blue-500 border-4 border-white rounded-full flex-shrink-0"></div>
                    <div class="w-1/2"></div>
                </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', timelineItemHtml);
        });

        const timelineItems = document.querySelectorAll('.timeline-item');
        const observerOptions = {
            threshold: 0.5
        };

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => timelineObserver.observe(item));
    };

    const setupTeamMembers = () => {
        const teamCardsContainer = document.getElementById('team-cards-container');
        if (!teamCardsContainer || !aboutData.team_members || aboutData.team_members.length === 0) {
            return;
        }

        teamCardsContainer.innerHTML = '';
        // Jika hanya 1 anggota tim, pastikan dia tetap di tengah dengan justify-self-center
        const teamMemberClass = aboutData.team_members.length === 1 ? 'justify-self-center' : '';

        aboutData.team_members.forEach(member => {
            const teamCardHtml = `
                <div class="team-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${teamMemberClass}">
                    <img src="${member.image}" alt="${member.name}" class="w-32 h-32 rounded-full object-cover mb-4">
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${member.name}</h3>
                    <p class="role text-blue-600 font-semibold">${member.role}</p>
                    <p class="bio text-gray-600 mt-2 text-sm">${member.short_bio}</p>
                    <div class="social-links mt-4 flex justify-center space-x-4">
                        ${member.social && member.social.linkedin ? `<a href="${member.social.linkedin}" target="_blank" class="hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.565c0-1.352-.027-3.085-1.875-3.085-1.875 0-2.167 1.47-2.167 3.003v5.647H9.288V9.18h3.415v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.467v6.009zM7.229 7.48a2.585 2.585 0 110-5.17 2.585 2.585 0 010 5.17zm3.554 12.972H7.229V9.18h3.554v11.272zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg></a>` : ''}
                        ${member.social && member.social.twitter ? `<a href="${member.social.twitter}" target="_blank" class="hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M22.46 6c-.8.36-1.64.6-2.5.71a4.36 4.36 0 00-7.39-3.95 4.36 4.36 0 00-3.95 7.39c-2.88-.13-5.5-1.53-7.24-4.04a4.36 4.36 0 00.5 5.92c-.67-.01-1.3-.18-1.85-.5a4.36 4.36 0 001.76 5.48c-.64.01-1.25-.09-1.8-.32a4.36 4.36 0 003.58 4.29c-.61.16-1.25.21-1.9.08a4.36 4.36 0 004.07 3c-3.15 2.47-7.1.33-8.8-.94a4.36 4.36 0 00.5 5.92c-.67-.01-1.3-.18-1.85-.5a4.36 4.36 0 001.76 5.48c-.64.01-1.25-.09-1.8-.32a4.36 4.36 0 003.58 4.29c-.61.16-1.25.21-1.9.08a4.36 4.36 0 004.07 3c-3.15 2.47-7.1.33-8.8-.94Z"></path></svg></a>` : ''}
                        ${member.social && member.social.instagram ? `<a href="${member.social.instagram}" target="_blank" class="hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2A4.8 4.8 0 004.8 7.6v8.8a4.8 4.8 0 002.8 2.8h8.8a4.8 4.8 0 002.8-2.8V7.6a4.8 4.8 0 00-2.8-2.8H7.6zm9.4 1.2c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3.6-1.3 1.3-1.3 1.3.6 1.3 1.3zm-5 2.8c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm0 1.5c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.9-2.9 2.9-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9z"></path></svg></a>` : ''}
                    </div>
                </div>
            `;
            teamCardsContainer.insertAdjacentHTML('beforeend', teamCardHtml);
        });
    };

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

        const statsToAnimate = aboutData.company_stats.map(stat => document.getElementById(stat.id)).filter(Boolean);
        const observerOptions = {
            threshold: 0.5
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statData = aboutData.company_stats.find(s => s.id === entry.target.id);
                    if (statData) {
                        animateCounter(entry.target, statData.target, 2000, statData.suffix);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsToAnimate.forEach(element => statsObserver.observe(element));
    };

    const setupCompanyValues = () => {
        const valuesContainer = document.getElementById('values-container');
        if (!valuesContainer || !aboutData.company_values) return;

        valuesContainer.innerHTML = '';
        aboutData.company_values.forEach(value => {
            const valueCardHtml = `
                <div class="value-card bg-white p-6 rounded-lg shadow-md">
                    <div class="value-icon-placeholder ${value.icon_class}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"></svg>
                    </div>
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

    const init = async () => {
        await fetchAboutData();

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