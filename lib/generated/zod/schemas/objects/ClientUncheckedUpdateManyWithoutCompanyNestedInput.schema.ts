import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutCompanyInputObjectSchema as ClientCreateWithoutCompanyInputObjectSchema } from './ClientCreateWithoutCompanyInput.schema';
import { ClientUncheckedCreateWithoutCompanyInputObjectSchema as ClientUncheckedCreateWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateWithoutCompanyInput.schema';
import { ClientCreateOrConnectWithoutCompanyInputObjectSchema as ClientCreateOrConnectWithoutCompanyInputObjectSchema } from './ClientCreateOrConnectWithoutCompanyInput.schema';
import { ClientUpsertWithWhereUniqueWithoutCompanyInputObjectSchema as ClientUpsertWithWhereUniqueWithoutCompanyInputObjectSchema } from './ClientUpsertWithWhereUniqueWithoutCompanyInput.schema';
import { ClientCreateManyCompanyInputEnvelopeObjectSchema as ClientCreateManyCompanyInputEnvelopeObjectSchema } from './ClientCreateManyCompanyInputEnvelope.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientUpdateWithWhereUniqueWithoutCompanyInputObjectSchema as ClientUpdateWithWhereUniqueWithoutCompanyInputObjectSchema } from './ClientUpdateWithWhereUniqueWithoutCompanyInput.schema';
import { ClientUpdateManyWithWhereWithoutCompanyInputObjectSchema as ClientUpdateManyWithWhereWithoutCompanyInputObjectSchema } from './ClientUpdateManyWithWhereWithoutCompanyInput.schema';
import { ClientScalarWhereInputObjectSchema as ClientScalarWhereInputObjectSchema } from './ClientScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema).array(), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientCreateOrConnectWithoutCompanyInputObjectSchema), z.lazy(() => ClientCreateOrConnectWithoutCompanyInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputObjectSchema), z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ClientWhereUniqueInputObjectSchema), z.lazy(() => ClientWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ClientWhereUniqueInputObjectSchema), z.lazy(() => ClientWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ClientWhereUniqueInputObjectSchema), z.lazy(() => ClientWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ClientWhereUniqueInputObjectSchema), z.lazy(() => ClientWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputObjectSchema), z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputObjectSchema), z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ClientScalarWhereInputObjectSchema), z.lazy(() => ClientScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ClientUncheckedUpdateManyWithoutCompanyNestedInputObjectSchema: z.ZodType<Prisma.ClientUncheckedUpdateManyWithoutCompanyNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUncheckedUpdateManyWithoutCompanyNestedInput>;
export const ClientUncheckedUpdateManyWithoutCompanyNestedInputObjectZodSchema = makeSchema();
