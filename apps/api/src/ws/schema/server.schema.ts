import zod from "zod";

export const sendLogSchema = zod.object(
    {
        deploymentId: zod.string(),
        log: zod.string(),
    }
)

export type sendLogType = zod.infer<typeof sendLogSchema>;