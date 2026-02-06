import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutClientInputObjectSchema as OrderCreateWithoutClientInputObjectSchema } from './OrderCreateWithoutClientInput.schema';
import { OrderUncheckedCreateWithoutClientInputObjectSchema as OrderUncheckedCreateWithoutClientInputObjectSchema } from './OrderUncheckedCreateWithoutClientInput.schema';
import { OrderCreateOrConnectWithoutClientInputObjectSchema as OrderCreateOrConnectWithoutClientInputObjectSchema } from './OrderCreateOrConnectWithoutClientInput.schema';
import { OrderCreateManyClientInputEnvelopeObjectSchema as OrderCreateManyClientInputEnvelopeObjectSchema } from './OrderCreateManyClientInputEnvelope.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutClientInputObjectSchema), z.lazy(() => OrderCreateWithoutClientInputObjectSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderCreateOrConnectWithoutClientInputObjectSchema), z.lazy(() => OrderCreateOrConnectWithoutClientInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderCreateManyClientInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutClientInput>;
export const OrderUncheckedCreateNestedManyWithoutClientInputObjectZodSchema = makeSchema();
