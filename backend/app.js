const __dirname = import.meta.dirname;
import dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: path.resolve(__dirname, '..', 'backend', '.env')});
};

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js";
import recipeRoutes from "./routes/recipe.js";
import userRoutes from "./routes/user.js";
import { cloudinary } from './cloudinary/index.js';
import { myMongoSanitize } from './middlewares.js';
import helmet from "helmet";

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(()=> console.log('Mongo connection open!'))
    .catch((err)=> console.log('Mongo connection error.'));

const app = express();

const allowedOrigins = [
    "https://tetchen-tak3.vercel.app",
    "http://localhost:5173",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(myMongoSanitize);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'))
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

const scriptSrcUrls = [
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css",
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://cdn.jsdelivr.net",
];

app.use(helmet({ 
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtpqdkl1w/",
            ],
        }
    }
 }));

// routing
app.use('/recipes', recipeRoutes);
app.use('/user', userRoutes);

app.all(/(.*)/, (req, res, next) => {
    return next(new ExpressError('That Page Not Found!', 404))
});

app.use((err, req, res, next) => {
    if (req.files) {
        console.log("エラー発生のため、アップロードされた画像を削除します。");

        req.files.forEach(async(f) => {
            await cloudinary.uploader.destroy(f.filename);
        })
    }
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = '問題が発生しました。お手数ですがやり直しをお願いします。';
    console.log(err)
    res.status(err.statusCode).json(err);
});

app.listen(3000, ()=> {
    console.log('Listening on port: 3000!');
});

export default app;