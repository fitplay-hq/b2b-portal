import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientUpdateWithoutOrdersInputObjectSchema as ClientUpdateWithoutOrdersInputObjectSchema } from './ClientUpdateWithoutOrdersInput.schema';
import { ClientUncheckedUpdateWithoutOrdersInputObjectSchema as ClientUncheckedUpdateWithoutOrdersInputObjectSchema } from './ClientUncheckedUpdateWithoutOrdersInput.schema';
import { ClientCreateWithoutOrdersInputObjectSchema as ClientCreateWithoutOrdersInputObjectSchema } from './ClientCreateWithoutOrdersInput.schema';
import { ClientUncheckedCreateWithoutOrdersInputObjectSchema as ClientUncheckedCreateWithoutOrdersInputObjectSchema } from './ClientUncheckedCreateWithoutOrdersInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ClientUpdateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutOrdersInputObjectSchema)]),
  create: z.union([z.lazy(() => ClientCreateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutOrdersInputObjectSchema)]),
  where: z.lazy(() => ClientWhereInputObjectSchema).optional()
}).strict();
export const ClientUpsertWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientUpsertWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpsertWithoutOrdersInput>;
export const ClientUpsertWithoutOrdersInputObjectZodSchema = makeSchema();
