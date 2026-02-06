import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const ResetTokenResultSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    password: z.string(),
    token: z.string(),
    userId: z.string().nullable(),
    userType: RoleSchema.nullable(),
    expires: z.date(),
    createdAt: z.date()
}).strict();

export type ResetTokenResultType = z.infer<typeof ResetTokenResultSchema>;
