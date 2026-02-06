import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedManyWithoutSubCategoryInputObjectSchema as ProductCreateNestedManyWithoutSubCategoryInputObjectSchema } from './ProductCreateNestedManyWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutSubCategoryInputObjectSchema).optional()
}).strict();
export const SubCategoryCreateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateWithoutCategoryInput>;
export const SubCategoryCreateWithoutCategoryInputObjectZodSchema = makeSchema();
