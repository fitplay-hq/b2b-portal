import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BundleItemCreateManyProductInputObjectSchema: z.ZodType<Prisma.BundleItemCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateManyProductInput>;
export const BundleItemCreateManyProductInputObjectZodSchema = makeSchema();
