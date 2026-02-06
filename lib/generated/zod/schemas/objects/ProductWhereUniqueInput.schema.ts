import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  sku: z.string().max(100).optional()
}).strict();
export const ProductWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductWhereUniqueInput>;
export const ProductWhereUniqueInputObjectZodSchema = makeSchema();
