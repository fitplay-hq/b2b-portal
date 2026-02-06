import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutClientInputObjectSchema as OrderCreateWithoutClientInputObjectSchema } from './OrderCreateWithoutClientInput.schema';
import { OrderUncheckedCreateWithoutClientInputObjectSchema as OrderUncheckedCreateWithoutClientInputObjectSchema } from './OrderUncheckedCreateWithoutClientInput.schema';
import { OrderCreateOrConnectWithoutClientInputObjectSchema as OrderCreateOrConnectWithoutClientInputObjectSchema } from './OrderCreateOrConnectWithoutClientInput.schema';
import { OrderUpsertWithWhereUniqueWithoutClientInputObjectSchema as OrderUpsertWithWhereUniqueWithoutClientInputObjectSchema } from './OrderUpsertWithWhereUniqueWithoutClientInput.schema';
import { OrderCreateManyClientInputEnvelopeObjectSchema as OrderCreateManyClientInputEnvelopeObjectSchema } from './OrderCreateManyClientInputEnvelope.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithWhereUniqueWithoutClientInputObjectSchema as OrderUpdateWithWhereUniqueWithoutClientInputObjectSchema } from './OrderUpdateWithWhereUniqueWithoutClientInput.schema';
import { OrderUpdateManyWithWhereWithoutClientInputObjectSchema as OrderUpdateManyWithWhereWithoutClientInputObjectSchema } from './OrderUpdateManyWithWhereWithoutClientInput.schema';
import { OrderScalarWhereInputObjectSchema as OrderScalarWhereInputObjectSchema } from './OrderScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutClientInputObjectSchema), z.lazy(() => OrderCreateWithoutClientInputObjectSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderCreateOrConnectWithoutClientInputObjectSchema), z.lazy(() => OrderCreateOrConnectWithoutClientInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderUpsertWithWhereUniqueWithoutClientInputObjectSchema), z.lazy(() => OrderUpsertWithWhereUniqueWithoutClientInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderCreateManyClientInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderUpdateWithWhereUniqueWithoutClientInputObjectSchema), z.lazy(() => OrderUpdateWithWhereUniqueWithoutClientInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderUpdateManyWithWhereWithoutClientInputObjectSchema), z.lazy(() => OrderUpdateManyWithWhereWithoutClientInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderUncheckedUpdateManyWithoutClientNestedInputObjectSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutClientNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutClientNestedInput>;
export const OrderUncheckedUpdateManyWithoutClientNestedInputObjectZodSchema = makeSchema();
