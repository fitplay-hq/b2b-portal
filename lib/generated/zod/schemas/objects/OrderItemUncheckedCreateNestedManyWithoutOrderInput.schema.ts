import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateWithoutOrderInputObjectSchema as OrderItemCreateWithoutOrderInputObjectSchema } from './OrderItemCreateWithoutOrderInput.schema';
import { OrderItemUncheckedCreateWithoutOrderInputObjectSchema as OrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderInput.schema';
import { OrderItemCreateOrConnectWithoutOrderInputObjectSchema as OrderItemCreateOrConnectWithoutOrderInputObjectSchema } from './OrderItemCreateOrConnectWithoutOrderInput.schema';
import { OrderItemCreateManyOrderInputEnvelopeObjectSchema as OrderItemCreateManyOrderInputEnvelopeObjectSchema } from './OrderItemCreateManyOrderInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput>;
export const OrderItemUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
