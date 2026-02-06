import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutCompanyInputObjectSchema as ClientCreateWithoutCompanyInputObjectSchema } from './ClientCreateWithoutCompanyInput.schema';
import { ClientUncheckedCreateWithoutCompanyInputObjectSchema as ClientUncheckedCreateWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateWithoutCompanyInput.schema';
import { ClientCreateOrConnectWithoutCompanyInputObjectSchema as ClientCreateOrConnectWithoutCompanyInputObjectSchema } from './ClientCreateOrConnectWithoutCompanyInput.schema';
import { ClientCreateManyCompanyInputEnvelopeObjectSchema as ClientCreateManyCompanyInputEnvelopeObjectSchema } from './ClientCreateManyCompanyInputEnvelope.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema).array(), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientCreateOrConnectWithoutCompanyInputObjectSchema), z.lazy(() => ClientCreateOrConnectWithoutCompanyInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ClientWhereUniqueInputObjectSchema), z.lazy(() => ClientWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientUncheckedCreateNestedManyWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUncheckedCreateNestedManyWithoutCompanyInput>;
export const ClientUncheckedCreateNestedManyWithoutCompanyInputObjectZodSchema = makeSchema();
