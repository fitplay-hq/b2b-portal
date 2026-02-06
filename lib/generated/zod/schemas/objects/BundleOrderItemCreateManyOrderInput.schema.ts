import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const BundleOrderItemCreateManyOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyOrderInput>;
export const BundleOrderItemCreateManyOrderInputObjectZodSchema = makeSchema();
