import * as z from 'zod';
export const BundleItemGroupByResultSchema = z.array(z.object({
  id: z.string(),
  bundleId: z.string(),
  productId: z.string(),
  bundleProductQuantity: z.number().int(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    bundleId: z.number(),
    bundle: z.number(),
    product: z.number(),
    productId: z.number(),
    bundleProductQuantity: z.number(),
    price: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    bundleOrderItems: z.number()
  }).optional(),
  _sum: z.object({
    bundleProductQuantity: z.number().nullable(),
    price: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    bundleProductQuantity: z.number().nullable(),
    price: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    bundleId: z.string().nullable(),
    productId: z.string().nullable(),
    bundleProductQuantity: z.number().int().nullable(),
    price: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    bundleId: z.string().nullable(),
    productId: z.string().nullable(),
    bundleProductQuantity: z.number().int().nullable(),
    price: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));