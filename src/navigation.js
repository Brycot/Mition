let maxPage;
let page = 1;
let infiniteScroll;
//scroll top smoth
function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};

// buttons 

searchFormBtn.addEventListener('click', () => {
    location.hash = `search=${searchFormInput.value}`;
})

trendingBtn.addEventListener('click', () => {
    location.hash = "trends";
})

arrowBtn.addEventListener('click', () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = "#home";
    } else {
        window.history.back();
    }
})

window.addEventListener('DOMContentLoaded', () => {
    navigator();
    window.history.pushState({ loadUrl: window.location.href }, null, '');
}, false);

window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);
// navigation on page

function navigator() {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false});
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    smoothscroll();

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false});
    }
}

const trendsPage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    
    likedMoviesSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Trends'

    getMoviesTrends();
    infiniteScroll = getPaginatedTrendingMovies;
}

const searchPage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    likedMoviesSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [ _ , query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);

}

const movieDetailPage = () => {

    headerSection.classList.add('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    likedMoviesSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [ _ , movieID] = location.hash.split('=');

    getMovieById(movieID);
}

const categoriesPage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [ _ , categoryData ] = location.hash.split('=');
    const [ categoryId, categoryName ] = categoryData.split('-');
    getMoviesByCategory(categoryId);
    headerCategoryTitle.innerHTML = categoryName.replaceAll('%20',' ');
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
    
}

const homePage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
    searchForm.reset();
}
