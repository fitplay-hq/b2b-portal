import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const AdminInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: RoleSchema.optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type AdminInputType = z.infer<typeof AdminInputSchema>;
