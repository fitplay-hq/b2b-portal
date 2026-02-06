import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const BundleOrderItemCreateManyInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyInput>;
export const BundleOrderItemCreateManyInputObjectZodSchema = makeSchema();
