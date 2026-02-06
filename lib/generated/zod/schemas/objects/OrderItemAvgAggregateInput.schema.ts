import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const OrderItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemAvgAggregateInputType>;
export const OrderItemAvgAggregateInputObjectZodSchema = makeSchema();
