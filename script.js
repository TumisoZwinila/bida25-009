// ========== SLIDESHOW FUNCTIONALITY with TOUCH SUPPORT ==========
let slideIndex = 0;
let slideshowInterval;
let touchStartX = 0;
let touchEndX = 0;

function showSlides() {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    
    if (dots.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add("active");
        }
    }
    
    slideshowInterval = setTimeout(showSlides, 4000);
}

function startSlideshow() {
    if (document.getElementsByClassName("slide").length > 0) {
        showSlides();
        // Add touch support for mobile
        addTouchSupport();
    }
}

// TOUCH SUPPORT FOR MOBILE SLIDESHOW
function addTouchSupport() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        changeSlide(1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        changeSlide(-1);
    }
}

function changeSlide(n) {
    clearTimeout(slideshowInterval);
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    slideIndex += n;
    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slideIndex < 1) { slideIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    
    if (dots.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add("active");
        }
    }
    
    slideshowInterval = setTimeout(showSlides, 4000);
}

function currentSlide(n) {
    clearTimeout(slideshowInterval);
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    slideIndex = n;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
    
    slideshowInterval = setTimeout(showSlides, 4000);
}

// ========== MOBILE MENU FUNCTIONS ==========
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
        
        // Prevent body scroll when menu is open on mobile
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (navMenu) {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

// ========== SEARCH & FILTER FUNCTIONS ==========

// For index.html - Search across all listings (redirects to listings page with search params)
function performSearch() {
    const district = document.getElementById('searchDistrict')?.value.toLowerCase() || '';
    const landType = document.getElementById('searchType')?.value || '';
    const priceRange = document.getElementById('searchPrice')?.value || 'any';
    
    // Store search parameters in sessionStorage
    sessionStorage.setItem('searchDistrict', district);
    sessionStorage.setItem('searchType', landType);
    sessionStorage.setItem('searchPrice', priceRange);
    
    // Redirect to listings page
    window.location.href = 'listings.html';
}

// For listings.html - Filter by location only
function filterListingsByLocation() {
    const locationInput = document.getElementById('filterLocationInput');
    const locationFilter = locationInput ? locationInput.value.toLowerCase().trim() : '';
    const listings = document.querySelectorAll('#listingsContainer .listing-card');
    
    let visibleCount = 0;
    
    listings.forEach(listing => {
        const locationText = listing.querySelector('p') ? listing.querySelector('p').textContent.toLowerCase() : '';
        const titleText = listing.querySelector('h3') ? listing.querySelector('h3').textContent.toLowerCase() : '';
        
        if (locationFilter === '' || locationText.includes(locationFilter) || titleText.includes(locationFilter)) {
            listing.style.display = 'block';
            visibleCount++;
        } else {
            listing.style.display = 'none';
        }
    });
    
    const resultsMsg = document.getElementById('resultsCount');
    if (resultsMsg) {
        if (visibleCount === 0) {
            resultsMsg.innerHTML = '❌ No properties found. Try a different location!';
            resultsMsg.style.color = '#e74c3c';
        } else {
            resultsMsg.innerHTML = `✅ Found ${visibleCount} property${visibleCount !== 1 ? 's' : ''}`;
            resultsMsg.style.color = '#8b7355';
        }
    }
}

// For listings.html - Advanced search (district, type, price)
function applyAdvancedSearch(district, landType, priceRange) {
    const listings = document.querySelectorAll('#listingsContainer .listing-card');
    let visibleCount = 0;
    
    listings.forEach(listing => {
        let show = true;
        
        const locationText = listing.querySelector('p') ? listing.querySelector('p').textContent.toLowerCase() : '';
        const titleText = listing.querySelector('h3') ? listing.querySelector('h3').textContent.toLowerCase() : '';
        
        const priceMatch = locationText.match(/P([\d,]+)/);
        let price = 0;
        if (priceMatch) {
            price = parseInt(priceMatch[1].replace(/,/g, ''));
        }
        
        if (district && district !== '' && !locationText.includes(district) && !titleText.includes(district)) {
            show = false;
        }
        
        if (landType && landType !== '' && show) {
            if (!titleText.includes(landType.toLowerCase())) {
                show = false;
            }
        }
        
        if (priceRange && priceRange !== 'any' && show) {
            if (priceRange === '1000001+') {
                if (price < 1000001) show = false;
            } else {
                const [min, max] = priceRange.split('-');
                if (min && max && (price < parseInt(min) || price > parseInt(max))) {
                    show = false;
                } else if (min && !max && priceRange !== 'any') {
                    if (price < parseInt(min)) show = false;
                }
            }
        }
        
        listing.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });
    
    const resultsMsg = document.getElementById('resultsCount');
    if (resultsMsg) {
        if (visibleCount === 0) {
            resultsMsg.innerHTML = '❌ No properties found matching your criteria';
            resultsMsg.style.color = '#e74c3c';
        } else {
            resultsMsg.innerHTML = `✅ Found ${visibleCount} property${visibleCount !== 1 ? 's' : ''}`;
            resultsMsg.style.color = '#8b7355';
        }
    }
}

function resetFilters() {
    const locationInput = document.getElementById('filterLocationInput');
    if (locationInput) locationInput.value = '';
    
    const listings = document.querySelectorAll('#listingsContainer .listing-card');
    listings.forEach(listing => {
        listing.style.display = 'block';
    });
    
    const resultsMsg = document.getElementById('resultsCount');
    if (resultsMsg) {
        resultsMsg.innerHTML = `✅ Showing all ${listings.length} properties`;
        resultsMsg.style.color = '#8b7355';
    }
    
    sessionStorage.removeItem('searchDistrict');
    sessionStorage.removeItem('searchType');
    sessionStorage.removeItem('searchPrice');
}

function checkSavedSearch() {
    const district = sessionStorage.getItem('searchDistrict');
    const landType = sessionStorage.getItem('searchType');
    const priceRange = sessionStorage.getItem('searchPrice');
    
    if (district || landType || (priceRange && priceRange !== 'any')) {
        const locationInput = document.getElementById('filterLocationInput');
        if (locationInput && district) {
            locationInput.value = district;
        }
        
        applyAdvancedSearch(district, landType, priceRange);
        
        setTimeout(() => {
            sessionStorage.removeItem('searchDistrict');
            sessionStorage.removeItem('searchType');
            sessionStorage.removeItem('searchPrice');
        }, 1000);
    } else {
        const listings = document.querySelectorAll('#listingsContainer .listing-card');
        const resultsMsg = document.getElementById('resultsCount');
        if (resultsMsg && listings.length > 0) {
            resultsMsg.innerHTML = `✅ Showing all ${listings.length} properties`;
        }
    }
}

// ========== ACKNOWLEDGEMENT MODAL ==========
function showAcknowledgement(message) {
    let modal = document.getElementById('acknowledgementModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'acknowledgementModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <i class="bi bi-check-circle-fill"></i>
                <h2>Thank You!</h2>
                <p id="modalMessage">${message || 'Your submission has been received!'}</p>
                <button onclick="closeModal()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        const msgElement = document.getElementById('modalMessage');
        if (msgElement) msgElement.textContent = message;
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
        if (modal && modal.style.display === 'flex') {
            closeModal();
        }
    }, 4000);
}

function closeModal() {
    const modal = document.getElementById('acknowledgementModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== FORM HANDLERS ==========
function handleFeedbackSubmit(event) {
    event.preventDefault();
    showAcknowledgement('Your feedback has been successfully submitted! We appreciate your input.');
    event.target.reset();
    return false;
}

function handleContactSubmit(event) {
    event.preventDefault();
    showAcknowledgement('Your message has been sent! Our team will respond within 24 hours.');
    event.target.reset();
    return false;
}

function handleLandListingSubmit(event) {
    event.preventDefault();
    showAcknowledgement('Your land listing has been submitted! We will review and contact you within 24 hours.');
    event.target.reset();
    return false;
}

// ========== ADDITIONAL FEATURES ==========
function toggleFavorite(btn) {
    if (btn.classList.contains('saved')) {
        btn.classList.remove('saved');
        btn.innerHTML = '❤️ Save';
        showAcknowledgement('Removed from favorites');
    } else {
        btn.classList.add('saved');
        btn.innerHTML = '💔 Saved';
        showAcknowledgement('Added to favorites!');
        
        let favorites = JSON.parse(localStorage.getItem('terravastFavorites') || '[]');
        const propertyTitle = btn.closest('.listing-card, article').querySelector('h3').textContent;
        if (!favorites.includes(propertyTitle)) {
            favorites.push(propertyTitle);
            localStorage.setItem('terravastFavorites', JSON.stringify(favorites));
        }
    }
}

function calculateEMI() {
    const price = parseFloat(document.getElementById('propertyPrice')?.value);
    const downPercent = parseFloat(document.getElementById('downPayment')?.value);
    const rate = parseFloat(document.getElementById('interestRate')?.value);
    const years = parseFloat(document.getElementById('loanTerm')?.value);
    
    if (!price || price <= 0) {
        showAcknowledgement('Please enter a valid property price');
        return;
    }
    
    const loanAmount = price * (1 - downPercent / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    
    const monthlyElem = document.getElementById('monthlyPayment');
    const interestElem = document.getElementById('totalInterest');
    const totalElem = document.getElementById('totalPayment');
    const resultElem = document.getElementById('calcResult');
    
    if (monthlyElem) monthlyElem.textContent = `P${emi.toFixed(2)}`;
    if (interestElem) interestElem.textContent = `P${totalInterest.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `P${totalPayment.toFixed(2)}`;
    if (resultElem) resultElem.style.display = 'block';
}

function subscribeNewsletter(btn) {
    const email = btn.previousElementSibling?.value;
    if (email && email.includes('@') && email.includes('.')) {
        showAcknowledgement('Thank you for subscribing to our newsletter!');
        if (btn.previousElementSibling) btn.previousElementSibling.value = '';
    } else {
        showAcknowledgement('Please enter a valid email address');
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== INITIALIZE EVERYTHING ==========
document.addEventListener('DOMContentLoaded', function() {
    // Start slideshow
    startSlideshow();
    
    // Check for saved search on listings page
    if (window.location.pathname.includes('listings.html')) {
        checkSavedSearch();
    }
    
    // Set up form handlers
    const feedbackForm = document.querySelector('#feedbackForm, .feedback-form form, form[action="acknowledgement.html"]');
    if (feedbackForm) {
        feedbackForm.onsubmit = handleFeedbackSubmit;
    }
    
    const contactForm = document.querySelector('#contactForm, .contact-form form');
    if (contactForm && window.location.pathname.includes('contact.html')) {
        contactForm.onsubmit = handleContactSubmit;
    }
    
    const landForm = document.querySelector('#landListingForm, .list-land-form form, #form-section form');
    if (landForm && window.location.pathname.includes('listyourlandform.html')) {
        landForm.onsubmit = handleLandListingSubmit;
    }
    
    // Add scroll to top button
    if (!document.getElementById('scrollTopBtn')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollTopBtn';
        scrollBtn.innerHTML = '↑';
        scrollBtn.onclick = scrollToTop;
        scrollBtn.style.position = 'fixed';
        scrollBtn.style.bottom = '20px';
        scrollBtn.style.right = '20px';
        scrollBtn.style.background = '#c9a03d';
        scrollBtn.style.color = '#2d4a2c';
        scrollBtn.style.border = 'none';
        scrollBtn.style.borderRadius = '50%';
        scrollBtn.style.width = '50px';
        scrollBtn.style.height = '50px';
        scrollBtn.style.cursor = 'pointer';
        scrollBtn.style.display = 'none';
        scrollBtn.style.zIndex = '1000';
        scrollBtn.style.fontSize = '24px';
        scrollBtn.style.fontWeight = 'bold';
        document.body.appendChild(scrollBtn);
        
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollBtn.style.display = 'block';
            } else {
                scrollBtn.style.display = 'none';
            }
        };
    }
});

// Make functions globally available
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.performSearch = performSearch;
window.filterListingsByLocation = filterListingsByLocation;
window.resetFilters = resetFilters;
window.toggleFavorite = toggleFavorite;
window.calculateEMI = calculateEMI;
window.subscribeNewsletter = subscribeNewsletter;
window.closeModal = closeModal;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
