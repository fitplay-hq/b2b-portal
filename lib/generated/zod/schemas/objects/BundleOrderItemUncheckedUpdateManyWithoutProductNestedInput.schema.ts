import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutProductInputObjectSchema as BundleOrderItemCreateWithoutProductInputObjectSchema } from './BundleOrderItemCreateWithoutProductInput.schema';
import { BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema as BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutProductInput.schema';
import { BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema as BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutProductInput.schema';
import { BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './BundleOrderItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { BundleOrderItemCreateManyProductInputEnvelopeObjectSchema as BundleOrderItemCreateManyProductInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyProductInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './BundleOrderItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectSchema as BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './BundleOrderItemUpdateManyWithWhereWithoutProductInput.schema';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutProductNestedInput>;
export const BundleOrderItemUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
