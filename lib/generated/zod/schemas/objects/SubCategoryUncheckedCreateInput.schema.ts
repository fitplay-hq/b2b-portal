import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  categoryId: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutSubCategoryInputObjectSchema).optional()
}).strict();
export const SubCategoryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SubCategoryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUncheckedCreateInput>;
export const SubCategoryUncheckedCreateInputObjectZodSchema = makeSchema();
