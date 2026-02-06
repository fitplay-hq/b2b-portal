import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const BundleOrderItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemAvgAggregateInputType>;
export const BundleOrderItemAvgAggregateInputObjectZodSchema = makeSchema();
