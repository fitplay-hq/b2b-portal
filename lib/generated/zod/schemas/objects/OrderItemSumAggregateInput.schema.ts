import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const OrderItemSumAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSumAggregateInputType>;
export const OrderItemSumAggregateInputObjectZodSchema = makeSchema();
