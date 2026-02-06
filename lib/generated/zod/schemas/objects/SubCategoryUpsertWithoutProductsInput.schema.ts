import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryUpdateWithoutProductsInputObjectSchema as SubCategoryUpdateWithoutProductsInputObjectSchema } from './SubCategoryUpdateWithoutProductsInput.schema';
import { SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema as SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedUpdateWithoutProductsInput.schema';
import { SubCategoryCreateWithoutProductsInputObjectSchema as SubCategoryCreateWithoutProductsInputObjectSchema } from './SubCategoryCreateWithoutProductsInput.schema';
import { SubCategoryUncheckedCreateWithoutProductsInputObjectSchema as SubCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedCreateWithoutProductsInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SubCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => SubCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => SubCategoryWhereInputObjectSchema).optional()
}).strict();
export const SubCategoryUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpsertWithoutProductsInput>;
export const SubCategoryUpsertWithoutProductsInputObjectZodSchema = makeSchema();
