import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryUpdateWithoutCategoryInputObjectSchema as SubCategoryUpdateWithoutCategoryInputObjectSchema } from './SubCategoryUpdateWithoutCategoryInput.schema';
import { SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema as SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedUpdateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SubCategoryUpdateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema)])
}).strict();
export const SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateWithWhereUniqueWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateWithWhereUniqueWithoutCategoryInput>;
export const SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectZodSchema = makeSchema();
