import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  totalAmount: z.literal(true).optional(),
  numberOfBundles: z.literal(true).optional()
}).strict();
export const OrderSumAggregateInputObjectSchema: z.ZodType<Prisma.OrderSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderSumAggregateInputType>;
export const OrderSumAggregateInputObjectZodSchema = makeSchema();
