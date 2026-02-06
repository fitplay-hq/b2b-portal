import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutOrderInputObjectSchema as BundleOrderItemCreateWithoutOrderInputObjectSchema } from './BundleOrderItemCreateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutOrderInput.schema';
import { BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema as BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutOrderInput.schema';
import { BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema as BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './BundleOrderItemUpsertWithWhereUniqueWithoutOrderInput.schema';
import { BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema as BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyOrderInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema as BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './BundleOrderItemUpdateWithWhereUniqueWithoutOrderInput.schema';
import { BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema as BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema } from './BundleOrderItemUpdateManyWithWhereWithoutOrderInput.schema';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUncheckedUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutOrderNestedInput>;
export const BundleOrderItemUncheckedUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
