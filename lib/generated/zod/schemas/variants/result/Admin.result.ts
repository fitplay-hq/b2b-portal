import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const AdminResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: RoleSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type AdminResultType = z.infer<typeof AdminResultSchema>;
