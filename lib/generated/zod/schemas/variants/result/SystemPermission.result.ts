import * as z from 'zod';
// prettier-ignore
export const SystemPermissionResultSchema = z.object({
    id: z.string(),
    resource: z.string(),
    action: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roles: z.array(z.unknown())
}).strict();

export type SystemPermissionResultType = z.infer<typeof SystemPermissionResultSchema>;
