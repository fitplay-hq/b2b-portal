import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema';
import { SubCategoryUpdateWithoutProductsInputObjectSchema as SubCategoryUpdateWithoutProductsInputObjectSchema } from './SubCategoryUpdateWithoutProductsInput.schema';
import { SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema as SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SubCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const SubCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateToOneWithWhereWithoutProductsInput>;
export const SubCategoryUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();
