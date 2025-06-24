// Animation enhancements for the Movie Database web app

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initAnimations();
});

// Function to initialize all animations
function initAnimations() {
    // Set up observers for dynamic content
    setupImageLoadObserver();
    setupMovieCardObserver();
}

// Observer for lazy loading images with animation
function setupImageLoadObserver() {
    // Create an intersection observer to detect when images enter the viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add loading placeholder effect
                const imageContainer = img.closest('.movie-image');
                if (imageContainer) {
                    imageContainer.classList.add('loading-placeholder');
                }

                // When the image loads, remove placeholder and show image with animation
                img.onload = () => {
                    if (imageContainer) {
                        imageContainer.classList.remove('loading-placeholder');
                    }
                    img.classList.add('loaded');
                };

                // Set the src attribute to trigger loading
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                // Stop observing the image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observe all images that have a data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Observer for movie cards to add staggered animation
function setupMovieCardObserver() {
    // Create an intersection observer to detect when movie cards enter the viewport
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate-in');

                // Stop observing the card
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    // Observe all movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        cardObserver.observe(card);
    });
}

// Function to modify the createMovieCard function to support lazy loading
function enhanceMovieCard(card, imageUrl) {
    // Find the image element
    const imgElement = card.querySelector('img');
    if (imgElement) {
        // Set data-src instead of src for lazy loading
        imgElement.setAttribute('data-src', imageUrl);
        imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Transparent placeholder
    }

    return card;
}

// Function to enhance the displayMovies function
function enhanceDisplayMovies() {
    // Re-initialize animations after new content is loaded
    setupImageLoadObserver();
    setupMovieCardObserver();
}

// Function to add a subtle parallax effect to the movie detail image
function addParallaxEffect() {
    const detailImage = document.querySelector('.movie-detail-image');
    if (detailImage) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            detailImage.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
        });
    }
}

// Override the original createMovieCard function to add animation enhancements
const originalCreateMovieCard = window.createMovieCard;
if (originalCreateMovieCard) {
    window.createMovieCard = function(movie) {
        const card = originalCreateMovieCard(movie);

        // Get image URL or use placeholder
        let imageUrl = 'https://via.placeholder.com/300x450?text=No+Image';

        // Check if movie has images
        if (movie.images && movie.images.length > 0) {
            // Find a cover image or use the first image
            const coverImage = movie.images.find(img => img.type === 'cover') || movie.images[0];
            imageUrl = coverImage.url;
        } else if (movie.posterUrl) {
            // Fallback to posterUrl if it exists
            imageUrl = movie.posterUrl;
        }

        return enhanceMovieCard(card, imageUrl);
    };
}

// Override the original displayMovies function to add animation enhancements
const originalDisplayMovies = window.displayMovies;
if (originalDisplayMovies) {
    window.displayMovies = function(movieData) {
        originalDisplayMovies(movieData);
        enhanceDisplayMovies();
    };
}

// Override the original displayMovieDetails function to add animation enhancements
const originalDisplayMovieDetails = window.displayMovieDetails;
if (originalDisplayMovieDetails) {
    window.displayMovieDetails = function(movie) {
        originalDisplayMovieDetails(movie);
        addParallaxEffect();
        setupImageLoadObserver();
    };
}

// Add a subtle hover effect to the header
const header = document.querySelector('header');
if (header) {
    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        header.style.background = `radial-gradient(circle at ${x}px ${y}px, #3a506b, #2c3e50)`;
    });

    header.addEventListener('mouseleave', () => {
        header.style.background = '#2c3e50';
    });
}
