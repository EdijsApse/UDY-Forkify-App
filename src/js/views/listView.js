import { elements } from './base';

/**
 * 
 * Add new item to DOM
 * 
 * @param {*} item 
 */
export const renderItem = item => {
    const template = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping-count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shopingList.insertAdjacentHTML('beforeend', template);
};

/**
 * 
 * Removes item from DOM
 * 
 * @param {*} id 
 */
export const deleteItem = id => {
    document.querySelector(`[data-itemid="${id}"]`).remove();
}