import * as z from 'zod';
// prettier-ignore
export const SystemUserResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    isActive: z.boolean(),
    role: z.unknown(),
    roleId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type SystemUserResultType = z.infer<typeof SystemUserResultSchema>;
