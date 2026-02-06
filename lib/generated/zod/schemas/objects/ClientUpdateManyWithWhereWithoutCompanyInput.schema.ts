import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientScalarWhereInputObjectSchema as ClientScalarWhereInputObjectSchema } from './ClientScalarWhereInput.schema';
import { ClientUpdateManyMutationInputObjectSchema as ClientUpdateManyMutationInputObjectSchema } from './ClientUpdateManyMutationInput.schema';
import { ClientUncheckedUpdateManyWithoutCompanyInputObjectSchema as ClientUncheckedUpdateManyWithoutCompanyInputObjectSchema } from './ClientUncheckedUpdateManyWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ClientUpdateManyMutationInputObjectSchema), z.lazy(() => ClientUncheckedUpdateManyWithoutCompanyInputObjectSchema)])
}).strict();
export const ClientUpdateManyWithWhereWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientUpdateManyWithWhereWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUpdateManyWithWhereWithoutCompanyInput>;
export const ClientUpdateManyWithWhereWithoutCompanyInputObjectZodSchema = makeSchema();
