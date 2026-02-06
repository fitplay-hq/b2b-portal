import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyCreateWithoutClientsInputObjectSchema as CompanyCreateWithoutClientsInputObjectSchema } from './CompanyCreateWithoutClientsInput.schema';
import { CompanyUncheckedCreateWithoutClientsInputObjectSchema as CompanyUncheckedCreateWithoutClientsInputObjectSchema } from './CompanyUncheckedCreateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CompanyCreateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutClientsInputObjectSchema)])
}).strict();
export const CompanyCreateOrConnectWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateOrConnectWithoutClientsInput>;
export const CompanyCreateOrConnectWithoutClientsInputObjectZodSchema = makeSchema();
