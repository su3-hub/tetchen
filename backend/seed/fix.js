import mongoose from "mongoose";
import Recipe from "../model/recipe.js";

const uri = process.env.MONGO_URI;
mongoose.connect("mongodb+srv://goldblendot_db_user:srlJlwVas4MKPpQR@campsite.ashvfgo.mongodb.net/tetchen?retryWrites=true&w=majority&appName=campsite")
    .then(()=> console.log('Mongo connection open!'))
    .catch((err)=> console.log('Mongo connection error.'));

const fixData = async () => {
    const recipe = await Recipe.findById("691b3045b5312713561033f4");
    recipe.author = "692081842c200f493330bf1d";
    await recipe.save();
    // for (let recipe of recipes) {
    //     if (recipe._id.toString() !== "6921ecd03f0ddc30e543919d") {
    //         recipe.author = "692081842c200f493330bf1d";
    //         recipe.isDraft = false;
    //         await recipe.save();
    //     }
    // }
}

fixData()