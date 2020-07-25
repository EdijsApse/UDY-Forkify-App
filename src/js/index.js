/**
 * TODO For Latter
 * 
 * 
 * 3) Save shopping list data in localStorage
 * 4) Improve error handling
 * 5) Write calculate method for srvings (better)
 * 6) Predefined keywords for search, based on user history (saved in localStorage)
 * 7) Save laast search in localStorage and render on page load (With receipe if was selected)
 * 
 */

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, removeLoader, elementStrings } from './views/base';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import List from './models/List';
import * as listView from './views/listView'
import Likes from './models/Likes';
import * as likesView from './views/likesView';

/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */ 


 /** 
  * Asynchronous function to get results and rnder them
  * 
  * Submit form, get search query from input and send rquest, if not empty
  * Renders loader after results is got by asynchronous function (getResults)
  * Removes loader
  * Render results
 */
const controlSearch = async () => {
    const query = searchView.getInput();
    
    if (query) {     
        state.search = new Search(query);
        
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(elements.serchResultListParent);
        
        try {
            await state.search.getResults();

            removeLoader();
    
            searchView.renderResults(state.search.results);
        } catch(error) {
            removeLoader();
            //@todo error notification
        }

    }
}

/**
 * Adding event listener for calling search
 */
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

/**
 * Adding evvent listeners to buttons to switch pages
 */
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    recipeView.clearView();
    renderLoader(elements.recipeView);

    if (id) {
        
        state.recipe = new Recipe(id);
        
        if (state.search) { //If search hapened
            searchView.hilightSelected(state.recipe.id);
        }

        try {
            await state.recipe.getRecipe();

            removeLoader();
            
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch (error) {
            //@todo error notification
        }
    }
}

/**
 * Adding event listeners, to get recipe when page loads with hash, or user clicks on recipe and changes hash
 */
['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, controlRecipe);
});

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(ingredient => {
        
        const item = state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient);
        listView.renderItem(item);
    })
}

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    if (!state.likes.isLiked(state.recipe.id)) {
        const newLike = state.likes.addLike(
            state.recipe.id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        likesView.toggleLikeButton(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteItem(state.recipe.id);
        likesView.toggleLikeButton(false);
        likesView.deleteLike(state.recipe.id);
    }

    likesView.toggleLikesMenu(state.likes.getNumLikes());
}

elements.shopingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) { //Delete element from shopping list
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping-count-value')) { //Updates count for shopping list element
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});


/**
 * Add event listeners for recipe view
 */
elements.recipeView.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { //Decrease servings event
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { //Increase servings event
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn__add, .recipe__btn__add *')) { //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) { //Handling likes event
        controlLike();
    }
});

/**
 * Deletes all likes
 */
elements.deleteAllLikes.addEventListener('click', () => {
    const likes = state.likes.deleteAllLikes();
    likesView.toggleLikesMenu(likes);
    likesView.deleteAllLikes();
    
    if (state.recipe) {// In case user is viewing some receipe and removes all likes, recipe should toggle like btn
        likesView.toggleLikeButton(state.likes.isLiked(state.recipe.id));
    }
});

/**
 * Restore liked recepies when page loads
 */
 window.addEventListener('load', () => {
    state.likes = new Likes();//Create likes object
    state.list = new List(); //Creates shopping List object
    state.likes.readStorage();//Read saved likes from storage
    likesView.toggleLikesMenu(state.likes.getNumLikes());//Toggle menu button, based on like count
    state.likes.likes.forEach(el => likesView.renderLike(el));//Render likes
 });

 /**
  * Delets all input error elements
  */
const hideErrors = () => {
    Array.from(document.querySelectorAll(`.${elementStrings.errorClas}`)).forEach(errElement => errElement.remove());
}

/**
 * Add new item to shopping list from form
 */
 elements.shoppingItemForm.addEventListener('submit', e => {
     e.preventDefault();

     const inputs = [document.querySelector('[name="count"]'), document.querySelector('[name="unit"]'), document.querySelector('[name="description"]')];

     const itemValues = inputs.map(input => input.value.trim());
 
     if (state.list.isValidItem(...itemValues)) {
        const item = state.list.addItem(...itemValues);

        listView.renderItem(item);
        inputs.forEach(input => input.value = '');
        
        hideErrors();

     } else {
        itemValues.forEach((value, index) => {
            const errElement = inputs[index].parentElement.querySelector(`.${elementStrings.errorClas}`);
            
            if (!value) {
                if (!errElement) {
                    inputs[index].insertAdjacentHTML('afterend', `<p class="${elementStrings.errorClas}">Field is required!</p>`);
                }
            } else {
                if (errElement) {
                    errElement.remove();
                }
            }
        })
     }
 });