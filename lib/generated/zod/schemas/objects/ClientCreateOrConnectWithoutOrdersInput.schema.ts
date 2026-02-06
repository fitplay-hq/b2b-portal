import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientCreateWithoutOrdersInputObjectSchema as ClientCreateWithoutOrdersInputObjectSchema } from './ClientCreateWithoutOrdersInput.schema';
import { ClientUncheckedCreateWithoutOrdersInputObjectSchema as ClientUncheckedCreateWithoutOrdersInputObjectSchema } from './ClientUncheckedCreateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClientCreateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutOrdersInputObjectSchema)])
}).strict();
export const ClientCreateOrConnectWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateOrConnectWithoutOrdersInput>;
export const ClientCreateOrConnectWithoutOrdersInputObjectZodSchema = makeSchema();
