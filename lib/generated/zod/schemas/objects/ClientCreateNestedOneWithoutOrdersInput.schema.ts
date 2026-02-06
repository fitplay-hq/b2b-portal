import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutOrdersInputObjectSchema as ClientCreateWithoutOrdersInputObjectSchema } from './ClientCreateWithoutOrdersInput.schema';
import { ClientUncheckedCreateWithoutOrdersInputObjectSchema as ClientUncheckedCreateWithoutOrdersInputObjectSchema } from './ClientUncheckedCreateWithoutOrdersInput.schema';
import { ClientCreateOrConnectWithoutOrdersInputObjectSchema as ClientCreateOrConnectWithoutOrdersInputObjectSchema } from './ClientCreateOrConnectWithoutOrdersInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutOrdersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutOrdersInputObjectSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputObjectSchema).optional()
}).strict();
export const ClientCreateNestedOneWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateNestedOneWithoutOrdersInput>;
export const ClientCreateNestedOneWithoutOrdersInputObjectZodSchema = makeSchema();
