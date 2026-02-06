import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientUpdateWithoutCompanyInputObjectSchema as ClientUpdateWithoutCompanyInputObjectSchema } from './ClientUpdateWithoutCompanyInput.schema';
import { ClientUncheckedUpdateWithoutCompanyInputObjectSchema as ClientUncheckedUpdateWithoutCompanyInputObjectSchema } from './ClientUncheckedUpdateWithoutCompanyInput.schema';
import { ClientCreateWithoutCompanyInputObjectSchema as ClientCreateWithoutCompanyInputObjectSchema } from './ClientCreateWithoutCompanyInput.schema';
import { ClientUncheckedCreateWithoutCompanyInputObjectSchema as ClientUncheckedCreateWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ClientUpdateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutCompanyInputObjectSchema)]),
  create: z.union([z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema)])
}).strict();
export const ClientUpsertWithWhereUniqueWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientUpsertWithWhereUniqueWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpsertWithWhereUniqueWithoutCompanyInput>;
export const ClientUpsertWithWhereUniqueWithoutCompanyInputObjectZodSchema = makeSchema();
