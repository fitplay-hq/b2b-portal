import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  price: z.literal(true).optional(),
  numberOfBundles: z.literal(true).optional()
}).strict();
export const BundleSumAggregateInputObjectSchema: z.ZodType<Prisma.BundleSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleSumAggregateInputType>;
export const BundleSumAggregateInputObjectZodSchema = makeSchema();
