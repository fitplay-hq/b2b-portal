import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateWithoutProductInputObjectSchema as ClientProductCreateWithoutProductInputObjectSchema } from './ClientProductCreateWithoutProductInput.schema';
import { ClientProductUncheckedCreateWithoutProductInputObjectSchema as ClientProductUncheckedCreateWithoutProductInputObjectSchema } from './ClientProductUncheckedCreateWithoutProductInput.schema';
import { ClientProductCreateOrConnectWithoutProductInputObjectSchema as ClientProductCreateOrConnectWithoutProductInputObjectSchema } from './ClientProductCreateOrConnectWithoutProductInput.schema';
import { ClientProductUpsertWithWhereUniqueWithoutProductInputObjectSchema as ClientProductUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './ClientProductUpsertWithWhereUniqueWithoutProductInput.schema';
import { ClientProductCreateManyProductInputEnvelopeObjectSchema as ClientProductCreateManyProductInputEnvelopeObjectSchema } from './ClientProductCreateManyProductInputEnvelope.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithWhereUniqueWithoutProductInputObjectSchema as ClientProductUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './ClientProductUpdateWithWhereUniqueWithoutProductInput.schema';
import { ClientProductUpdateManyWithWhereWithoutProductInputObjectSchema as ClientProductUpdateManyWithWhereWithoutProductInputObjectSchema } from './ClientProductUpdateManyWithWhereWithoutProductInput.schema';
import { ClientProductScalarWhereInputObjectSchema as ClientProductScalarWhereInputObjectSchema } from './ClientProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientProductCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ClientProductCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ClientProductUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ClientProductUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientProductCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ClientProductUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => ClientProductUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ClientProductUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => ClientProductUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ClientProductScalarWhereInputObjectSchema), z.lazy(() => ClientProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ClientProductUncheckedUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ClientProductUncheckedUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUncheckedUpdateManyWithoutProductNestedInput>;
export const ClientProductUncheckedUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
