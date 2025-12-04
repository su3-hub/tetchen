import { frontendRecipeSchema } from "./recipeSchema.js";

const recipe = {
    title: 'pasta',
    caption: 'true"type": "module"',
    howManyServe: '3',
    ingredients: [
        {name: 'carrot', qty: '500', unit: 'g'}
    ],
    processes: [
        {
            description: 'burning!',
            imageUrl: 'https://zod.dev/api'
        }
    ],
    isDraft: false,
};

const result = frontendRecipeSchema.safeParse(recipe);
console.log(result.data);