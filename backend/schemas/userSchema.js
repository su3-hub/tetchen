import * as z from "zod";

export const userRegistrationSchema = z.object({
    username: z.string().min(3, "ユーザー名は３文字以上必要です。"),
    email: z.email("有効なメールアドレスを入力してください。"),
    password: z.string().min(3, "パスワードは３文字以上必要です。")
});

export const loginSchema = z.object({
    email: z.email("有効なメールアドレスを入力してください。"),
    password: z.string().min(3, "パスワードは3文字以上です。")
})