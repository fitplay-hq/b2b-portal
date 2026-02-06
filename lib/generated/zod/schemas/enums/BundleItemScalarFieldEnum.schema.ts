import * as z from 'zod';

export const BundleItemScalarFieldEnumSchema = z.enum(['id', 'bundleId', 'productId', 'bundleProductQuantity', 'price', 'createdAt', 'updatedAt'])

export type BundleItemScalarFieldEnum = z.infer<typeof BundleItemScalarFieldEnumSchema>;