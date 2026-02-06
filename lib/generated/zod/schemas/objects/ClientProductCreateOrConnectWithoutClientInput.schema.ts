import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductCreateWithoutClientInputObjectSchema as ClientProductCreateWithoutClientInputObjectSchema } from './ClientProductCreateWithoutClientInput.schema';
import { ClientProductUncheckedCreateWithoutClientInputObjectSchema as ClientProductUncheckedCreateWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema)])
}).strict();
export const ClientProductCreateOrConnectWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductCreateOrConnectWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateOrConnectWithoutClientInput>;
export const ClientProductCreateOrConnectWithoutClientInputObjectZodSchema = makeSchema();
