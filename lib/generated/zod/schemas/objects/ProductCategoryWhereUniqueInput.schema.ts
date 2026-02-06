import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50).optional(),
  shortCode: z.string().max(10).optional()
}).strict();
export const ProductCategoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductCategoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryWhereUniqueInput>;
export const ProductCategoryWhereUniqueInputObjectZodSchema = makeSchema();
