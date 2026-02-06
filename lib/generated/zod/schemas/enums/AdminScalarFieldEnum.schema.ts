import * as z from 'zod';

export const AdminScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt'])

export type AdminScalarFieldEnum = z.infer<typeof AdminScalarFieldEnumSchema>;