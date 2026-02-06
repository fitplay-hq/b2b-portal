import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  shortCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema).optional()
}).strict();
export const SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUncheckedCreateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUncheckedCreateWithoutCategoryInput>;
export const SubCategoryUncheckedCreateWithoutCategoryInputObjectZodSchema = makeSchema();
