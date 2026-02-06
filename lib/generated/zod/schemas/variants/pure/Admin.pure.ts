import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const AdminModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: RoleSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type AdminPureType = z.infer<typeof AdminModelSchema>;
