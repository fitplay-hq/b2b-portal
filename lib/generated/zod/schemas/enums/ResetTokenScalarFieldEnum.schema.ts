import * as z from 'zod';

export const ResetTokenScalarFieldEnumSchema = z.enum(['id', 'identifier', 'password', 'token', 'userId', 'userType', 'expires', 'createdAt'])

export type ResetTokenScalarFieldEnum = z.infer<typeof ResetTokenScalarFieldEnumSchema>;