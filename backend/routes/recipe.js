import express from "express";
import Recipe from "../model/recipe.js";
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
import { cloudinary } from '../cloudinary/index.js';
import ExpressError from '../utils/ExpressError.js';
import { verifyToken, isAuthor, isRecipeAuthor } from "../middlewares.js";
import { recipeSchema } from "../schemas/recipeSchema.js";

const upload = multer({ storage });
const router = express.Router();

router.route('/')
    .get(catchAsync(async (req, res) => {
        const recipes = await Recipe.find({isDraft: false}).populate({path: "author"});
        res.json(recipes);
    }))
    .post(upload.any(), verifyToken, catchAsync(async (req, res) => {
        if (req.body.howManyServe === "null") {
            req.body.howManyServe = null;
        }
        const newRecipe = new Recipe(req.body);
        newRecipe.ingredients = JSON.parse(req.body.ingredients);
        newRecipe.processes = JSON.parse(req.body.processes);
        req.files.forEach(f => {
            if (f.fieldname === 'topImage') {
                newRecipe.topImage.url = f.path;
                newRecipe.topImage.filename = f.filename;
            } else if (f.fieldname.startsWith('processImage-')) {
                const index = parseInt(f.fieldname.slice(-1)[0]);
                newRecipe.processes[index].imageUrl = f.path;
                newRecipe.processes[index].imageFilename = f.filename;
            }
        });
        const result = recipeSchema.safeParse(newRecipe);
        if (!result.success) {
            throw new ExpressError("入力内容がエラーとなりました。内容の確認をお願いします。", 400);
        }
        await newRecipe.save();
        res.json(newRecipe);
    }));

router.route('/:recipeId')
    .get(catchAsync (async (req, res) => {
        const recipe = await Recipe.findById(req.params.recipeId).populate({path: "author"});
        res.json(recipe);
    }))
    .delete(verifyToken, isRecipeAuthor, catchAsync(async (req, res) => {
        const data = await Recipe.findByIdAndDelete(req.params.recipeId);
        if (data.topImage?.url) {
            await cloudinary.uploader.destroy(data.topImage.filename);
        }
        for (let process of data.processes) {
            if (process.hasImage) await cloudinary.uploader.destroy(process.imageFilename);
        }
        res.json(data)
    }));

router.route('/:recipeId/update')
    .get(verifyToken, isRecipeAuthor, catchAsync (async (req, res) => {
        const recipe = await Recipe.findById(req.params.recipeId).populate({path: "author"});
        res.json(recipe);
    }))
    .put(upload.any(), verifyToken, isRecipeAuthor, catchAsync (async (req, res) => {
        if (req.body.howManyServe === "null") {
            req.body.howManyServe = null;
        };
        const origin = await Recipe.findById(req.params.recipeId);
        const objToUpdate = req.body;
        objToUpdate.topImage = JSON.parse(req.body.topImage);
        objToUpdate.ingredients = JSON.parse(req.body.ingredients);
        objToUpdate.processes = JSON.parse(req.body.processes);

        req.files.forEach(f => {
            if (f.fieldname === 'topImage') {
                objToUpdate.topImage.url = f.path;
                objToUpdate.topImage.filename = f.filename;
            } else if (f.fieldname.startsWith('processImage-')) {
                const index = parseInt(f.fieldname.slice(-1)[0]);
                objToUpdate.processes[index].imageUrl = f.path;
                objToUpdate.processes[index].imageFilename = f.filename;
            }
        });
        console.log('PROCESSES', objToUpdate.supplement)
        const updatedImages = objToUpdate.processes.map(p => p.imageFilename);
        const originalImages = origin.processes.map(p => p.imageFilename);
        const diff = originalImages.filter(f => updatedImages.indexOf(f) === -1);
        for (let d of diff) {cloudinary.uploader.destroy(d)}

        const updatedItem = await Recipe.findByIdAndUpdate(req.params.recipeId, objToUpdate, {new: true});
        res.json(updatedItem)
    }))

router.route("/myitems/:userId")
    .get(verifyToken, isAuthor, catchAsync (async (req, res) => {
        const data = await Recipe.find({ author: req.params.userId}).populate({path: "author"});
        res.status(200).json(data);
    }));

export default router;

// const storagee = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, path.resolve(__dirname, 'uploads')),
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const date = new Date().toLocaleDateString().replaceAll('/', '');
//         const uniqueSuffix = date + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext)
//     },
// })
// const upload = multer({ storage: storagee});