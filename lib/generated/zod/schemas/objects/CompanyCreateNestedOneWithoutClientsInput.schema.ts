import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyCreateWithoutClientsInputObjectSchema as CompanyCreateWithoutClientsInputObjectSchema } from './CompanyCreateWithoutClientsInput.schema';
import { CompanyUncheckedCreateWithoutClientsInputObjectSchema as CompanyUncheckedCreateWithoutClientsInputObjectSchema } from './CompanyUncheckedCreateWithoutClientsInput.schema';
import { CompanyCreateOrConnectWithoutClientsInputObjectSchema as CompanyCreateOrConnectWithoutClientsInputObjectSchema } from './CompanyCreateOrConnectWithoutClientsInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CompanyCreateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutClientsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientsInputObjectSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputObjectSchema).optional()
}).strict();
export const CompanyCreateNestedOneWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateNestedOneWithoutClientsInput>;
export const CompanyCreateNestedOneWithoutClientsInputObjectZodSchema = makeSchema();
