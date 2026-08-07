import z from "zod";

export const uploadSchema  = z.object(
    {
        url: z.string(),
        projectName: z.string(),
        directory: z.string().optional(),
        env: z.json().optional()
    }
)

export type uploadType = z.infer<typeof uploadSchema>