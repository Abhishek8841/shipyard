import zod from "zod";

export const sendLogSchema = zod.object(
    {
        userId: zod.string,
        payload: zod.object(
            {
                deploymentId: zod.string,
                log: zod.string,
            }
        )
    }
)

export type sendLogType = zod.infer<typeof sendLogSchema>;