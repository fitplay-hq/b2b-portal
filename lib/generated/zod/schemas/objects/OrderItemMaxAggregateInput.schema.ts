import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const OrderItemMaxAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemMaxAggregateInputType>;
export const OrderItemMaxAggregateInputObjectZodSchema = makeSchema();
