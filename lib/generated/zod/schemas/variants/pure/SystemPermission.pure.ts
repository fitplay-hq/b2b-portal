import * as z from 'zod';
// prettier-ignore
export const SystemPermissionModelSchema = z.object({
    id: z.string(),
    resource: z.string(),
    action: z.string(),
    description: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roles: z.array(z.unknown())
}).strict();

export type SystemPermissionPureType = z.infer<typeof SystemPermissionModelSchema>;
