import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.js"
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { userRegistrationSchema, loginSchema } from "../schemas/userSchema.js"

const router = express.Router();
const saltRounds = 10;

router.route("/register")
    .post(catchAsync (async (req, res, next) => {
        const result = userRegistrationSchema.safeParse(req.body);
        if (!result.success) {
            throw new ExpressError("入力内容についてエラーが発生しました。入力内容を確認してください。", 400);
        }
        const { username, email, password } = req.body;
        try {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new User({username, email, password: hashPassword});
            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d"}
            );
            await newUser.save();
            return res.status(200).json({ message: "アカウント作成成功！", newUser, token });
        } catch (error) {
            console.error(error);
            throw new ExpressError("", 400);
        }
    }));

router.route("/login")
    .post(catchAsync (async (req, res) => {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            throw new ExpressError("入力内容についてエラーが発生しました。入力内容を確認してください。", 400);
        };
        const { email, password } = req.body;
        const user = await User.findOne({email})
        if (!user) return res.status(401).send("認証情報が正しくありません");
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d"}
            );
            return res.status(200).json({ message: "ログイン成功！", user, token });
        } else {
            throw new ExpressError("認証情報が正しくありません。", 400);
        }
    }))
export default router;