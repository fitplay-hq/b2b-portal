import * as z from 'zod';
export const BundleGroupByResultSchema = z.array(z.object({
  id: z.string(),
  orderId: z.string(),
  price: z.number(),
  numberOfBundles: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    orderId: z.number(),
    order: z.number(),
    price: z.number(),
    numberOfBundles: z.number(),
    items: z.number(),
    bundleOrderItems: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    price: z.number().nullable(),
    numberOfBundles: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    price: z.number().nullable(),
    numberOfBundles: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    price: z.number().nullable(),
    numberOfBundles: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    price: z.number().nullable(),
    numberOfBundles: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));