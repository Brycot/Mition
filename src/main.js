// Data

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    params: {
        api_key: API_KEY,
    },
});

const API_TRENDING = "/trending/movie/day";
const API_GENRE = "/genre/movie/list";
const API_DISCOVER_GENRE = "/discover/movie";
const API_SEARCH_MOVIES = "/search/movie";
const API_DETAILS_MOVIE = "/movie/";

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem("liked_Movies"));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem("liked_Movies", JSON.stringify(likedMovies));
}
// Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute("data-img");
            entry.target.setAttribute("src", url);
        }
    });
});

function createMovies(
    movies,
    container,
    { lazyLoad = false, clean = false } = {}
) {
    if (clean) {
        container.innerHTML = "";
    }

    movies.forEach((movie) => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute(
            lazyLoad ? "data-img" : "src",
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        );
        movieImg.addEventListener("click", () => {
            location.hash = `#movie=${movie.id}`;
        });
        movieImg.addEventListener("error", () => {
            movieImg.setAttribute(
                "src",
                "https://static.platzi.com/static/images/error/img404.png"
            );
            const movieTitle = document.createElement("span");
            movieTitle.innerHTML = movie.title;
            movieContainer.appendChild(movieTitle);
        });

        const movieBtn = document.createElement("button");
        movieBtn.classList.add("movie-btn");
        likedMoviesList()[movie.id] &&
            movieBtn.classList.add("movie-btn--liked");
        movieBtn.addEventListener("click", () => {
            movieBtn.classList.toggle("movie-btn--liked");
            likeMovie(movie);
            getLikedMovies();
            getTrendingMoviesPreview();
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
}

function getCast(
    movieCast,
    container,
    { lazyLoad = false, clean = false } = {}
) {
    if (clean) {
        container.innerHTML = "";
    }

    movieCast.forEach((cast) => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const castImg = document.createElement("img");
        castImg.classList.add("cast-img");
        castImg.setAttribute("alt", cast.name);
        castImg.setAttribute(
            lazyLoad ? "data-img" : "src",
            `https://image.tmdb.org/t/p/w300${cast.profile_path}`
        );
        const castName = document.createElement("span");
        castName.classList.add("cast-name");
        castImg.addEventListener("error", () => {
            castImg.setAttribute(
                "src",
                "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
            );
            castName.innerHTML = cast.name;
            movieContainer.appendChild(castName);
        });

        if (lazyLoad) {
            lazyLoader.observe(castImg);
        }

        movieContainer.appendChild(castImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach((category) => {
        const genreContainer = document.createElement("div");
        genreContainer.classList.add("category-container");

        const titleGenre = document.createElement("h3");
        titleGenre.classList.add("category-title");
        titleGenre.setAttribute("id", `id${category.id}`);
        titleGenre.addEventListener("click", () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        titleGenre.appendChild(categoryTitleText);
        genreContainer.appendChild(titleGenre);
        container.appendChild(genreContainer);
    });
}

//API CALLS

async function getTrendingMoviesPreview() {
    const { data } = await api(API_TRENDING);

    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList, {
        lazyLoad: true,
        clean: true,
    });
}

async function getCategoriesPreview() {
    const { data } = await api(API_GENRE);
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
    const { data } = await api(API_DISCOVER_GENRE, {
        params: {
            with_genres: id,
        },
    });

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        const scrollIsBotton = scrollTop + clientHeight >= scrollHeight - 15;
        const pageIsMax = page <= maxPage;

        if (scrollIsBotton && pageIsMax) {
            page++;
            const { data } = await api(API_DISCOVER_GENRE, {
                params: {
                    with_genres: id,
                    page,
                },
            });

            const movies = data.results;

            createMovies(movies, genericSection, {
                lazyLoad: true,
                clean: false,
            });
        }
    };
}

async function getMoviesBySearch(query) {
    const { data } = await api(API_SEARCH_MOVIES, {
        params: {
            query,
        },
    });

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        const scrollIsBotton = scrollTop + clientHeight >= scrollHeight - 15;
        const pageIsMax = page <= maxPage;

        if (scrollIsBotton && pageIsMax) {
            page++;
            const { data } = await api(API_SEARCH_MOVIES, {
                params: {
                    query,
                    page,
                },
            });

            const movies = data.results;

            createMovies(movies, genericSection, {
                lazyLoad: true,
                clean: false,
            });
        }
    };
}

async function getMoviesTrends() {
    const { data } = await api(API_TRENDING);
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

async function getPaginatedTrendingMovies() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBotton = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsMax = page <= maxPage;

    if (scrollIsBotton && pageIsMax) {
        page++;
        const { data } = await api(API_TRENDING, {
            params: {
                page,
            },
        });

        const movies = data.results;

        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
}

async function getMovieById(id) {
    const { data: movie } = await api(`/movie/${id}`);
    const movieUrlIMG = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%),
        url(${movieUrlIMG})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id);
    getCastMovieId(id);
    getTrailerMovieId(id);
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;
    if(relatedMovies.length < 1) {
        
    }
    console.log(relatedMovies);
    createMovies(relatedMovies, relatedMoviesContainer, {
        lazyLoad: true,
        clean: true,
    });
}
async function getCastMovieId(id) {
    const { data } = await api(`/movie/${id}/credits`);
    const castMovie = data.cast;
    getCast(castMovie, castMoviesContainer, {
        lazyLoad: true,
        clean: true,
    });
}
async function getTrailerMovieId(id) {
    const { data } = await api(`/movie/${id}/videos`);
    const castMovie = data.results;
    // getCast(castMovie, castMoviesContainer, {
    //     lazyLoad: true,
    //     clean: true,
    // });
}

async function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMovieListArticle, {
        lazyLoad: true,
        clean: true,
    });
}
