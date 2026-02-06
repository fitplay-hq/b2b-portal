import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientCreateWithoutProductsInputObjectSchema as ClientCreateWithoutProductsInputObjectSchema } from './ClientCreateWithoutProductsInput.schema';
import { ClientUncheckedCreateWithoutProductsInputObjectSchema as ClientUncheckedCreateWithoutProductsInputObjectSchema } from './ClientUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClientCreateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const ClientCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateOrConnectWithoutProductsInput>;
export const ClientCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
