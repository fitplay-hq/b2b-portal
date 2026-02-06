import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutOrdersInputObjectSchema as ClientCreateWithoutOrdersInputObjectSchema } from './ClientCreateWithoutOrdersInput.schema';
import { ClientUncheckedCreateWithoutOrdersInputObjectSchema as ClientUncheckedCreateWithoutOrdersInputObjectSchema } from './ClientUncheckedCreateWithoutOrdersInput.schema';
import { ClientCreateOrConnectWithoutOrdersInputObjectSchema as ClientCreateOrConnectWithoutOrdersInputObjectSchema } from './ClientCreateOrConnectWithoutOrdersInput.schema';
import { ClientUpsertWithoutOrdersInputObjectSchema as ClientUpsertWithoutOrdersInputObjectSchema } from './ClientUpsertWithoutOrdersInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientUpdateToOneWithWhereWithoutOrdersInputObjectSchema as ClientUpdateToOneWithWhereWithoutOrdersInputObjectSchema } from './ClientUpdateToOneWithWhereWithoutOrdersInput.schema';
import { ClientUpdateWithoutOrdersInputObjectSchema as ClientUpdateWithoutOrdersInputObjectSchema } from './ClientUpdateWithoutOrdersInput.schema';
import { ClientUncheckedUpdateWithoutOrdersInputObjectSchema as ClientUncheckedUpdateWithoutOrdersInputObjectSchema } from './ClientUncheckedUpdateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutOrdersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutOrdersInputObjectSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutOrdersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ClientWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ClientWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ClientUpdateToOneWithWhereWithoutOrdersInputObjectSchema), z.lazy(() => ClientUpdateWithoutOrdersInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutOrdersInputObjectSchema)]).optional()
}).strict();
export const ClientUpdateOneWithoutOrdersNestedInputObjectSchema: z.ZodType<Prisma.ClientUpdateOneWithoutOrdersNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateOneWithoutOrdersNestedInput>;
export const ClientUpdateOneWithoutOrdersNestedInputObjectZodSchema = makeSchema();
