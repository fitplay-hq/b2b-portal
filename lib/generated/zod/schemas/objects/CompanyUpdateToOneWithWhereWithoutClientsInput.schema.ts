import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema';
import { CompanyUpdateWithoutClientsInputObjectSchema as CompanyUpdateWithoutClientsInputObjectSchema } from './CompanyUpdateWithoutClientsInput.schema';
import { CompanyUncheckedUpdateWithoutClientsInputObjectSchema as CompanyUncheckedUpdateWithoutClientsInputObjectSchema } from './CompanyUncheckedUpdateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CompanyUpdateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateWithoutClientsInputObjectSchema)])
}).strict();
export const CompanyUpdateToOneWithWhereWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyUpdateToOneWithWhereWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateToOneWithWhereWithoutClientsInput>;
export const CompanyUpdateToOneWithWhereWithoutClientsInputObjectZodSchema = makeSchema();
