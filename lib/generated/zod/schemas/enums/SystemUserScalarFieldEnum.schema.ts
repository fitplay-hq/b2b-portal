import * as z from 'zod';

export const SystemUserScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'password', 'isActive', 'roleId', 'createdAt', 'updatedAt'])

export type SystemUserScalarFieldEnum = z.infer<typeof SystemUserScalarFieldEnumSchema>;