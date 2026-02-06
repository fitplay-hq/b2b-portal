import * as z from 'zod';

export const LoginTokenScalarFieldEnumSchema = z.enum(['id', 'token', 'identifier', 'password', 'userId', 'userType', 'createdAt', 'expires'])

export type LoginTokenScalarFieldEnum = z.infer<typeof LoginTokenScalarFieldEnumSchema>;