import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientUpdateWithoutProductsInputObjectSchema as ClientUpdateWithoutProductsInputObjectSchema } from './ClientUpdateWithoutProductsInput.schema';
import { ClientUncheckedUpdateWithoutProductsInputObjectSchema as ClientUncheckedUpdateWithoutProductsInputObjectSchema } from './ClientUncheckedUpdateWithoutProductsInput.schema';
import { ClientCreateWithoutProductsInputObjectSchema as ClientCreateWithoutProductsInputObjectSchema } from './ClientCreateWithoutProductsInput.schema';
import { ClientUncheckedCreateWithoutProductsInputObjectSchema as ClientUncheckedCreateWithoutProductsInputObjectSchema } from './ClientUncheckedCreateWithoutProductsInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ClientUpdateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => ClientCreateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => ClientWhereInputObjectSchema).optional()
}).strict();
export const ClientUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpsertWithoutProductsInput>;
export const ClientUpsertWithoutProductsInputObjectZodSchema = makeSchema();
