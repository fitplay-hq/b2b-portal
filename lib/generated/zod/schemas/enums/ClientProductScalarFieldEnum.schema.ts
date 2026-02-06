import * as z from 'zod';

export const ClientProductScalarFieldEnumSchema = z.enum(['id', 'clientId', 'productId', 'createdAt', 'updatedAt'])

export type ClientProductScalarFieldEnum = z.infer<typeof ClientProductScalarFieldEnumSchema>;