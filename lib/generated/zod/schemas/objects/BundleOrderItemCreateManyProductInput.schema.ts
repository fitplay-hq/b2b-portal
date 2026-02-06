import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  orderId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const BundleOrderItemCreateManyProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyProductInput>;
export const BundleOrderItemCreateManyProductInputObjectZodSchema = makeSchema();
