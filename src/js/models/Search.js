import axios from 'axios';

/**
 * Exports Search model, fo searching recipes 
 */
export default class Search {
    constructor(q) {
        this.query = q;
    }

    async getResults() {
        try {
            const res = await axios(`http://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.results = res.data.recipes;
        } catch(error) {
            //@todo Some notification
        }
        
    }
}