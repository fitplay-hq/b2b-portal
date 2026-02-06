import * as z from 'zod';
// prettier-ignore
export const SystemUserModelSchema = z.object({
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

export type SystemUserPureType = z.infer<typeof SystemUserModelSchema>;
