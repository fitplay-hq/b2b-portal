import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutBundleInputObjectSchema as BundleOrderItemCreateWithoutBundleInputObjectSchema } from './BundleOrderItemCreateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleInput.schema';
import { BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema as BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutBundleInput.schema';
import { BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema as BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema } from './BundleOrderItemUpsertWithWhereUniqueWithoutBundleInput.schema';
import { BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema as BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyBundleInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema as BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema } from './BundleOrderItemUpdateWithWhereUniqueWithoutBundleInput.schema';
import { BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectSchema as BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectSchema } from './BundleOrderItemUpdateManyWithWhereWithoutBundleInput.schema';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUpdateManyWithoutBundleNestedInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyWithoutBundleNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyWithoutBundleNestedInput>;
export const BundleOrderItemUpdateManyWithoutBundleNestedInputObjectZodSchema = makeSchema();
