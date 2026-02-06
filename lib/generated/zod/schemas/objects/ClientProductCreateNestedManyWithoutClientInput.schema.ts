import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateWithoutClientInputObjectSchema as ClientProductCreateWithoutClientInputObjectSchema } from './ClientProductCreateWithoutClientInput.schema';
import { ClientProductUncheckedCreateWithoutClientInputObjectSchema as ClientProductUncheckedCreateWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateWithoutClientInput.schema';
import { ClientProductCreateOrConnectWithoutClientInputObjectSchema as ClientProductCreateOrConnectWithoutClientInputObjectSchema } from './ClientProductCreateOrConnectWithoutClientInput.schema';
import { ClientProductCreateManyClientInputEnvelopeObjectSchema as ClientProductCreateManyClientInputEnvelopeObjectSchema } from './ClientProductCreateManyClientInputEnvelope.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema).array(), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientProductCreateOrConnectWithoutClientInputObjectSchema), z.lazy(() => ClientProductCreateOrConnectWithoutClientInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientProductCreateManyClientInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ClientProductCreateNestedManyWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductCreateNestedManyWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateNestedManyWithoutClientInput>;
export const ClientProductCreateNestedManyWithoutClientInputObjectZodSchema = makeSchema();
