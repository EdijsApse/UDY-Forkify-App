import { elements } from './base';
import { convertTitle } from './searchView';

/**
 * Toggle like button, bsed on if recipe is in likes list
 * 
 * @param {*} isLiked 
 */
export const toggleLikeButton = isLiked => {
    const iconStr  = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconStr}`);
}

/**
 * Toggle likes menu, based on likes count
 * 
 * @param {*} numLikes 
 */
export const toggleLikesMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

/**
 * 
 * Render likes item in likes list
 * 
 * @param {*} like 
 */
export const renderLike = like => {
    const template = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${convertTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesList.insertAdjacentHTML('afterbegin', template);
}

/**
 * Delete like from UI
 * 
 * @param {*} id 
 */
export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) {
        el.remove();
    }
}