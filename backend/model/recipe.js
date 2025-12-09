import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLnegth: 20,
    },
    topImage: {
        url: String,
        filename: String,
    },
    caption: {
        type: String,
        required: true,
        maxLength: 100,
    },
    howManyServe: {
        type: Number,
        max: 5,
        min: 1,
    },
    ingredients: [{
        name: {
            type: String,
        },
        qty: {
            type: Number,
        },
        unit: {
            type: String,
        },
        _id: false,
    }],
    processes: [{
        imageUrl: String,
        imageFilename: String,
        description: {
            type: String,
            required: true,
        },
        hasImage: Boolean,
        _id: false
    }],
    supplement: String,
    isDraft: {
        type: Boolean,
        required: true,
    },
    tags: {
        type: Schema.Types.ObjectId,
        ref: 'tag'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipes', recipeSchema);
export default Recipe;
