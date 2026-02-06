import * as z from 'zod';

export const ProductCategoryScalarFieldEnumSchema = z.enum(['id', 'name', 'displayName', 'description', 'shortCode', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'])

export type ProductCategoryScalarFieldEnum = z.infer<typeof ProductCategoryScalarFieldEnumSchema>;