import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateWithoutOrderInputObjectSchema as OrderItemCreateWithoutOrderInputObjectSchema } from './OrderItemCreateWithoutOrderInput.schema';
import { OrderItemUncheckedCreateWithoutOrderInputObjectSchema as OrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderInput.schema';
import { OrderItemCreateOrConnectWithoutOrderInputObjectSchema as OrderItemCreateOrConnectWithoutOrderInputObjectSchema } from './OrderItemCreateOrConnectWithoutOrderInput.schema';
import { OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema as OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './OrderItemUpsertWithWhereUniqueWithoutOrderInput.schema';
import { OrderItemCreateManyOrderInputEnvelopeObjectSchema as OrderItemCreateManyOrderInputEnvelopeObjectSchema } from './OrderItemCreateManyOrderInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema as OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './OrderItemUpdateWithWhereUniqueWithoutOrderInput.schema';
import { OrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema as OrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema } from './OrderItemUpdateManyWithWhereWithoutOrderInput.schema';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderNestedInput>;
export const OrderItemUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
