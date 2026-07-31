import z from "zod";


export const signupSchema = z.object(
    {
        username: z.string().min(4).max(18),
        password: z.string().min(4).max(18)
    }
)

export const signinSchema = z.object(
    {
        username: z.string().min(4).max(18),
        password: z.string().min(4).max(18)
    }
)

export const idSchema = z.cuid();

export type signupType = z.infer<typeof signupSchema>
export type signinType = z.infer<typeof signinSchema>
export type idType = z.infer<typeof idSchema>