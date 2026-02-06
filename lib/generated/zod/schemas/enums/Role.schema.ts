import * as z from 'zod';

export const RoleSchema = z.enum(['ADMIN', 'CLIENT', 'SYSTEM_USER'])

export type Role = z.infer<typeof RoleSchema>;