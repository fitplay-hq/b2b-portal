import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateWithoutClientInputObjectSchema as ClientProductCreateWithoutClientInputObjectSchema } from './ClientProductCreateWithoutClientInput.schema';
import { ClientProductUncheckedCreateWithoutClientInputObjectSchema as ClientProductUncheckedCreateWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateWithoutClientInput.schema';
import { ClientProductCreateOrConnectWithoutClientInputObjectSchema as ClientProductCreateOrConnectWithoutClientInputObjectSchema } from './ClientProductCreateOrConnectWithoutClientInput.schema';
import { ClientProductUpsertWithWhereUniqueWithoutClientInputObjectSchema as ClientProductUpsertWithWhereUniqueWithoutClientInputObjectSchema } from './ClientProductUpsertWithWhereUniqueWithoutClientInput.schema';
import { ClientProductCreateManyClientInputEnvelopeObjectSchema as ClientProductCreateManyClientInputEnvelopeObjectSchema } from './ClientProductCreateManyClientInputEnvelope.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithWhereUniqueWithoutClientInputObjectSchema as ClientProductUpdateWithWhereUniqueWithoutClientInputObjectSchema } from './ClientProductUpdateWithWhereUniqueWithoutClientInput.schema';
import { ClientProductUpdateManyWithWhereWithoutClientInputObjectSchema as ClientProductUpdateManyWithWhereWithoutClientInputObjectSchema } from './ClientProductUpdateManyWithWhereWithoutClientInput.schema';
import { ClientProductScalarWhereInputObjectSchema as ClientProductScalarWhereInputObjectSchema } from './ClientProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema).array(), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientProductCreateOrConnectWithoutClientInputObjectSchema), z.lazy(() => ClientProductCreateOrConnectWithoutClientInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ClientProductUpsertWithWhereUniqueWithoutClientInputObjectSchema), z.lazy(() => ClientProductUpsertWithWhereUniqueWithoutClientInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientProductCreateManyClientInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ClientProductUpdateWithWhereUniqueWithoutClientInputObjectSchema), z.lazy(() => ClientProductUpdateWithWhereUniqueWithoutClientInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ClientProductUpdateManyWithWhereWithoutClientInputObjectSchema), z.lazy(() => ClientProductUpdateManyWithWhereWithoutClientInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ClientProductScalarWhereInputObjectSchema), z.lazy(() => ClientProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ClientProductUpdateManyWithoutClientNestedInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateManyWithoutClientNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateManyWithoutClientNestedInput>;
export const ClientProductUpdateManyWithoutClientNestedInputObjectZodSchema = makeSchema();
