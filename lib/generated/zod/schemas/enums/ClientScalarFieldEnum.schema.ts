import * as z from 'zod';

export const ClientScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'password', 'phone', 'companyID', 'companyName', 'isShowPrice', 'address', 'role', 'createdAt', 'updatedAt'])

export type ClientScalarFieldEnum = z.infer<typeof ClientScalarFieldEnumSchema>;