// Main JavaScript file for the Movie Database web app

// DOM elements
const moviesContainer = document.getElementById('movies-container');

// API endpoints
const API_URL = '/api/movies';

// Pagination state
let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 10;

// Fetch movies from the API with pagination
async function fetchMovies(page = 1, limit = 10) {
    try {
        const url = `${API_URL}?page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data) {
            // Update pagination state
            currentPage = data.page;
            totalPages = data.totalPages;
            itemsPerPage = data.limit;

            return {
                movies: data.data,
                pagination: {
                    page: data.page,
                    limit: data.limit,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages
                }
            };
        } else {
            throw new Error('Failed to fetch movies');
        }
    } catch (error) {
        console.error('Error fetching movies:', error);

        // Fall back to sample data only if API call fails
        if (window.sampleMovies && window.sampleMovies.length > 0) {
            console.log('Falling back to sample data after API call failed');

            // Create a simple pagination for sample data
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedMovies = window.sampleMovies.slice(startIndex, endIndex);
            const totalItems = window.sampleMovies.length;
            const calculatedTotalPages = Math.ceil(totalItems / limit);

            // Update pagination state
            currentPage = page;
            totalPages = calculatedTotalPages;
            itemsPerPage = limit;

            return {
                movies: paginatedMovies,
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: totalItems,
                    totalPages: calculatedTotalPages
                }
            };
        }

        showError('Failed to load movies. Please try again later.');
        return {
            movies: [],
            pagination: {
                page: 1,
                limit: limit,
                totalItems: 0,
                totalPages: 0
            }
        };
    }
}

// Fetch a single movie by ID
async function fetchMovieById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (data.success && data.data) {
            return data.data;
        } else {
            throw new Error('Failed to fetch movie details');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);

        // Fall back to sample data only if API call fails
        if (window.sampleMovies && window.sampleMovies.length > 0) {
            console.log('Falling back to sample data after API call for movie details failed');
            // Find the movie with the matching ID
            const movie = window.sampleMovies.find(m =>
                (m._id && m._id.$oid === id) || m.id === id
            );

            if (movie) {
                return movie;
            } else {
                console.warn(`Movie with ID ${id} not found in sample data`);
            }
        }

        showError('Failed to load movie details. Please try again later.');
        return null;
    }
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie._id || movie.id;

    // Get image URL or use placeholder
    let imageUrl = 'https://via.placeholder.com/300x450?text=No+Image';

    // Check if movie has images
    if (movie.images && movie.images.length > 0) {
        // Find a cover image or use the first image
        const coverImage = movie.images.find(img => img.type === 'cover') || movie.images[0];
        imageUrl = coverImage.url;
    } else if (movie.posterUrl) {
        // Fallback to posterUrl if it exists (for compatibility with old data structure)
        imageUrl = movie.posterUrl;
    }

    // Get description - use shortDescription if available, otherwise use description or longDescription
    const description = movie.shortDescription || movie.description || movie.longDescription || 'No description available';

    // Get year - either from the movie object or extract from releaseDate
    const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate * 1000).getFullYear() : 'Unknown');

    // Get rating - either from the movie object or use a default
    const rating = movie.rating || 'N/A';

    card.innerHTML = `
        <div class="movie-image">
            <img src="${imageUrl}" alt="${movie.title}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-description">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
            <div class="movie-meta">
                <span>${year}</span>
                <span>${rating !== 'N/A' ? `${rating}/10` : rating}</span>
            </div>
        </div>
    `;

    // Add click event to navigate to movie details
    card.addEventListener('click', () => {
        window.location.href = `/movie.html?id=${movie._id || movie.id}`;
    });

    return card;
}

// Display movies in the container
function displayMovies(movieData) {
    // Clear loading message
    moviesContainer.innerHTML = '';

    const movies = movieData.movies || [];

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<div class="no-movies">No movies found</div>';
        return;
    }

    // Create and append movie cards
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        moviesContainer.appendChild(card);
    });

    // Render pagination if we have pagination data
    if (movieData.pagination) {
        renderPagination(movieData.pagination);
    }
}

// Show error message
function showError(message) {
    moviesContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Render pagination controls
function renderPagination(paginationData) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const { page, totalPages, totalItems, limit } = paginationData;

    // Clear previous pagination
    paginationContainer.innerHTML = '';

    // Don't show pagination if there's only one page
    if (totalPages <= 1) return;

    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.textContent = 'Previous';
    prevButton.disabled = page <= 1;
    prevButton.addEventListener('click', () => changePage(page - 1));
    paginationContainer.appendChild(prevButton);

    // Create page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    // Add first page if not included in the range
    if (startPage > 1) {
        addPageNumber(1);
        if (startPage > 2) {
            // Add ellipsis if there's a gap
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
    }

    // Add page numbers in the range
    for (let i = startPage; i <= endPage; i++) {
        addPageNumber(i);
    }

    // Add last page if not included in the range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            // Add ellipsis if there's a gap
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
        addPageNumber(totalPages);
    }

    // Create next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.textContent = 'Next';
    nextButton.disabled = page >= totalPages;
    nextButton.addEventListener('click', () => changePage(page + 1));
    paginationContainer.appendChild(nextButton);

    // Add pagination info
    const paginationInfo = document.createElement('div');
    paginationInfo.className = 'pagination-info';
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalItems);
    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} movies`;
    paginationContainer.appendChild(paginationInfo);

    // Helper function to add a page number
    function addPageNumber(pageNum) {
        const pageElement = document.createElement('span');
        pageElement.className = `pagination-page-number ${pageNum === page ? 'active' : ''}`;
        pageElement.textContent = pageNum;
        pageElement.addEventListener('click', () => changePage(pageNum));
        paginationContainer.appendChild(pageElement);
    }
}

// Change page and reload movies
async function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;

    // Show loading indicator
    moviesContainer.innerHTML = '<div class="loading">Loading movies...</div>';

    // Fetch movies for the new page
    const movieData = await fetchMovies(newPage, itemsPerPage);

    // Display the movies with pagination
    displayMovies(movieData);

    // Scroll to top of the movies container
    window.scrollTo({
        top: moviesContainer.offsetTop - 20,
        behavior: 'smooth'
    });
}

// Initialize the app
async function initApp() {
    // Check if we're on the movie detail page
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId && window.location.pathname.includes('movie.html')) {
        // We're on the movie detail page
        const movie = await fetchMovieById(movieId);
        if (movie) {
            displayMovieDetails(movie);
        }
    } else {
        // We're on the main page
        // Get page from URL if present
        const page = parseInt(urlParams.get('page')) || 1;
        const limit = parseInt(urlParams.get('limit')) || 10;

        // Fetch movies with pagination
        const movieData = await fetchMovies(page, limit);

        // Display the movies with pagination
        displayMovies(movieData);
    }
}

// Display movie details on the detail page
function displayMovieDetails(movie) {
    const detailContainer = document.getElementById('movie-detail-container');
    if (!detailContainer) return;

    // Get image URL or use placeholder
    let imageUrl = 'https://via.placeholder.com/1200x500?text=No+Image';
    let backgroundUrl = null;

    // Check if movie has images
    if (movie.images && movie.images.length > 0) {
        // Find a cover image or use the first image
        const coverImage = movie.images.find(img => img.type === 'cover') || movie.images[0];
        imageUrl = coverImage.url;

        // Find a background image if available
        const backgroundImage = movie.images.find(img => img.type === 'background');
        if (backgroundImage) {
            backgroundUrl = backgroundImage.url;
        }
    } else if (movie.posterUrl) {
        // Fallback to posterUrl if it exists (for compatibility with old data structure)
        imageUrl = movie.posterUrl;
    }

    // Get description - use longDescription if available, otherwise use description or shortDescription
    const description = movie.longDescription || movie.description || movie.shortDescription || 'No description available';

    // Get year - either from the movie object or extract from releaseDate
    const year = movie.year || (movie.releaseDate ? new Date(movie.releaseDate * 1000).getFullYear() : 'Unknown');

    // Get director - either from the movie object or from credits
    let director = 'Unknown';
    if (movie.director) {
        director = movie.director;
    } else if (movie.credits && movie.credits.director) {
        director = Array.isArray(movie.credits.director)
            ? movie.credits.director.join(', ')
            : movie.credits.director;
    }

    // Get genre - either from the movie object or from genres
    let genreText = 'Unknown';
    if (movie.genre && Array.isArray(movie.genre)) {
        genreText = movie.genre.join(', ');
    } else if (movie.genres && Array.isArray(movie.genres)) {
        genreText = movie.genres.map(g => g.title).join(', ');
    }

    // Get rating - either from the movie object or use a default
    const rating = movie.rating || 'N/A';

    // Apply background image if available
    if (backgroundUrl) {
        detailContainer.style.backgroundImage = `url(${backgroundUrl})`;
        detailContainer.style.backgroundSize = 'cover';
        detailContainer.style.backgroundPosition = 'center';
        detailContainer.style.color = '#fff';
        detailContainer.style.textShadow = '0 0 5px rgba(0,0,0,0.7)';
    }

    detailContainer.innerHTML = `
        <div class="movie-detail">
            <div class="movie-detail-image">
                <img src="${imageUrl}" alt="${movie.title}">
            </div>
            <div class="movie-detail-info">
                <h1 class="movie-detail-title">${movie.title}</h1>
                <div class="movie-detail-meta">
                    <span>Director: ${director}</span>
                    <span>Year: ${year}</span>
                    ${rating !== 'N/A' ? `<span>Rating: ${rating}/10</span>` : ''}
                    <span>Genre: ${genreText}</span>
                </div>
                <p class="movie-detail-description">${description}</p>
            </div>
        </div>
    `;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
