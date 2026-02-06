import * as z from 'zod';

export const SystemRoleScalarFieldEnumSchema = z.enum(['id', 'name', 'description', 'isActive', 'createdAt', 'updatedAt'])

export type SystemRoleScalarFieldEnum = z.infer<typeof SystemRoleScalarFieldEnumSchema>;