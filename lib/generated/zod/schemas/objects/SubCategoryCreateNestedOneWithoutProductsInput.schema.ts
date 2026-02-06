import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateWithoutProductsInputObjectSchema as SubCategoryCreateWithoutProductsInputObjectSchema } from './SubCategoryCreateWithoutProductsInput.schema';
import { SubCategoryUncheckedCreateWithoutProductsInputObjectSchema as SubCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedCreateWithoutProductsInput.schema';
import { SubCategoryCreateOrConnectWithoutProductsInputObjectSchema as SubCategoryCreateOrConnectWithoutProductsInputObjectSchema } from './SubCategoryCreateOrConnectWithoutProductsInput.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SubCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SubCategoryCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).optional()
}).strict();
export const SubCategoryCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateNestedOneWithoutProductsInput>;
export const SubCategoryCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();
