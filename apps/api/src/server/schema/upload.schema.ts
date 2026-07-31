import z from "zod";

export const uploadSchema  = z.object(
    {
        url: z.string(),
        projectName: z.string(),
    }
)

export type uploadType = z.infer<typeof uploadSchema>