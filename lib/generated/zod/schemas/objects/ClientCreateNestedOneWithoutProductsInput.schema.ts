import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutProductsInputObjectSchema as ClientCreateWithoutProductsInputObjectSchema } from './ClientCreateWithoutProductsInput.schema';
import { ClientUncheckedCreateWithoutProductsInputObjectSchema as ClientUncheckedCreateWithoutProductsInputObjectSchema } from './ClientUncheckedCreateWithoutProductsInput.schema';
import { ClientCreateOrConnectWithoutProductsInputObjectSchema as ClientCreateOrConnectWithoutProductsInputObjectSchema } from './ClientCreateOrConnectWithoutProductsInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputObjectSchema).optional()
}).strict();
export const ClientCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateNestedOneWithoutProductsInput>;
export const ClientCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();
