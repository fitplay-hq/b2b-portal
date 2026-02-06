import * as z from 'zod';

export const BundleOrderItemScalarFieldEnumSchema = z.enum(['id', 'bundleId', 'orderId', 'productId', 'quantity', 'price'])

export type BundleOrderItemScalarFieldEnum = z.infer<typeof BundleOrderItemScalarFieldEnumSchema>;