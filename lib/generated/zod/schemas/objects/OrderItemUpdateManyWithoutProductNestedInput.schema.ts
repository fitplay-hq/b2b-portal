import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateWithoutProductInputObjectSchema as OrderItemCreateWithoutProductInputObjectSchema } from './OrderItemCreateWithoutProductInput.schema';
import { OrderItemUncheckedCreateWithoutProductInputObjectSchema as OrderItemUncheckedCreateWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateWithoutProductInput.schema';
import { OrderItemCreateOrConnectWithoutProductInputObjectSchema as OrderItemCreateOrConnectWithoutProductInputObjectSchema } from './OrderItemCreateOrConnectWithoutProductInput.schema';
import { OrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as OrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './OrderItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { OrderItemCreateManyProductInputEnvelopeObjectSchema as OrderItemCreateManyProductInputEnvelopeObjectSchema } from './OrderItemCreateManyProductInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as OrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './OrderItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { OrderItemUpdateManyWithWhereWithoutProductInputObjectSchema as OrderItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './OrderItemUpdateManyWithWhereWithoutProductInput.schema';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => OrderItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithoutProductNestedInput>;
export const OrderItemUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
