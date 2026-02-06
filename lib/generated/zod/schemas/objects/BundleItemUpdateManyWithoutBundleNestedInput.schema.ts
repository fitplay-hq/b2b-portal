import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutBundleInputObjectSchema as BundleItemCreateWithoutBundleInputObjectSchema } from './BundleItemCreateWithoutBundleInput.schema';
import { BundleItemUncheckedCreateWithoutBundleInputObjectSchema as BundleItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleInput.schema';
import { BundleItemCreateOrConnectWithoutBundleInputObjectSchema as BundleItemCreateOrConnectWithoutBundleInputObjectSchema } from './BundleItemCreateOrConnectWithoutBundleInput.schema';
import { BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema as BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema } from './BundleItemUpsertWithWhereUniqueWithoutBundleInput.schema';
import { BundleItemCreateManyBundleInputEnvelopeObjectSchema as BundleItemCreateManyBundleInputEnvelopeObjectSchema } from './BundleItemCreateManyBundleInputEnvelope.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema as BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema } from './BundleItemUpdateWithWhereUniqueWithoutBundleInput.schema';
import { BundleItemUpdateManyWithWhereWithoutBundleInputObjectSchema as BundleItemUpdateManyWithWhereWithoutBundleInputObjectSchema } from './BundleItemUpdateManyWithWhereWithoutBundleInput.schema';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutBundleInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutBundleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleItemCreateManyBundleInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleItemUpdateManyWithWhereWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUpdateManyWithWhereWithoutBundleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleItemScalarWhereInputObjectSchema), z.lazy(() => BundleItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemUpdateManyWithoutBundleNestedInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateManyWithoutBundleNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateManyWithoutBundleNestedInput>;
export const BundleItemUpdateManyWithoutBundleNestedInputObjectZodSchema = makeSchema();
