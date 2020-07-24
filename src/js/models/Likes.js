export default class Likes {
    constructor() {
        this.likes = [];
    }

    /**
     * Add like to list
     * 
     * @param {*} id 
     * @param {*} title 
     * @param {*} author 
     * @param {*} image 
     */
    addLike(id, title, author, image) {
        const like = {
            id,
            title, 
            author,
            image
        };

        this.likes.push(like);
        this.persistData();

        return like;
    }

    /**
     * Deletes like element
     * 
     * @param {*} id 
     */
    deleteItem(id) {
        const index = this.likes.findIndex(el => el.id == id);//Get index of element where ids match
        this.likes.splice(index, 1);//Start at index where item was found, and remove 1 (Returns deleted item, and mutate(changes) array)
        this.persistData();
    }

    /**
     * Checks if recepie is liked
     * 
     * @param {*} id 
     */
    isLiked(id) {
        return this.likes.findIndex(el => el.id == id) !== -1 ? true : false;
    }

    /**
     * Get likes count
     */
    getNumLikes() {
        return this.likes.length;
    }

    /**
     * Saves likes to localStorage
     */
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    /**
     * Restore saved likes from local storage
     */
    readStorage() {
        const likes = JSON.parse(localStorage.getItem('likes'));
        
        if (likes) {
            this.likes = likes;
        }
    }
}