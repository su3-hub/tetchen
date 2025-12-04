import jwt, { decode } from "jsonwebtoken";
import Recipe from "./model/recipe.js";
import User from "./model/user.js";
import ExpressError from "./utils/ExpressError.js";

export const verifyToken = (req, res, next)=> {
    const token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
        const tokenBody = token.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(tokenBody, process.env.JWT_SECRET);
            if (req.body) {
                req.body.author = decodedPayload.id;
            };
            req.author = decodedPayload.id;
            next();
        } catch (error) {
            throw new ExpressError("無効なトークンです。", 403);
        }
    } else {
        throw new ExpressError("認証トークンがありません。", 401);
    };
}

export const isRecipeAuthor = async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.recipeId);
    console.log('author', recipe.author.equals(req.author))
    if (recipe && recipe.author.equals(req.author)) {
        next();
    } else {
        throw new ExpressError("このリソースを操作する権限がありません。", 403)
    }
};

export const isAuthor = async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (user._id.equals(req.userId)) {
        next();
    } else {
        throw new ExpressError("このリソースを操作する権限がありません。", 403);
    };
};

function sanitizeObj (obj) {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key.startsWith("$")) {
                    delete obj[key];
                } else {
                    sanitizeObj(obj[key])
                }
            }
        }
    }
}

export const myMongoSanitize = (req, res, next) => {
    sanitizeObj(req.body);
    sanitizeObj(req.params);
    sanitizeObj(req.query);
    next();
}