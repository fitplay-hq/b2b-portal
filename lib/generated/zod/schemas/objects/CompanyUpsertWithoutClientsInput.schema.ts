import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyUpdateWithoutClientsInputObjectSchema as CompanyUpdateWithoutClientsInputObjectSchema } from './CompanyUpdateWithoutClientsInput.schema';
import { CompanyUncheckedUpdateWithoutClientsInputObjectSchema as CompanyUncheckedUpdateWithoutClientsInputObjectSchema } from './CompanyUncheckedUpdateWithoutClientsInput.schema';
import { CompanyCreateWithoutClientsInputObjectSchema as CompanyCreateWithoutClientsInputObjectSchema } from './CompanyCreateWithoutClientsInput.schema';
import { CompanyUncheckedCreateWithoutClientsInputObjectSchema as CompanyUncheckedCreateWithoutClientsInputObjectSchema } from './CompanyUncheckedCreateWithoutClientsInput.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CompanyUpdateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateWithoutClientsInputObjectSchema)]),
  create: z.union([z.lazy(() => CompanyCreateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutClientsInputObjectSchema)]),
  where: z.lazy(() => CompanyWhereInputObjectSchema).optional()
}).strict();
export const CompanyUpsertWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyUpsertWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpsertWithoutClientsInput>;
export const CompanyUpsertWithoutClientsInputObjectZodSchema = makeSchema();
