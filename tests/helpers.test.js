import { generateRecipeIngredients, measurementString } from './../src/js/helpers';
import { MEASUREMENT_QUANTITY, MEASUREMENT_WEIGHT } from './../src/js/constants';

describe('test measurement string', () => {
    test('the correct string is returned using quantity', () => {
        expect(measurementString({
            measurement: MEASUREMENT_QUANTITY,
            quantity: 2
        })).toEqual('x2');
    });
    test('the correct string is returned using weight', () => {
        expect(measurementString({
            measurement: MEASUREMENT_WEIGHT,
            quantity: 2
        })).toEqual('2g');
    });
})

describe('test recipe ingredient generator', () => {
    test('the generator will gather ingredients from multiple recipes', () => {
        const recipes = [
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Mince',
                    },
                ]
            },
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Chicken',
                    },
                ]
            },
        ]
        expect(generateRecipeIngredients(recipes)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    normalised_name: 'Mince',
                    measurement: 'weight',
                    name: 'Mince (300g)',
                    quantity: 300,
                }),
            ])
        )
    });

    test('the generator combines duplicate ingredients by weight', () => {
        const recipes = [
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Mince',
                    },
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Mince',
                    },
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Chicken',
                    },
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Chicken',
                    },
                ]
            },
        ]
        expect(generateRecipeIngredients(recipes)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    normalised_name: 'Mince',
                    measurement: 'weight',
                    name: 'Mince (600g)',
                    quantity: 600,
                }),
                expect.objectContaining({
                    normalised_name: 'Chicken',
                    measurement: 'weight',
                    name: 'Chicken (600g)',
                    quantity: 600,
                })
            ])
        )
    });

    test('the generator combines duplicate ingredients by quantity', () => {
        const recipes = [
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'Mince',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 2,
                        name: 'Mince',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'Chicken',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 2,
                        name: 'Chicken',
                    },
                ]
            },
        ]
        expect(generateRecipeIngredients(recipes)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    normalised_name: 'Mince',
                    measurement: 'quantity',
                    name: 'Mince (x3)',
                    quantity: 3,
                }),
                expect.objectContaining({
                    normalised_name: 'Chicken',
                    measurement: 'quantity',
                    name: 'Chicken (x3)',
                    quantity: 3,
                })
            ])
        )
    });

    test('the generator does not combine ingredients if the measurement is different', () => {
        const recipes = [
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'Mince',
                    },
                    {
                        measurement: MEASUREMENT_WEIGHT,
                        quantity: 300,
                        name: 'Mince',
                    },
                ]
            },
        ]
        expect(generateRecipeIngredients(recipes)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    normalised_name: 'Mince',
                    measurement: 'quantity',
                    name: 'Mince (x1)',
                    quantity: 1,
                }),
                expect.objectContaining({
                    normalised_name: 'Mince',
                    measurement: 'weight',
                    name: 'Mince (300g)',
                    quantity: 300,
                })
            ])
        )
    });

    test('the generator combines duplicate ingredients with subtle differences', () => {
        const recipes = [
            {
                ingredients: [
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'Garlic',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'Garlic ',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: ' Garlic',
                    },
                    {
                        measurement: MEASUREMENT_QUANTITY,
                        quantity: 1,
                        name: 'garlic',
                    },
                ]
            },
        ]
        expect(generateRecipeIngredients(recipes)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    normalised_name: 'Garlic',
                    measurement: 'quantity',
                    name: 'Garlic (x4)',
                    quantity: 4,
                }),
            ])
        )
    });
})