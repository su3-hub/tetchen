import * as z from "zod";

export const recipeSchema = z.object({
    title: z.string()
        .min(1, "タイトルを入力してください。")
        .max(20, "タイトルは20文字までです。"),
    topImage: z.object({
        url: z.union([z.null(), z.url().optional()]),
        file: z.union([z.null(), z.file().optional()]),
        filename: z.union([z.null(), z.string().optional()]),
    }).optional(),
    caption: z.string().max(100, "紹介文は100文字です。"),
    howManyServe: z.union([z.null(), z.coerce.number().min(1).max(5).optional()]),
    ingredients: z.array(z.object({
        name: z.string("食材を入力してください。")
            .min(1, "食材を入力してください。")
            .max(15, "食材名は15文字までです。"),
        qty: z.coerce.number(),
        unit: z.string()
            .min(1, "分量の単位を入力してください。")
            .max(6, "単位は6文字までです。"),
    })),
    processes: z.array(z.object({
        description: z
            .string("説明文は100文字までです。")
            .min(1, "説明文を入力してください。")
            .max(100, "説明文は100文字までです。"),
        imageUrl: z.union([z.null(), z.url()]).optional(),
        imageFilename: z.union([z.null(), z.string()]).optional(),
        file: z.union([z.null(), z.file()]).optional(),
    })),
    isDraft: z.boolean().optional(),
    tags: z.array(z.string().max(10, "タグは10文字までです。")).optional(),
});