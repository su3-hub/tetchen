const __dirname = import.meta.dirname;
import dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: path.resolve(__dirname, '../..', 'backend', '.env')});
};
import mongoose from 'mongoose';
import Recipe from "./recipe.js";

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(()=> console.log('Mongo connection open!'))
    .catch((err)=> console.log('Mongo connection error.'));


const recipes = await Recipe.find();

// for (const recipe of recipes) {
//     console.log(recipe.title);
//     recipe.ingredients.forEach(async(ing) => {
//         let qty;
//         if (ing.unit === '大さじ' || ing.unit === '小さじ') {
//             qty = ing.unit+ing.qty;
//             ing.qty = qty;
//         } else {
//             qty = String(ing.qty)+ing.unit;
//             ing.qty = qty;
//         }
//     })
//     console.log(recipe.title, recipe.ingredients);
//     await recipe.save();
// }

// await Recipe.updateMany({}, {$unset : {"ingredients.$[].unit": ""}})