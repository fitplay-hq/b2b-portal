import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BundleCreateManyOrderInputObjectSchema: z.ZodType<Prisma.BundleCreateManyOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateManyOrderInput>;
export const BundleCreateManyOrderInputObjectZodSchema = makeSchema();
