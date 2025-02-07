 // Initialize Testimonial Swiper
 new Swiper('.testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    }
});

// Video Modal Functionality
const videoThumbnails = document.querySelectorAll('.video-testimonial');
const videoModal = new bootstrap.Modal(document.getElementById('videoModal'));
const videoFrame = document.querySelector('#videoModal iframe');

videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        // Add video loading animation
        thumbnail.querySelector('.video-overlay').style.backgroundColor = 'rgba(0,0,0,0.7)';
        setTimeout(() => {
            videoModal.show();
        }, 300);
    });
});

// Reset video when modal is closed
document.getElementById('videoModal').addEventListener('hidden.bs.modal', function () {
    videoFrame.src = '';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation for testimonial cards on scroll
const testimonialCards = document.querySelectorAll('.testimonial-card');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

testimonialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    testimonialObserver.observe(card);
});

// Add hover effects for video testimonials
document.querySelectorAll('.video-testimonial').forEach(video => {
    video.addEventListener('mouseenter', function() {
        this.querySelector('.play-button').style.transform = 'scale(1.1)';
    });

    video.addEventListener('mouseleave', function() {
        this.querySelector('.play-button').style.transform = 'scale(1)';
    });
});

// Dynamic star rating system
function createStarRating(rating, container) {
    const maxStars = 5;
    for (let i = 0; i < maxStars; i++) {
        const star = document.createElement('i');
        star.classList.add('fas', 'fa-star');
        if (i < rating) {
            star.classList.add('text-warning');
        } else {
            star.classList.add('text-muted');
        }
        container.appendChild(star);
    }
}

// Initialize all ratings
document.querySelectorAll('.rating').forEach(container => {
    createStarRating(5, container);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});