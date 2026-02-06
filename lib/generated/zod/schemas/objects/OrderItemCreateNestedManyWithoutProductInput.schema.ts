import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateWithoutProductInputObjectSchema as OrderItemCreateWithoutProductInputObjectSchema } from './OrderItemCreateWithoutProductInput.schema';
import { OrderItemUncheckedCreateWithoutProductInputObjectSchema as OrderItemUncheckedCreateWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateWithoutProductInput.schema';
import { OrderItemCreateOrConnectWithoutProductInputObjectSchema as OrderItemCreateOrConnectWithoutProductInputObjectSchema } from './OrderItemCreateOrConnectWithoutProductInput.schema';
import { OrderItemCreateManyProductInputEnvelopeObjectSchema as OrderItemCreateManyProductInputEnvelopeObjectSchema } from './OrderItemCreateManyProductInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => OrderItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedManyWithoutProductInput>;
export const OrderItemCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
