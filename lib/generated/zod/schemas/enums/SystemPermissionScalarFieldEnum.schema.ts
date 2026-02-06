import * as z from 'zod';

export const SystemPermissionScalarFieldEnumSchema = z.enum(['id', 'resource', 'action', 'description', 'createdAt', 'updatedAt'])

export type SystemPermissionScalarFieldEnum = z.infer<typeof SystemPermissionScalarFieldEnumSchema>;