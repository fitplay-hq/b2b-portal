import * as z from 'zod';
// prettier-ignore
export const SystemUserInputSchema = z.object({
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

export type SystemUserInputType = z.infer<typeof SystemUserInputSchema>;
