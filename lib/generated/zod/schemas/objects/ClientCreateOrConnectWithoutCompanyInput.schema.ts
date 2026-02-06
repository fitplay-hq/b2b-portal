import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './ClientWhereUniqueInput.schema';
import { ClientCreateWithoutCompanyInputObjectSchema as ClientCreateWithoutCompanyInputObjectSchema } from './ClientCreateWithoutCompanyInput.schema';
import { ClientUncheckedCreateWithoutCompanyInputObjectSchema as ClientUncheckedCreateWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClientCreateWithoutCompanyInputObjectSchema), z.lazy(() => ClientUncheckedCreateWithoutCompanyInputObjectSchema)])
}).strict();
export const ClientCreateOrConnectWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateOrConnectWithoutCompanyInput>;
export const ClientCreateOrConnectWithoutCompanyInputObjectZodSchema = makeSchema();
