import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const LoginTokenInputSchema = z.object({
    id: z.string(),
    token: z.string(),
    identifier: z.string(),
    password: z.string(),
    userId: z.string().optional().nullable(),
    userType: RoleSchema.optional().nullable(),
    createdAt: z.date(),
    expires: z.date()
}).strict();

export type LoginTokenInputType = z.infer<typeof LoginTokenInputSchema>;
