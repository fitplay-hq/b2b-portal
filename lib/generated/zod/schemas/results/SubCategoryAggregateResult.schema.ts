import * as z from 'zod';
export const SubCategoryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    categoryId: z.number(),
    shortCode: z.number(),
    category: z.number(),
    products: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    categoryId: z.string().nullable(),
    shortCode: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    categoryId: z.string().nullable(),
    shortCode: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});