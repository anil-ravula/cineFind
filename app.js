let url = "https://api.sampleapis.com/movies/action-adventure";
let movies = [];
let initialMoviesHTML = "";

// DOM Elements
let hero = document.querySelector("#hero");
let ip = document.querySelector(".search-box input");
let s = document.querySelector(".search-box button");
let movieGrid = document.querySelector(".popular-movies");

let homeLink = document.querySelector("#home-link");
let discoverLink = document.querySelector("#discover-link");
let favoritesLink = document.querySelector("#favorites-link");
let aboutLink = document.querySelector("#about-link");
let logo = document.querySelector(".logo");

let heroExploreBtn = document.querySelector("#hero-explore-btn");
let heroFavBtn = document.querySelector("#hero-fav-btn");

let profileBtn = document.querySelector("#profile-btn");
let profileModal = document.querySelector("#profile-modal");
let closeProfileBtn = document.querySelector("#close-profile-btn");
let profileFavCount = document.querySelector("#profile-fav-count");
let profileFavStat = document.querySelector("#profile-fav-stat");
let menuFavBtn = document.querySelector("#menu-fav-btn");
let menuDiscoverBtn = document.querySelector("#menu-discover-btn");

// ==========================================
// POSTER URL RESOLVER (PRESERVES YOUR EXACT FIXES)
// ==========================================
function getPosterForIndex(i, movie) {
    if (i === 2 || i == 42 || i == 78) {
        return 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg';
    } else if (i == 13 || i == 45 || i == 73) {
        return 'https://m.media-amazon.com/images/M/MV5BNGNiNmU2YTMtZmU4OS00MjM0LTlmYWUtMjVlYjAzYjE2N2RjXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg';
    } else if (i == 16 || i == 51) {
        return 'https://m.media-amazon.com/images/M/MV5BMzA0YWMwMTUtMTVhNC00NjRkLWE2ZTgtOWEzNjJhYzNiMTlkXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg';
    } else if (i == 29 || i == 67) {
        return 'https://m.media-amazon.com/images/M/MV5BMzA2NDkwODAwM15BMl5BanBnXkFtZTgwODk5MTgzMTE@._V1_SX300.jpg';
    } else if (i == 30) {
        return 'https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg';
    } else if (i == 33) {
        return 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg';
    } else if (i == 89) {
        return 'https://m.media-amazon.com/images/M/MV5BNTk4ODQ1MzgzNl5BMl5BanBnXkFtZTgwMTMyMzM4MTI@._V1_SX300.jpg';
    } else if (i == 88) {
        return 'https://m.media-amazon.com/images/M/MV5BMTg5YWIyMWUtZDY5My00Zjc1LTljOTctYmI0MWRmY2M2NmRkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg';
    } else {
        return movie?.posterURL || '';
    }
}

// ==========================================
// FAVORITES SYSTEM (LOCAL STORAGE)
// ==========================================
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("cinefind_favorites")) || [];
    } catch {
        return [];
    }
}

function saveFavorites(favs) {
    localStorage.setItem("cinefind_favorites", JSON.stringify(favs));
    updateProfileFavCount();
}

function isMovieFavorited(title) {
    return getFavorites().some(f => f.title === title);
}

function toggleFavorite(movie, index) {
    let favs = getFavorites();
    let existingIndex = favs.findIndex(f => f.title === movie.title);

    if (existingIndex >= 0) {
        favs.splice(existingIndex, 1);
    } else {
        favs.push({
            title: movie.title,
            posterURL: getPosterForIndex(index, movie),
            originalIndex: index
        });
    }
    saveFavorites(favs);
}

function updateProfileFavCount() {
    if (profileFavCount) {
        profileFavCount.textContent = getFavorites().length;
    }
}

// ==========================================
// MOVIE CARD CREATOR
// ==========================================
function createMovieCard(movie, index) {
    let card = document.createElement("div");
    card.classList.add("movie-card");

    // Poster background using the exact condition resolver
    let poster = getPosterForIndex(index, movie);
    card.style.backgroundImage = `url("${poster}")`;

    // Favorite heart button
    let favBtn = document.createElement("button");
    favBtn.classList.add("fav-btn");
    favBtn.title = "Save to Favorites";
    let isFav = isMovieFavorited(movie.title);
    if (isFav) favBtn.classList.add("active");
    favBtn.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;

    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(movie, index);
        let nowFav = isMovieFavorited(movie.title);
        favBtn.classList.toggle("active", nowFav);
        favBtn.innerHTML = `<i class="${nowFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;

        // If currently in favorites view, refresh it immediately
        if (favoritesLink && favoritesLink.classList.contains("active")) {
            showFavorites();
        }
    });

    // Hover title overlay
    let overlay = document.createElement("div");
    overlay.classList.add("card-overlay");
    let titleSpan = document.createElement("span");
    titleSpan.classList.add("movie-title");
    titleSpan.textContent = movie.title || "Movie";
    overlay.appendChild(titleSpan);

    card.appendChild(favBtn);
    card.appendChild(overlay);

    return card;
}

// ==========================================
// NAVIGATION ACTIVE STATE
// ==========================================
function setActiveNav(activeElement) {
    [homeLink, discoverLink, favoritesLink, aboutLink].forEach(link => {
        if (link) link.classList.remove("active");
    });
    if (activeElement) activeElement.classList.add("active");
}

// ==========================================
// FETCH MOVIES & HOME VIEW
// ==========================================
async function movie_cards() {
    if (movies.length === 0) {
        let response = await fetch(url);
        movies = await response.json();
    }
    renderHome();
}

function renderHome() {
    movieGrid.innerHTML = `
        <div class="row one"></div>
        <div class="row two"></div>
        <div class="row three"></div>
    `;

    let rowOne = movieGrid.querySelector(".row.one");
    let rowTwo = movieGrid.querySelector(".row.two");
    let rowThree = movieGrid.querySelector(".row.three");

    for (let i = 0; i < 15; i++) {
        if (!movies[i]) break;
        let card = createMovieCard(movies[i], i);
        if (i < 5) {
            rowOne.appendChild(card);
        } else if (i < 10) {
            rowTwo.appendChild(card);
        } else {
            rowThree.appendChild(card);
        }
    }
    initialMoviesHTML = movieGrid.innerHTML;
}

// Back to Home
function goHome(e) {
    if (e) e.preventDefault();
    ip.value = "";
    setActiveNav(homeLink);

    // CRITICAL FIX: Ensure hero section is displayed back!
    if (hero) hero.style.display = "flex";

    closeProfile();
    renderHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

movie_cards();

// ==========================================
// DISCOVER VIEW (ENHANCED & INTERACTIVE)
// ==========================================
async function discover(filteredList = null) {
    if (movies.length === 0) {
        let response = await fetch(url);
        movies = await response.json();
    }

    if (hero) hero.style.display = "none";
    setActiveNav(discoverLink);
    closeProfile();

    let list = filteredList || movies;
    movieGrid.innerHTML = "";

    // 1. Discover Header & Controls
    let header = document.createElement("div");
    header.classList.add("section-header");
    header.innerHTML = `
        <div>
            <h2><i class="fa-solid fa-compass"></i> Discover Movies</h2>
            <p>Explore hidden gems, action thrillers, and cinematic adventures (${list.length} movies)</p>
        </div>
        <div class="filter-actions">
            <button class="filter-pill ${filteredList === null ? 'active' : ''}" id="pill-all">
                <i class="fa-solid fa-film"></i> All Movies
            </button>
            <button class="filter-pill surprise-pill" id="pill-surprise">
                <i class="fa-solid fa-dice"></i> Surprise Me!
            </button>
            <button class="filter-pill" id="pill-shuffle">
                <i class="fa-solid fa-shuffle"></i> Shuffle
            </button>
        </div>
    `;
    movieGrid.appendChild(header);

    // Spotlight container for "Surprise Me!"
    let spotlightContainer = document.createElement("div");
    spotlightContainer.id = "spotlight-area";
    movieGrid.appendChild(spotlightContainer);

    // 2. Render movie rows of 5 cards
    let row;
    for (let i = 0; i < list.length; i++) {
        if (i % 5 === 0) {
            row = document.createElement("div");
            row.classList.add("row");
            movieGrid.appendChild(row);
        }

        // Match original index in movies array to preserve exact poster conditionals
        let originalIndex = movies.indexOf(list[i]);
        if (originalIndex === -1) originalIndex = i;

        let card = createMovieCard(list[i], originalIndex);
        row.appendChild(card);
    }

    // "Surprise Me" Event Listener
    document.querySelector("#pill-surprise")?.addEventListener("click", () => {
        let randomIndex = Math.floor(Math.random() * movies.length);
        let randomMovie = movies[randomIndex];
        let poster = getPosterForIndex(randomIndex, randomMovie);
        let isFav = isMovieFavorited(randomMovie.title);

        spotlightContainer.innerHTML = `
            <div class="spotlight-card">
                <div class="spotlight-poster" style="background-image: url('${poster}')"></div>
                <div class="spotlight-info">
                    <span class="spotlight-tag"><i class="fa-solid fa-dice"></i> Random Pick</span>
                    <h3>${randomMovie.title}</h3>
                    <p>Looking for something thrilling to watch tonight? Here is a hand-picked action pick for you!</p>
                    <div class="spotlight-actions">
                        <button class="spotlight-btn primary" id="spotlight-fav-btn">
                            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            ${isFav ? 'Favorited' : 'Add to Favorites'}
                        </button>
                        <button class="spotlight-btn secondary" id="spotlight-spin-btn">
                            <i class="fa-solid fa-rotate-right"></i> Spin Again
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.querySelector("#spotlight-fav-btn")?.addEventListener("click", () => {
            toggleFavorite(randomMovie, randomIndex);
            discover(list);
        });

        document.querySelector("#spotlight-spin-btn")?.addEventListener("click", () => {
            document.querySelector("#pill-surprise")?.click();
        });

        spotlightContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // "All Movies" Event Listener
    document.querySelector("#pill-all")?.addEventListener("click", () => {
        discover();
    });

    // "Shuffle" Event Listener
    document.querySelector("#pill-shuffle")?.addEventListener("click", () => {
        let shuffled = [...movies].sort(() => Math.random() - 0.5);
        discover(shuffled);
    });
}

// ==========================================
// FAVORITES VIEW
// ==========================================
function showFavorites(e) {
    if (e) e.preventDefault();
    if (hero) hero.style.display = "none";
    setActiveNav(favoritesLink);
    closeProfile();
    ip.value = "";

    let favs = getFavorites();
    movieGrid.innerHTML = "";

    if (favs.length === 0) {
        movieGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-heart"></i>
                <h3>No Favorites Saved Yet</h3>
                <p>Browse through Discover or Home and click the heart icon on any movie to save it to your personal favorites!</p>
                <button id="empty-explore-btn"><i class="fa-solid fa-compass"></i> Explore Movies</button>
            </div>
        `;
        document.querySelector("#empty-explore-btn")?.addEventListener("click", () => {
            discover();
        });
        return;
    }

    // Favorites Header
    let header = document.createElement("div");
    header.classList.add("section-header");
    header.innerHTML = `
        <div>
            <h2><i class="fa-solid fa-heart" style="color: #ff4757;"></i> My Favorites (${favs.length})</h2>
            <p>Your saved collection of movies for tonight</p>
        </div>
        <div class="filter-actions">
            <button class="filter-pill" id="fav-browse-btn"><i class="fa-solid fa-plus"></i> Add More Movies</button>
        </div>
    `;
    movieGrid.appendChild(header);

    document.querySelector("#fav-browse-btn")?.addEventListener("click", () => {
        discover();
    });

    // Render favorites in rows of 5
    let row;
    for (let i = 0; i < favs.length; i++) {
        if (i % 5 === 0) {
            row = document.createElement("div");
            row.classList.add("row");
            movieGrid.appendChild(row);
        }

        let origIdx = favs[i].originalIndex ?? 0;
        let card = createMovieCard(favs[i], origIdx);
        row.appendChild(card);
    }
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function search() {
    let movieName = ip.value.trim().toLowerCase();

    if (movieName === "") {
        goHome();
        return;
    }

    if (hero) hero.style.display = "none";
    setActiveNav(null);
    closeProfile();

    let filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(movieName)
    );

    movieGrid.innerHTML = "";

    if (filteredMovies.length === 0) {
        movieGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>No Movies Found</h3>
                <p>We couldn't find any movie matching "${ip.value.trim()}". Try another keyword or explore our collection!</p>
                <button id="search-explore-btn"><i class="fa-solid fa-compass"></i> Explore All Movies</button>
            </div>
        `;
        document.querySelector("#search-explore-btn")?.addEventListener("click", () => {
            discover();
        });
        return;
    }

    let header = document.createElement("div");
    header.classList.add("section-header");
    header.innerHTML = `
        <div>
            <h2><i class="fa-solid fa-magnifying-glass"></i> Search Results</h2>
            <p>Found ${filteredMovies.length} movie${filteredMovies.length > 1 ? 's' : ''} matching "${ip.value.trim()}"</p>
        </div>
    `;
    movieGrid.appendChild(header);

    let row;
    for (let i = 0; i < filteredMovies.length; i++) {
        if (i % 5 === 0) {
            row = document.createElement("div");
            row.classList.add("row");
            movieGrid.appendChild(row);
        }
        let origIdx = movies.indexOf(filteredMovies[i]);
        if (origIdx === -1) origIdx = i;

        let card = createMovieCard(filteredMovies[i], origIdx);
        row.appendChild(card);
    }
}

// ==========================================
// PROFILE MODAL HANDLERS
// ==========================================
function openProfile(e) {
    if (e) e.preventDefault();
    updateProfileFavCount();
    if (profileModal) profileModal.classList.add("open");
}

function closeProfile() {
    if (profileModal) profileModal.classList.remove("open");
}

if (profileBtn) profileBtn.addEventListener("click", openProfile);
if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfile);
if (profileModal) {
    profileModal.addEventListener("click", (e) => {
        if (e.target === profileModal) closeProfile();
    });
}
if (profileFavStat) {
    profileFavStat.addEventListener("click", () => {
        closeProfile();
        showFavorites();
    });
}
if (menuFavBtn) {
    menuFavBtn.addEventListener("click", () => {
        closeProfile();
        showFavorites();
    });
}
if (menuDiscoverBtn) {
    menuDiscoverBtn.addEventListener("click", () => {
        closeProfile();
        discover();
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================
if (homeLink) homeLink.addEventListener("click", goHome);
if (logo) logo.addEventListener("click", goHome);

if (discoverLink) {
    discoverLink.addEventListener("click", (e) => {
        e.preventDefault();
        discover();
    });
}

if (favoritesLink) {
    favoritesLink.addEventListener("click", (e) => showFavorites(e));
}

if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveNav(aboutLink);
        if (hero) hero.style.display = "none";
        closeProfile();
        movieGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clapperboard" style="color: #E0F8C7;"></i>
                <h3>About CineFind</h3>
                <p>CineFind is your ultimate action & adventure movie exploration hub. Discover hidden cinematic gems, save your favorite picks to your watchlist, and enjoy movie night!</p>
                <button id="about-home-btn"><i class="fa-solid fa-house"></i> Back to Home</button>
            </div>
        `;
        document.querySelector("#about-home-btn")?.addEventListener("click", goHome);
    });
}

if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => discover());
}

if (heroFavBtn) {
    heroFavBtn.addEventListener("click", (e) => showFavorites(e));
}

if (s) s.addEventListener("click", search);

if (ip) {
    ip.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            search();
        }
    });
}

// Initialize profile counter on load
updateProfileFavCount();
