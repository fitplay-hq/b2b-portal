import * as z from 'zod';
export const OrderEmailAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    order: z.number(),
    orderId: z.number(),
    purpose: z.number(),
    isSent: z.number(),
    sentAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    sentAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    orderId: z.string().nullable(),
    sentAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});