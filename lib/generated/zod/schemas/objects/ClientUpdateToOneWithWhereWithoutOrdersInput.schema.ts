import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema';
import { ClientUpdateWithoutOrdersInputObjectSchema as ClientUpdateWithoutOrdersInputObjectSchema } from './ClientUpdateWithoutOrdersInput.schema';
import { ClientUncheckedUpdateWithoutOrdersInputObjectSchema as ClientUncheckedUpdateWithoutOrdersInputObjectSchema } from './ClientUncheckedUpdateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ClientUpdateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutOrdersInputObjectSchema)])
}).strict();
export const ClientUpdateToOneWithWhereWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientUpdateToOneWithWhereWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateToOneWithWhereWithoutOrdersInput>;
export const ClientUpdateToOneWithWhereWithoutOrdersInputObjectZodSchema = makeSchema();
