import * as z from 'zod';

export const CompanyScalarFieldEnumSchema = z.enum(['id', 'name', 'address', 'createdAt', 'updatedAt'])

export type CompanyScalarFieldEnum = z.infer<typeof CompanyScalarFieldEnumSchema>;