import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateWithoutCategoryInputObjectSchema as SubCategoryCreateWithoutCategoryInputObjectSchema } from './SubCategoryCreateWithoutCategoryInput.schema';
import { SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateWithoutCategoryInput.schema';
import { SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema as SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema } from './SubCategoryCreateOrConnectWithoutCategoryInput.schema';
import { SubCategoryCreateManyCategoryInputEnvelopeObjectSchema as SubCategoryCreateManyCategoryInputEnvelopeObjectSchema } from './SubCategoryCreateManyCategoryInputEnvelope.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema).array(), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SubCategoryCreateManyCategoryInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SubCategoryWhereUniqueInputObjectSchema), z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUncheckedCreateNestedManyWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUncheckedCreateNestedManyWithoutCategoryInput>;
export const SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectZodSchema = makeSchema();
