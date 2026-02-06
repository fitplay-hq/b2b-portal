import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const OrderItemCountAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCountAggregateInputType>;
export const OrderItemCountAggregateInputObjectZodSchema = makeSchema();
