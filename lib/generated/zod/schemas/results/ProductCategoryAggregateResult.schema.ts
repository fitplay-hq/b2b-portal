import * as z from 'zod';
export const ProductCategoryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    displayName: z.number(),
    description: z.number(),
    shortCode: z.number(),
    isActive: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    products: z.number(),
    subCategories: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    displayName: z.string().nullable(),
    description: z.string().nullable(),
    shortCode: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    displayName: z.string().nullable(),
    description: z.string().nullable(),
    shortCode: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});