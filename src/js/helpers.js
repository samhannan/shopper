import { flatten, add, random } from 'lodash';
import { MEASUREMENT_WEIGHT } from './constants';
import { lowerCase, upperFirst, trim } from 'lodash';

export const measurementString = (ingredient) => {
    if (ingredient.measurement === MEASUREMENT_WEIGHT) {
        return `${ingredient.quantity}g`;
    }
    return `x${ingredient.quantity}`;
}

export const generateKey = () => random(1000, 9999);

export const generateRecipeIngredients = (recipes) => {
    console.log(recipes);
    let ingredients = flatten(recipes.map(recipe => recipe.ingredients));
    let combined = [];

    // Preserve the original ingredient name. We'll need this later
    ingredients = ingredients.map(ingredient => ({
        ...ingredient,
        normalised_name: upperFirst(lowerCase(trim(ingredient.name)))
    }));

    // Combine ingredients and add/subtract quantities
    ingredients.forEach(ingredient => {
        const existingIndex = combined.findIndex(combinedIngredient =>
            combinedIngredient.normalised_name === ingredient.normalised_name && combinedIngredient.measurement === ingredient.measurement
        );

        if (existingIndex === -1) {
            combined.push(ingredient);
        } else {
            combined[existingIndex].quantity = parseInt(combined[existingIndex].quantity) + parseInt(ingredient.quantity);
        }
    });

    // Generate the 'combined' ingredient name
    combined = combined.map(ingredient => ({
        ...ingredient,
        name: `${ingredient.normalised_name} (${measurementString(ingredient)})`
    }));

    return combined;
}
