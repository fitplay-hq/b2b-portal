import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutProductInputObjectSchema as BundleItemCreateWithoutProductInputObjectSchema } from './BundleItemCreateWithoutProductInput.schema';
import { BundleItemUncheckedCreateWithoutProductInputObjectSchema as BundleItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleItemUncheckedCreateWithoutProductInput.schema';
import { BundleItemCreateOrConnectWithoutProductInputObjectSchema as BundleItemCreateOrConnectWithoutProductInputObjectSchema } from './BundleItemCreateOrConnectWithoutProductInput.schema';
import { BundleItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as BundleItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './BundleItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { BundleItemCreateManyProductInputEnvelopeObjectSchema as BundleItemCreateManyProductInputEnvelopeObjectSchema } from './BundleItemCreateManyProductInputEnvelope.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as BundleItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './BundleItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { BundleItemUpdateManyWithWhereWithoutProductInputObjectSchema as BundleItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './BundleItemUpdateManyWithWhereWithoutProductInput.schema';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => BundleItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleItemScalarWhereInputObjectSchema), z.lazy(() => BundleItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateManyWithoutProductNestedInput>;
export const BundleItemUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
