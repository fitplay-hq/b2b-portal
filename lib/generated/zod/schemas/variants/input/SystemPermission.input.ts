import * as z from 'zod';
// prettier-ignore
export const SystemPermissionInputSchema = z.object({
    id: z.string(),
    resource: z.string(),
    action: z.string(),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roles: z.array(z.unknown())
}).strict();

export type SystemPermissionInputType = z.infer<typeof SystemPermissionInputSchema>;
