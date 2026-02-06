import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const BundleOrderItemCreateManyBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyBundleInput>;
export const BundleOrderItemCreateManyBundleInputObjectZodSchema = makeSchema();
