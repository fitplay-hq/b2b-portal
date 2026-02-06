import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryUpdateWithoutCategoryInputObjectSchema as SubCategoryUpdateWithoutCategoryInputObjectSchema } from './SubCategoryUpdateWithoutCategoryInput.schema';
import { SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema as SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedUpdateWithoutCategoryInput.schema';
import { SubCategoryCreateWithoutCategoryInputObjectSchema as SubCategoryCreateWithoutCategoryInputObjectSchema } from './SubCategoryCreateWithoutCategoryInput.schema';
import { SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SubCategoryUpdateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateWithoutCategoryInputObjectSchema)]),
  create: z.union([z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUpsertWithWhereUniqueWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpsertWithWhereUniqueWithoutCategoryInput>;
export const SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectZodSchema = makeSchema();
