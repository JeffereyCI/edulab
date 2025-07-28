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
        if (!form) {
            console.warn("Contact form element not found. Skipping form setup.");
            return;
        }

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const charCountSpan = document.getElementById('message-char-count');
        const submitButton = document.getElementById('submit-button');

        if (!nameInput || !emailInput || !subjectInput || !messageInput || !charCountSpan || !submitButton) {
            console.warn("One or more contact form input elements not found. Skipping form setup.");
            return;
        }

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

    const renderMainContactInfo = () => {
        const contactInfoGrid = document.getElementById('contact-info-grid');
        if (!contactInfoGrid || !contactData.contact_info_main || !contactData.contact_info_main.main_contact_cards) return;

        contactInfoGrid.innerHTML = '';

        const info = contactData.contact_info_main;

        contactData.contact_info_main.main_contact_cards.forEach(card => {
            const cardHtml = `
                <div class="contact-info-card">
                    <div class="icon-wrapper">
                        <img src="${card.icon_url}" alt="${card.title}" class="w-10 h-10 rounded-full">
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${card.title}</h3>
                    <p class="text-gray-700">${card.content}</p>
                    ${card.link ? `<a href="${card.link}" class="text-blue-600 hover:underline mt-2 inline-block">Lihat Detail</a>` : ''}
                </div>
            `;
            contactInfoGrid.insertAdjacentHTML('beforeend', cardHtml);
        });

        if (info.social_media && info.social_media.length > 0) {
            const socialLinksHtml = info.social_media.map(social => `
                <a href="${social.url}" target="_blank" class="hover:text-blue-600 transition-colors">
                    <img src="${social.icon_url}" alt="${social.platform}" class="w-6 h-6 rounded-full">
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

    const setupOfficeLocations = () => {
        const officeInfoCardsContainer = document.getElementById('office-info-cards');
        const gmapCanvas = document.getElementById('gmap_canvas');
        
        if (!contactData.office_locations || !gmapCanvas) {
            console.warn("Office locations data or map iframe not found. Skipping map/office info setup.");
            return;
        }

        if (officeInfoCardsContainer) {
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
        }
    };

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
                            <img src="https://via.placeholder.com/20/0000FF/FFFFFF?text=V" alt="Arrow" class="w-5 h-5 arrow-icon">
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

        renderMainContactInfo();
        setupContactForm();
        setupOfficeLocations();
        setupLiveChat();
        setupFaqAccordion();

        console.log("EduLab Contact Page scripts initialized.");
    };

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EduLabContactPage.init);