import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    /**
     * Trying to get recipe based on passed id
     */
    async getRecipe() {
        try {
            const recipe = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            
            this.title = recipe.data.recipe.title;
            this.author = recipe.data.recipe.publisher;
            this.image = recipe.data.recipe.image_url;
            this.url = recipe.data.recipe.source_url;
            this.ingredients = recipe.data.recipe.ingredients;

            this.parseIngredients();
            this.calcTime();
            this.calcServings();
            
        } catch (error) {
            //@todo Error notification
        }
    }

    /**
     * Assuming we need 15 minutes for each 3 ingredients to cook
     */
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    /**
     * For how many people food will be serve
     */
    calcServings() {
        this.servings = 4;
    }

    /**
     * Parse ingredients
     * Removes parentheses
     * Replace units with short versions
     * Extract units and unit counts
     */
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];//Units to search for
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];//Short version of units, that are in unitsLong arr
        const units = [...unitsShort, 'g', 'kg'];//takes all elements from unitsShort and add g and kg unit (basically array merge)
        
        const newIngredients = this.ingredients.map(el => {//For each ingredient
            let ingredient = el.toLowerCase();
            
            unitsLong.forEach((unit, index) => {//loop over long units
                ingredient = ingredient.replace(unit, unitsShort[index]);//Replace unit with its short version
            });
            

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');//Replaces parantheses with text inside

            const arrIng = ingredient.split(' ');//Spliting ingredient into array

            //Loops over array, trying to find if element is in unitsShort array, returns index, if is, -1 otherwise
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIngredient;

            if (unitIndex > -1) { //Unit is found
                const arrCount = arrIng.slice(0, unitIndex); //Ex 4 1/2 cups => arrCount will be 4 1/2. Return array which will probably contains count for ingredient, which was found
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));//In case 1-1/3 (means 1 + 1/3)
                } else {
                    //For example arrIng.slice returns ['4', '1/2'] => then we join both els with + sign and then with eval we tell JS to do the math, so count will be 4.5 
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                
                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')//Everything else except unit and count
                };
            } else if (parseInt(arrIng[0])) { //There is no unit, but 1st element is number which means count  of some ingrdient
                objIngredient = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') //returns array without first element
                };
            } else if (unitIndex === -1) { //No unit found and first element is not a number
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient //No need to write ingredient:ingredient, if property and variable match
                };
            }

            return objIngredient;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(ingredient => {
            if (type === 'dec') {
                if (ingredient.count > 1) {
                    ingredient.count = Math.floor(ingredient.count - (newServings / this.servings));
                }
            } else {
                ingredient.count = Math.floor(ingredient.count + (newServings / this.servings));
            }
        });

        this.servings = newServings;

    }
}