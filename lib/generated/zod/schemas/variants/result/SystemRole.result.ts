import * as z from 'zod';
// prettier-ignore
export const SystemRoleResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    permissions: z.array(z.unknown()),
    users: z.array(z.unknown())
}).strict();

export type SystemRoleResultType = z.infer<typeof SystemRoleResultSchema>;
