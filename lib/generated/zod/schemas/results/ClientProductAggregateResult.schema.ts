import * as z from 'zod';
export const ClientProductAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    client: z.number(),
    clientId: z.number(),
    product: z.number(),
    productId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    clientId: z.string().nullable(),
    productId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    clientId: z.string().nullable(),
    productId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});