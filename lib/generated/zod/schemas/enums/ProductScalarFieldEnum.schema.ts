import * as z from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'name', 'images', 'price', 'sku', 'availableStock', 'minStockThreshold', 'inventoryUpdateReason', 'inventoryLogs', 'description', 'categories', 'categoryId', 'subCategoryId', 'avgRating', 'noOfReviews', 'brand', 'createdAt', 'updatedAt'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;