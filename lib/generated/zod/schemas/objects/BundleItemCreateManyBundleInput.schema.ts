import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BundleItemCreateManyBundleInputObjectSchema: z.ZodType<Prisma.BundleItemCreateManyBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateManyBundleInput>;
export const BundleItemCreateManyBundleInputObjectZodSchema = makeSchema();
