import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateWithoutProductInputObjectSchema as ClientProductCreateWithoutProductInputObjectSchema } from './ClientProductCreateWithoutProductInput.schema';
import { ClientProductUncheckedCreateWithoutProductInputObjectSchema as ClientProductUncheckedCreateWithoutProductInputObjectSchema } from './ClientProductUncheckedCreateWithoutProductInput.schema';
import { ClientProductCreateOrConnectWithoutProductInputObjectSchema as ClientProductCreateOrConnectWithoutProductInputObjectSchema } from './ClientProductCreateOrConnectWithoutProductInput.schema';
import { ClientProductCreateManyProductInputEnvelopeObjectSchema as ClientProductCreateManyProductInputEnvelopeObjectSchema } from './ClientProductCreateManyProductInputEnvelope.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema).array(), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ClientProductCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => ClientProductCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ClientProductCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ClientProductWhereUniqueInputObjectSchema), z.lazy(() => ClientProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ClientProductCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateNestedManyWithoutProductInput>;
export const ClientProductCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
