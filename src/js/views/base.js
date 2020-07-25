/**
 * Contains all elements used in app
 */
export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    serchResultList: document.querySelector('.results__list'),
    serchResultListParent: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipeView: document.querySelector('.recipe'),
    shopingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    deleteAllLikes: document.querySelector('.delete-likes')
};

/**
 * Contains used css classes
 */
export const elementStrings = {
    loader: 'loader'
}

/**
 * Appends loader to parent element
 * 
 * @param {*} parent 
 */
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
}

/**
 * Removes loader
 */
export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
        loader.remove();
    }
}