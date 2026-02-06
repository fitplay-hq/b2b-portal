import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const ResetTokenInputSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    password: z.string(),
    token: z.string(),
    userId: z.string().optional().nullable(),
    userType: RoleSchema.optional().nullable(),
    expires: z.date(),
    createdAt: z.date()
}).strict();

export type ResetTokenInputType = z.infer<typeof ResetTokenInputSchema>;
