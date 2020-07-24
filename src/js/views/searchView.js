import { elements } from './base';

/**
 * Getting input from search input
 */
export const getInput = () => elements.searchInput.value;

/**
 * Clears search input
 */
export const clearInput = () => {
    elements.searchInput.value = '';
};

/**
 * Clear results html container (pages container and results container)
 */
export const clearResults = () => {
    elements.serchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

/**
 * Add active class to selected recipe
 * Removes asynchronously active class, and when its doene, add active class to new element
 * @param {*} id 
 */
export const hilightSelected = id => {
    const resultsList = Array.from(document.querySelectorAll('.results__link'));

    resultsList.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

/**
 * Returns converted title, if title is longer then 17 chars
 * If longer then 17 chars, return title whos new char count is less then 17 AND doesnt slice words
 * 
 * @param {*} title 
 * @param {*} limit 
 */
export const convertTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        //acc is like init value of each iteration (starts with 0, because we passed in 0 as argument after callback)
        title.split(' ').reduce((acc, current) => {
            if (acc + current.length <= limit) {
                newTitle.push(current);
            }
            //Next iteration value will be 0 + current.length and 2nd iteration acc will be current.length + newCurrent.length
            return acc + current.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
}


/**
 * Renders recipe to DOM
 * @param {*} recipe 
 */
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${convertTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.serchResultList.insertAdjacentHTML('afterbegin', markup);
};

/**
 * Gets pagination buttons template
 * 
 * @param {*} page Current page
 * @param {*} type prev || next
 */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${(type === 'prev' ? page - 1 : page + 1)}">
        <span>Page ${(type === 'prev' ? page - 1 : page + 1)}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${(type === 'prev' ? 'left' : 'right')}"></use>
        </svg>
    </button>
`;

/**
 * Renders pagination buttons
 * Calculaiting how many pages thee will be
 * Renders buttons based on current page
 * 
 * @param {*} page Current page
 * @param {*} numResults Total results
 * @param {*} resPerPage Results per page
 */
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
    } else if(page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

/**
 * Renders results Template with Pagination button template 
 * 
 * @param {*} recipes All recipies
 * @param {*} page Current page
 * @param {*} resPerPage Results per page
 */
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;//Where to start
    const end = page * resPerPage;//Where to end results 

    //Slices array based on where to start and where to end, and then on each element calls renderRecipe, passing recipe (passed by default)
    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resPerPage);
};