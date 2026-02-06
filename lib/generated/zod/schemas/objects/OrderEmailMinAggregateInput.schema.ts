import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  isSent: z.literal(true).optional(),
  sentAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const OrderEmailMinAggregateInputObjectSchema: z.ZodType<Prisma.OrderEmailMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailMinAggregateInputType>;
export const OrderEmailMinAggregateInputObjectZodSchema = makeSchema();
