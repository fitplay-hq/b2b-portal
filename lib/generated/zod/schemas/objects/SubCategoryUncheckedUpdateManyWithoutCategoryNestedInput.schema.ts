import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateWithoutCategoryInputObjectSchema as SubCategoryCreateWithoutCategoryInputObjectSchema } from './SubCategoryCreateWithoutCategoryInput.schema';
import { SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateWithoutCategoryInput.schema';
import { SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema as SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema } from './SubCategoryCreateOrConnectWithoutCategoryInput.schema';
import { SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectSchema as SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectSchema } from './SubCategoryUpsertWithWhereUniqueWithoutCategoryInput.schema';
import { SubCategoryCreateManyCategoryInputEnvelopeObjectSchema as SubCategoryCreateManyCategoryInputEnvelopeObjectSchema } from './SubCategoryCreateManyCategoryInputEnvelope.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './SubCategoryWhereUniqueInput.schema';
import { SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectSchema as SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectSchema } from './SubCategoryUpdateWithWhereUniqueWithoutCategoryInput.schema';
import { SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectSchema as SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectSchema } from './SubCategoryUpdateManyWithWhereWithoutCategoryInput.schema';
import { SubCategoryScalarWhereInputObjectSchema as SubCategoryScalarWhereInputObjectSchema } from './SubCategoryScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryCreateWithoutCategoryInputObjectSchema).array(), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUncheckedCreateWithoutCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryCreateOrConnectWithoutCategoryInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUpsertWithWhereUniqueWithoutCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SubCategoryCreateManyCategoryInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SubCategoryWhereUniqueInputObjectSchema), z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SubCategoryWhereUniqueInputObjectSchema), z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SubCategoryWhereUniqueInputObjectSchema), z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SubCategoryWhereUniqueInputObjectSchema), z.lazy(() => SubCategoryWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUpdateWithWhereUniqueWithoutCategoryInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectSchema), z.lazy(() => SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SubCategoryScalarWhereInputObjectSchema), z.lazy(() => SubCategoryScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SubCategoryUncheckedUpdateManyWithoutCategoryNestedInputObjectSchema: z.ZodType<Prisma.SubCategoryUncheckedUpdateManyWithoutCategoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUncheckedUpdateManyWithoutCategoryNestedInput>;
export const SubCategoryUncheckedUpdateManyWithoutCategoryNestedInputObjectZodSchema = makeSchema();
