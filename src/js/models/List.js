export default class List {
    constructor() {
        this.items = [];
    }

    /**
     * 
     * Add new Element to list
     * 
     * @param {*} count 
     * @param {*} unit 
     * @param {*} ingredient 
     */
    addItem(count, unit, ingredient) {
        const item = {
            id:Date.now(),
            count,
            unit,
            ingredient
        };
        
        this.items.push(item);

        return item;
    }

    /**
     * Deletes element
     * 
     * @param {*} id 
     */
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id == id);//Get index of element where ids match
        this.items.splice(index, 1);//Start at index where item was found, and remove 1 (Returns deleted item, and mutate(changes) array)
    }

    /**
     * 
     * Updates items new count
     * 
     * @param {*} id 
     * @param {*} newCount 
     */
    updateCount(id, newCount) {
        //ES6 find method returns element, which matches
        //and then we tell we want count of this element to be old count + new count
        this.items.find(el => el.id == id).count += newCount;
    }
}