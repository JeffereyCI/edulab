// assets/js/contact-scripts.js

let contactData = {};
let chatBotResponses = [];

const EduLabContactPage = (() => {

    const fetchContactData = async () => {
        try {
            const response = await fetch('./assets/data/contact.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            contactData = await response.json();
            console.log("Contact data loaded:", contactData);
        } catch (error) {
            console.error("Could not fetch contact data:", error);
        }
    };

    const setupContactForm = () => {
        const form = document.getElementById('contact-form');
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const charCountSpan = document.getElementById('message-char-count');
        const submitButton = document.getElementById('submit-button');

        const validateField = (inputElement, validator) => {
            const errorMessageSpan = inputElement.nextElementSibling;
            if (!errorMessageSpan || !errorMessageSpan.classList.contains('error-message')) return true;

            if (validator(inputElement.value)) {
                inputElement.classList.remove('border-red-500');
                inputElement.classList.add('border-gray-300');
                errorMessageSpan.classList.add('hidden');
                return true;
            } else {
                inputElement.classList.add('border-red-500');
                inputElement.classList.remove('border-gray-300');
                errorMessageSpan.classList.remove('hidden');
                return false;
            }
        };

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        const validateMessageLength = (message, maxLength) => {
            return message.length <= maxLength;
        };

        const updateCharCount = () => {
            const currentLength = messageInput.value.length;
            charCountSpan.textContent = currentLength;
            if (currentLength > 500) {
                charCountSpan.classList.add('text-red-600');
            } else {
                charCountSpan.classList.remove('text-red-600');
            }
        };

        const checkFormValidity = () => {
            const isNameValid = nameInput.value.trim() !== '';
            const isEmailValid = validateEmail(emailInput.value);
            const isSubjectValid = subjectInput.value.trim() !== '';
            const isMessageValid = messageInput.value.trim() !== '' && messageInput.value.length <= 500;

            submitButton.disabled = !(isNameValid && isEmailValid && isSubjectValid && isMessageValid);
        };

        nameInput.addEventListener('input', () => { validateField(nameInput, (val) => val.trim() !== ''); checkFormValidity(); });
        emailInput.addEventListener('input', () => { 
            const isValid = validateEmail(emailInput.value);
            const message = isValid ? '' : 'Format email tidak valid.';
            const errorMessageSpan = emailInput.nextElementSibling;
            if (errorMessageSpan) errorMessageSpan.textContent = message;
            validateField(emailInput, validateEmail);
            checkFormValidity(); 
        });
        subjectInput.addEventListener('input', () => { validateField(subjectInput, (val) => val.trim() !== ''); checkFormValidity(); });
        messageInput.addEventListener('input', () => { 
            updateCharCount(); 
            const isValid = validateMessageLength(messageInput.value, 500);
            const message = isValid ? '' : 'Pesan terlalu panjang (maks. 500 karakter).';
            const errorMessageSpan = messageInput.nextElementSibling.nextElementSibling;
            if (errorMessageSpan) errorMessageSpan.textContent = message;
            validateField(messageInput, (val) => val.trim() !== '' && val.length <= 500);
            checkFormValidity(); 
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (submitButton.disabled) {
                alert("Mohon lengkapi semua kolom dengan benar sebelum mengirim.");
                return;
            }
            alert('Pesan Anda telah terkirim! (Simulasi)');
            form.reset();
            charCountSpan.textContent = '0';
            submitButton.disabled = true;
            document.querySelectorAll('.error-message').forEach(span => span.classList.add('hidden'));
        });

        updateCharCount();
        checkFormValidity();
    };

    // Main Contact Info Render
    const renderMainContactInfo = () => {
        const contactInfoGrid = document.getElementById('contact-info-grid');
        if (!contactInfoGrid || !contactData.contact_info_main) return;

        contactInfoGrid.innerHTML = '';

        const info = contactData.contact_info_main;

        const contactCardsData = [
            { 
                icon_svg: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.547-1.262.378A10.714 10.714 0 0110.5 20.25c-2.228 0-4.343-.679-6.158-1.868a10.714 10.714 0 01-3.262-4.02C1.522 10.72 1.25 8.79 1.25 6.75H2.25z'></path></svg>",
                title: "Telepon",
                content: info.phone,
                link: `tel:${info.phone}`
            },
            {
                icon_svg: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.902l-5.462 3.854a2.25 2.25 0 01-2.614 0L2.506 8.495a2.25 2.25 0 01-1.07-1.902M1.5 6.75a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6.75m-19.5 0V7.5a2.25 2.25 0 002.25 2.25h14.5a2.25 2.25 0 002.25-2.25V6.75m-19.5 0A2.25 2.25 0 004.5 4.5h16.5A2.25 2.25 0 0122.5 6.75'/></svg>",
                title: "Email",
                content: info.email,
                link: `mailto:${info.email}`
            },
            {
                icon_svg: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'></path><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'></path></svg>",
                title: "Alamat",
                content: info.address_short,
                link: `googleusercontent.com/maps.google.com/01${encodeURIComponent(info.address_short)}`
            },
            {
                icon_svg: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'></path></svg>",
                title: "Jam Kerja",
                content: info.working_hours,
                link: null
            }
        ];

        contactCardsData.forEach(card => {
            const cardHtml = `
                <div class="contact-info-card">
                    <div class="icon-wrapper">
                        ${card.icon_svg}
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${card.title}</h3>
                    <p class="text-gray-700">${card.content}</p>
                    ${card.link ? `<a href="${card.link}" class="text-blue-600 hover:underline mt-2 inline-block">Lihat Detail</a>` : ''}
                </div>
            `;
            contactInfoGrid.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Social Media Links (as a separate card in the grid)
        if (info.social_media && info.social_media.length > 0) {
            const socialLinksHtml = info.social_media.map(social => `
                <a href="${social.url}" target="_blank" class="hover:text-blue-600 transition-colors">
                    ${social.icon_svg}
                </a>
            `).join('');

            const socialCardHtml = `
                <div class="contact-info-card">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Ikuti Kami</h3>
                    <div class="social-link-wrapper">
                        ${socialLinksHtml}
                    </div>
                </div>
            `;
            contactInfoGrid.insertAdjacentHTML('beforeend', socialCardHtml);
        }
    };

    // Google Maps & Office Locations (Hanya merender kartu, peta ditangani iframe HTML)
    const setupOfficeLocations = () => {
        if (!contactData.office_locations) {
            console.warn("Office locations data missing. Cannot setup office info cards.");
            return;
        }

        const officeInfoCardsContainer = document.getElementById('office-info-cards');
        if (!officeInfoCardsContainer) return;

        officeInfoCardsContainer.innerHTML = '';

        contactData.office_locations.forEach(location => {
            const officeCardHtml = `
                <div class="office-info-card">
                    <h3 class="font-bold text-xl">${location.title}</h3>
                    <p class="text-gray-700">${location.address}</p>
                    <p class="text-gray-700">Telepon: <a href="tel:${location.phone}" class="text-blue-600 hover:underline">${location.phone}</a></p>
                    <p class="text-gray-700">Email: <a href="mailto:${location.email}" class="text-blue-600 hover:underline">${location.email}</a></p>
                </div>
            `;
            officeInfoCardsContainer.insertAdjacentHTML('beforeend', officeCardHtml);
        });

        // Update main iframe src with office locations
        const gmapCanvas = document.getElementById('gmap_canvas');
        if (gmapCanvas && contactData.office_locations.length > 0) {
            // Build a Google Maps Embed API URL with multiple markers
            let embedSrc = "https://www.google.com/maps/embed/v1/place?";
            embedSrc += `q=`; // Start query
            contactData.office_locations.forEach((loc, index) => {
                embedSrc += `${loc.lat},${loc.lng}`; // Just coordinates for basic embed
                if (index < contactData.office_locations.length - 1) {
                    embedSrc += "|"; // Separator for multiple markers in place mode
                }
            });
            embedSrc += `&zoom=12&key=YOUR_API_KEY`; // Add zoom and your API key
            gmapCanvas.src = embedSrc;
        }
    };

    // Live Chat Simulation
    const setupLiveChat = () => {
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');
        const chatCloseBtn = document.getElementById('chat-close-btn');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');

        if (!chatButton || !chatWindow || !chatCloseBtn || !chatMessages || !chatInput || !contactData.chat_bot_responses) {
            console.warn("Live chat elements or data not found. Live chat will not run.");
            return;
        }

        chatBotResponses = contactData.chat_bot_responses;

        const addMessage = (sender, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = sender === 'user' ? 'chat-message-user' : '';
            messageDiv.innerHTML = `<span class="chat-bubble ${sender}">${text}</span>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const getBotResponse = (userMessage) => {
            const cleanMessage = userMessage.toLowerCase().trim();
            for (const item of chatBotResponses) {
                if (Array.isArray(item.trigger)) {
                    if (item.trigger.some(trigger => cleanMessage.includes(trigger))) {
                        return item.response;
                    }
                } else if (cleanMessage.includes(item.trigger)) {
                    return item.response;
                }
            }
            const defaultResponse = chatBotResponses.find(item => item.trigger === 'default');
            return defaultResponse ? defaultResponse.response : "Maaf, saya tidak mengerti.";
        };

        chatButton.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                addMessage('bot', 'Halo! Selamat datang di EduBot. Ada yang bisa kami bantu hari ini?');
                chatInput.focus();
            }
        });

        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            chatMessages.innerHTML = '';
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                const userMessage = chatInput.value.trim();
                addMessage('user', userMessage);
                chatInput.value = '';

                setTimeout(() => {
                    const botResponse = getBotResponse(userMessage);
                    addMessage('bot', botResponse);
                }, 500);
            }
        });
    };

    // FAQ Accordion with Search
    const setupFaqAccordion = () => {
        const faqContainer = document.getElementById('faq-accordion-container');
        const searchInput = document.getElementById('faq-search-input');
        if (!faqContainer || !searchInput || !contactData.faq_items) {
            console.warn("FAQ elements or data not found. FAQ will not run.");
            return;
        }

        const renderFaqItems = (faqItems) => {
            faqContainer.innerHTML = '';
            if (faqItems.length === 0) {
                faqContainer.innerHTML = '<p class="text-center text-gray-600 text-lg">Tidak ada hasil ditemukan.</p>';
                return;
            }

            faqItems.forEach((faq, index) => {
                const faqItemHtml = `
                    <div class="faq-item">
                        <button class="faq-question">
                            <span>${faq.question}</span>
                            <svg class="w-5 h-5 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `;
                faqContainer.insertAdjacentHTML('beforeend', faqItemHtml);
            });

            document.querySelectorAll('.faq-question').forEach(questionBtn => {
                questionBtn.addEventListener('click', () => {
                    const faqAnswer = questionBtn.nextElementSibling;
                    const arrowIcon = questionBtn.querySelector('.arrow-icon');
                    
                    document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                        if (openAnswer !== faqAnswer) {
                            openAnswer.classList.remove('open');
                            openAnswer.style.maxHeight = '0';
                            openAnswer.previousElementSibling.classList.remove('active');
                            openAnswer.previousElementSibling.querySelector('.arrow-icon').style.transform = 'rotate(0deg)';
                        }
                    });

                    faqAnswer.classList.toggle('open');
                    questionBtn.classList.toggle('active');

                    if (faqAnswer.classList.contains('open')) {
                        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                        arrowIcon.style.transform = 'rotate(180deg)';
                    } else {
                        faqAnswer.style.maxHeight = '0';
                        arrowIcon.style.transform = 'rotate(0deg)';
                    }
                });
            });
        };

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const filteredFaqs = contactData.faq_items.filter(faq => {
                return faq.question.toLowerCase().includes(searchTerm) ||
                       faq.answer.toLowerCase().includes(searchTerm) ||
                       (faq.keywords && faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)));
            });
            renderFaqItems(filteredFaqs);
        });

        renderFaqItems(contactData.faq_items);
    };

    // Main Initialization Function
    const init = async () => {
        await fetchContactData();

        const contactHeroTitle = document.getElementById('contact-hero-title');
        const contactHeroSubtitle = document.getElementById('contact-hero-subtitle');
        if (contactHeroTitle && contactData.hero_contact) {
            contactHeroTitle.textContent = contactData.hero_contact.title;
        }
        if (contactHeroSubtitle && contactData.hero_contact) {
            contactHeroSubtitle.textContent = contactData.hero_contact.subtitle;
        }

        renderMainContactInfo(); // Ini akan merender info kontak utama dalam grid
        setupContactForm();
        setupOfficeLocations(); // Ini sekarang hanya merender kartu info kantor, iframe di HTML
        setupLiveChat();
        setupFaqAccordion();

        console.log("EduLab Contact Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabContactPage.init);