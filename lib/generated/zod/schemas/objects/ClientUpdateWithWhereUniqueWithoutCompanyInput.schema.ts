import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientUpdateWithoutCompanyInputObjectSchema as ClientUpdateWithoutCompanyInputObjectSchema } from './ClientUpdateWithoutCompanyInput.schema';
import { ClientUncheckedUpdateWithoutCompanyInputObjectSchema as ClientUncheckedUpdateWithoutCompanyInputObjectSchema } from './ClientUncheckedUpdateWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ClientUpdateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedUpdateWithoutCompanyInputObjectSchema)])
}).strict();
export const ClientUpdateWithWhereUniqueWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientUpdateWithWhereUniqueWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateWithWhereUniqueWithoutCompanyInput>;
export const ClientUpdateWithWhereUniqueWithoutCompanyInputObjectZodSchema = makeSchema();
