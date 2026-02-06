import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailCreateWithoutOrderInputObjectSchema as OrderEmailCreateWithoutOrderInputObjectSchema } from './OrderEmailCreateWithoutOrderInput.schema';
import { OrderEmailUncheckedCreateWithoutOrderInputObjectSchema as OrderEmailUncheckedCreateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedCreateWithoutOrderInput.schema';
import { OrderEmailCreateOrConnectWithoutOrderInputObjectSchema as OrderEmailCreateOrConnectWithoutOrderInputObjectSchema } from './OrderEmailCreateOrConnectWithoutOrderInput.schema';
import { OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectSchema as OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './OrderEmailUpsertWithWhereUniqueWithoutOrderInput.schema';
import { OrderEmailCreateManyOrderInputEnvelopeObjectSchema as OrderEmailCreateManyOrderInputEnvelopeObjectSchema } from './OrderEmailCreateManyOrderInputEnvelope.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './OrderEmailWhereUniqueInput.schema';
import { OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectSchema as OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './OrderEmailUpdateWithWhereUniqueWithoutOrderInput.schema';
import { OrderEmailUpdateManyWithWhereWithoutOrderInputObjectSchema as OrderEmailUpdateManyWithWhereWithoutOrderInputObjectSchema } from './OrderEmailUpdateManyWithWhereWithoutOrderInput.schema';
import { OrderEmailScalarWhereInputObjectSchema as OrderEmailScalarWhereInputObjectSchema } from './OrderEmailScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderEmailCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderEmailCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderEmailWhereUniqueInputObjectSchema), z.lazy(() => OrderEmailWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderEmailWhereUniqueInputObjectSchema), z.lazy(() => OrderEmailWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderEmailWhereUniqueInputObjectSchema), z.lazy(() => OrderEmailWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderEmailWhereUniqueInputObjectSchema), z.lazy(() => OrderEmailWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderEmailUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderEmailScalarWhereInputObjectSchema), z.lazy(() => OrderEmailScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderEmailUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.OrderEmailUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUpdateManyWithoutOrderNestedInput>;
export const OrderEmailUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
