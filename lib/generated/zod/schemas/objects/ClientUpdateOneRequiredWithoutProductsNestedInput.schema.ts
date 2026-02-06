import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateWithoutProductsInputObjectSchema as ClientCreateWithoutProductsInputObjectSchema } from './ClientCreateWithoutProductsInput.schema';
import { ClientUncheckedCreateWithoutProductsInputObjectSchema as ClientUncheckedCreateWithoutProductsInputObjectSchema } from './ClientUncheckedCreateWithoutProductsInput.schema';
import { ClientCreateOrConnectWithoutProductsInputObjectSchema as ClientCreateOrConnectWithoutProductsInputObjectSchema } from './ClientCreateOrConnectWithoutProductsInput.schema';
import { ClientUpsertWithoutProductsInputObjectSchema as ClientUpsertWithoutProductsInputObjectSchema } from './ClientUpsertWithoutProductsInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientUpdateToOneWithWhereWithoutProductsInputObjectSchema as ClientUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './ClientUpdateToOneWithWhereWithoutProductsInput.schema';
import { ClientUpdateWithoutProductsInputObjectSchema as ClientUpdateWithoutProductsInputObjectSchema } from './ClientUpdateWithoutProductsInput.schema';
import { ClientUncheckedUpdateWithoutProductsInputObjectSchema as ClientUncheckedUpdateWithoutProductsInputObjectSchema } from './ClientUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClientCreateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ClientUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => ClientUpdateWithoutProductsInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.ClientUpdateOneRequiredWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateOneRequiredWithoutProductsNestedInput>;
export const ClientUpdateOneRequiredWithoutProductsNestedInputObjectZodSchema = makeSchema();
