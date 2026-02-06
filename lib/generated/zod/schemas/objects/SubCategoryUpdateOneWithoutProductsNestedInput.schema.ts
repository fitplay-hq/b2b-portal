import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateWithoutProductsInputObjectSchema as SubCategoryCreateWithoutProductsInputObjectSchema } from './SubCategoryCreateWithoutProductsInput.schema';
import { SubCategoryUncheckedCreateWithoutProductsInputObjectSchema as SubCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedCreateWithoutProductsInput.schema';
import { SubCategoryCreateOrConnectWithoutProductsInputObjectSchema as SubCategoryCreateOrConnectWithoutProductsInputObjectSchema } from './SubCategoryCreateOrConnectWithoutProductsInput.schema';
import { SubCategoryUpsertWithoutProductsInputObjectSchema as SubCategoryUpsertWithoutProductsInputObjectSchema } from './SubCategoryUpsertWithoutProductsInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema as SubCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './SubCategoryUpdateToOneWithWhereWithoutProductsInput.schema';
import { SubCategoryUpdateWithoutProductsInputObjectSchema as SubCategoryUpdateWithoutProductsInputObjectSchema } from './SubCategoryUpdateWithoutProductsInput.schema';
import { SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema as SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './SubCategoryUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SubCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SubCategoryCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => SubCategoryUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => SubCategoryWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => SubCategoryWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SubCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const SubCategoryUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateOneWithoutProductsNestedInput>;
export const SubCategoryUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();
