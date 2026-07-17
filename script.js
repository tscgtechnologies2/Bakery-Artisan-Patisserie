/**
 * Artisan Patisserie / Bakery
 * Client-side script for premium interactive components and animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       HEADER & NAVIGATION CONTROL
       ========================================================================== */
    const siteHeader = document.querySelector('.site-header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-item');

    // Sticky Header Scroll Transition
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on initial load in case page is refreshed while scrolled

    // Mobile Menu Toggle Control
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scrolling when menu is active on mobile
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });


    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animate, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // default is viewport
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // adjust bottom margin
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       TESTIMONIALS SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('#testimonialSlider .slide');
    const dots = document.querySelectorAll('#sliderDots .dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let sliderTimer = null;
    const autoPlayInterval = 6000; // 6 seconds

    const showSlide = (index) => {
        // Handle out-of-bounds indices
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Toggle classes
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    // Auto-play timer control
    const startSliderTimer = () => {
        stopSliderTimer();
        sliderTimer = setInterval(nextSlide, autoPlayInterval);
    };

    const stopSliderTimer = () => {
        if (sliderTimer) clearInterval(sliderTimer);
    };

    // Event Listeners for controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSliderTimer(); // reset auto-play timer on click
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSliderTimer();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
            showSlide(slideIndex);
            startSliderTimer();
        });
    });

    // Start Slider
    if (slides.length > 0) {
        startSliderTimer();
        
        // Pause timer on hover to make it reading-friendly
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        sliderContainer.addEventListener('mouseenter', stopSliderTimer);
        sliderContainer.addEventListener('mouseleave', startSliderTimer);
    }


    /* ==========================================================================
       FAQ ACCORDION COMPONENT
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other FAQ items first
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                // Calculate actual height dynamically
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    /* ==========================================================================
       FORM VALIDATION & SUCCESS TOAST NOTIFICATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const messageInput = document.getElementById('message');
    const successToast = document.getElementById('successToast');
    const closeToastBtn = document.getElementById('closeToast');
    let toastTimeout = null;

    // Toast Control Functions
    const showToast = () => {
        if (toastTimeout) clearTimeout(toastTimeout);
        successToast.classList.add('show');
        
        // Auto close after 5 seconds
        toastTimeout = setTimeout(hideToast, 5000);
    };

    const hideToast = () => {
        successToast.classList.remove('show');
    };

    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', hideToast);
    }

    // Input Validation Helpers
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const setInputError = (inputElement, errorElementId, show) => {
        const group = inputElement.closest('.form-group');
        if (show) {
            group.classList.add('invalid');
        } else {
            group.classList.remove('invalid');
        }
    };

    // Remove errors immediately when user starts typing or focusing
    const clearOnInteraction = (inputElement) => {
        inputElement.addEventListener('input', () => {
            setInputError(inputElement, null, false);
        });
        inputElement.addEventListener('focus', () => {
            setInputError(inputElement, null, false);
        });
    };

    if (contactForm) {
        clearOnInteraction(nameInput);
        clearOnInteraction(emailInput);
        clearOnInteraction(messageInput);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate Name
            if (!nameInput.value.trim()) {
                setInputError(nameInput, 'nameError', true);
                isValid = false;
            } else {
                setInputError(nameInput, 'nameError', false);
            }

            // Validate Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                setInputError(emailInput, 'emailError', true);
                isValid = false;
            } else {
                setInputError(emailInput, 'emailError', false);
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                setInputError(messageInput, 'messageError', true);
                isValid = false;
            } else {
                setInputError(messageInput, 'messageError', false);
            }

            // If form inputs are correct
            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                
                // Show loading spinner
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Simulate API call transition delay (1.5 seconds)
                setTimeout(() => {
                    // Reset Button State
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                    // Clear form inputs
                    contactForm.reset();
                    
                    // Display premium success toast
                    showToast();
                }, 1500);
            }
        });
    }


    /* ==========================================================================
       SCROLL TO TOP CONTROL
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
