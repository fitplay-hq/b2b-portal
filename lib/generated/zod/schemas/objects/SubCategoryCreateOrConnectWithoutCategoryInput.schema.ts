import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryCreateWithoutCategoryInputObjectSchema as SubCategoryCreateWithoutCategoryInputObjectSchema } from './SubCategoryCreateWithoutCategoryInput.schema';
import { SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateOrConnectWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateOrConnectWithoutCategoryInput>;
export const SubCategoryCreateOrConnectWithoutCategoryInputObjectZodSchema = makeSchema();
