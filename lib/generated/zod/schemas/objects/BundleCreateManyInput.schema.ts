import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BundleCreateManyInputObjectSchema: z.ZodType<Prisma.BundleCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateManyInput>;
export const BundleCreateManyInputObjectZodSchema = makeSchema();
