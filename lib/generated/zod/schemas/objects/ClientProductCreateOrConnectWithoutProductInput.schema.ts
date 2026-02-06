import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductCreateWithoutProductInputObjectSchema as ClientProductCreateWithoutProductInputObjectSchema } from './ClientProductCreateWithoutProductInput.schema';
import { ClientProductUncheckedCreateWithoutProductInputObjectSchema as ClientProductUncheckedCreateWithoutProductInputObjectSchema } from './ClientProductUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ClientProductCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateOrConnectWithoutProductInput>;
export const ClientProductCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
