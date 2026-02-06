import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema as ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutCategoryInput.schema';
import { SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  displayName: z.string().max(100),
  description: z.string().max(255).optional().nullable(),
  shortCode: z.string().max(10),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema).optional(),
  subCategories: z.lazy(() => SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductCategoryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUncheckedCreateInput>;
export const ProductCategoryUncheckedCreateInputObjectZodSchema = makeSchema();
