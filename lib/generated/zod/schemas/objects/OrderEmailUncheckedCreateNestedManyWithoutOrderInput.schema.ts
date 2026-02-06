import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailCreateWithoutOrderInputObjectSchema as OrderEmailCreateWithoutOrderInputObjectSchema } from './OrderEmailCreateWithoutOrderInput.schema';
import { OrderEmailUncheckedCreateWithoutOrderInputObjectSchema as OrderEmailUncheckedCreateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedCreateWithoutOrderInput.schema';
import { OrderEmailCreateOrConnectWithoutOrderInputObjectSchema as OrderEmailCreateOrConnectWithoutOrderInputObjectSchema } from './OrderEmailCreateOrConnectWithoutOrderInput.schema';
import { OrderEmailCreateManyOrderInputEnvelopeObjectSchema as OrderEmailCreateManyOrderInputEnvelopeObjectSchema } from './OrderEmailCreateManyOrderInputEnvelope.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './OrderEmailWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderEmailCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderEmailCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderEmailWhereUniqueInputObjectSchema), z.lazy(() => OrderEmailWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderEmailUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderEmailUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUncheckedCreateNestedManyWithoutOrderInput>;
export const OrderEmailUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
