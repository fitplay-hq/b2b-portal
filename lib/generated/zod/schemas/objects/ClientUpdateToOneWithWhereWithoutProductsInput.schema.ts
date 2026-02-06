import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema';
import { ClientUpdateWithoutProductsInputObjectSchema as ClientUpdateWithoutProductsInputObjectSchema } from './ClientUpdateWithoutProductsInput.schema';
import { ClientUncheckedUpdateWithoutProductsInputObjectSchema as ClientUncheckedUpdateWithoutProductsInputObjectSchema } from './ClientUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ClientUpdateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const ClientUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateToOneWithWhereWithoutProductsInput>;
export const ClientUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();
