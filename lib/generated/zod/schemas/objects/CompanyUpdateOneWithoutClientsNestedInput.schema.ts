import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyCreateWithoutClientsInputObjectSchema as CompanyCreateWithoutClientsInputObjectSchema } from './CompanyCreateWithoutClientsInput.schema';
import { CompanyUncheckedCreateWithoutClientsInputObjectSchema as CompanyUncheckedCreateWithoutClientsInputObjectSchema } from './CompanyUncheckedCreateWithoutClientsInput.schema';
import { CompanyCreateOrConnectWithoutClientsInputObjectSchema as CompanyCreateOrConnectWithoutClientsInputObjectSchema } from './CompanyCreateOrConnectWithoutClientsInput.schema';
import { CompanyUpsertWithoutClientsInputObjectSchema as CompanyUpsertWithoutClientsInputObjectSchema } from './CompanyUpsertWithoutClientsInput.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyUpdateToOneWithWhereWithoutClientsInputObjectSchema as CompanyUpdateToOneWithWhereWithoutClientsInputObjectSchema } from './CompanyUpdateToOneWithWhereWithoutClientsInput.schema';
import { CompanyUpdateWithoutClientsInputObjectSchema as CompanyUpdateWithoutClientsInputObjectSchema } from './CompanyUpdateWithoutClientsInput.schema';
import { CompanyUncheckedUpdateWithoutClientsInputObjectSchema as CompanyUncheckedUpdateWithoutClientsInputObjectSchema } from './CompanyUncheckedUpdateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CompanyCreateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutClientsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientsInputObjectSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutClientsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CompanyWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CompanyWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CompanyUpdateToOneWithWhereWithoutClientsInputObjectSchema), z.lazy(() => CompanyUpdateWithoutClientsInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateWithoutClientsInputObjectSchema)]).optional()
}).strict();
export const CompanyUpdateOneWithoutClientsNestedInputObjectSchema: z.ZodType<Prisma.CompanyUpdateOneWithoutClientsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateOneWithoutClientsNestedInput>;
export const CompanyUpdateOneWithoutClientsNestedInputObjectZodSchema = makeSchema();
