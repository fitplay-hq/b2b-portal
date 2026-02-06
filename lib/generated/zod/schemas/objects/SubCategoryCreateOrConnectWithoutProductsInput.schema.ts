import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryCreateWithoutProductsInputObjectSchema as SubCategoryCreateWithoutProductsInputObjectSchema } from './SubCategoryCreateWithoutProductsInput.schema';
import { SubCategoryUncheckedCreateWithoutProductsInputObjectSchema as SubCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SubCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const SubCategoryCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateOrConnectWithoutProductsInput>;
export const SubCategoryCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
