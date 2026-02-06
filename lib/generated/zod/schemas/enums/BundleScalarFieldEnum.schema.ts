import * as z from 'zod';

export const BundleScalarFieldEnumSchema = z.enum(['id', 'orderId', 'price', 'numberOfBundles', 'createdAt', 'updatedAt'])

export type BundleScalarFieldEnum = z.infer<typeof BundleScalarFieldEnumSchema>;