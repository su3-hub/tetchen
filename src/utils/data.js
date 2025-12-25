import { createUniqueId } from "./actions";

export const initialRecipe = {
        title: '',
        caption: '',
        topImageFile: null,
        topImageUrl: '',
        howManyServe: null,
        ingredients: [{ name: '', qty: '', }],
        processes: [{ description: '', hasImage: false, file: null, imageUrl: null, iamgeFilename: null, tempKey: createUniqueId(),}],
        isDraft: false,
        supplement: '',
    };