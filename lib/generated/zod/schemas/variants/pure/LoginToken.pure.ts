import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const LoginTokenModelSchema = z.object({
    id: z.string(),
    token: z.string(),
    identifier: z.string(),
    password: z.string(),
    userId: z.string().nullable(),
    userType: RoleSchema.nullable(),
    createdAt: z.date(),
    expires: z.date()
}).strict();

export type LoginTokenPureType = z.infer<typeof LoginTokenModelSchema>;
