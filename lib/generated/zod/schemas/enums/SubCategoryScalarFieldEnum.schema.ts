import * as z from 'zod';

export const SubCategoryScalarFieldEnumSchema = z.enum(['id', 'name', 'categoryId', 'shortCode', 'createdAt', 'updatedAt'])

export type SubCategoryScalarFieldEnum = z.infer<typeof SubCategoryScalarFieldEnumSchema>;