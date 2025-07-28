const taglineElement = document.getElementById('tagline');
const taglines = [
    "There's no limit to where you can go.",
];
let taglineIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!taglineElement) {
        return;
    }

    const currentTagline = taglines[taglineIndex];

    if (taglines.length === 1 && !isDeleting && charIndex === currentTagline.length) {
        return;
    }

    if (isDeleting) {
        taglineElement.textContent = currentTagline.substring(0, charIndex - 1);
        charIndex--;
    } else {
        taglineElement.textContent = currentTagline.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentTagline.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        taglineIndex = (taglineIndex + 1) % taglines.length;
        setTimeout(() => typeEffect(), 500);
    }

    const typingSpeed = isDeleting ? 70 : 150;
    setTimeout(typeEffect, typingSpeed);
}

document.addEventListener('DOMContentLoaded', typeEffect);

function animateCounter(id, target, duration, isPercentage = false) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    let start = 0;
    const increment = target / (duration / 10);

    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = isPercentage ? target + '%' : target.toLocaleString();
            clearInterval(counter);
        } else {
            element.textContent = isPercentage ? Math.floor(start) + '%' : Math.floor(start).toLocaleString();
        }
    }, 10);
}

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'users-count') {
                animateCounter('users-count', 15000, 2000, false);
            } else if (entry.target.id === 'projects-count') {
                animateCounter('projects-count', 2500, 2000, false);
            } else if (entry.target.id === 'success-rate') {
                animateCounter('success-rate', 95, 2000, true);
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const usersCountElement = document.getElementById('users-count');
const projectsCountElement = document.getElementById('projects-count');
const successRateElement = document.getElementById('success-rate');

if (usersCountElement) observer.observe(usersCountElement);
if (projectsCountElement) observer.observe(projectsCountElement);
if (successRateElement) observer.observe(successRateElement);


const heroCtaScrollButton = document.getElementById('hero-cta-scroll');
if (heroCtaScrollButton) {
    heroCtaScrollButton.addEventListener('click', function(e) {
        e.preventDefault();
        const contentSection = document.getElementById('content-section');
        if (contentSection) {
            contentSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}