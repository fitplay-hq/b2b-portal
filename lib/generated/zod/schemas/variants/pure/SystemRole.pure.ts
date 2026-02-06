import * as z from 'zod';
// prettier-ignore
export const SystemRoleModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    permissions: z.array(z.unknown()),
    users: z.array(z.unknown())
}).strict();

export type SystemRolePureType = z.infer<typeof SystemRoleModelSchema>;
