import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { CompanyCreateNestedOneWithoutClientsInputObjectSchema as CompanyCreateNestedOneWithoutClientsInputObjectSchema } from './CompanyCreateNestedOneWithoutClientsInput.schema';
import { OrderCreateNestedManyWithoutClientInputObjectSchema as OrderCreateNestedManyWithoutClientInputObjectSchema } from './OrderCreateNestedManyWithoutClientInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  companyName: z.string().optional().nullable(),
  isShowPrice: z.boolean().optional(),
  address: z.string().max(100),
  role: RoleSchema.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientsInputObjectSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateWithoutProductsInput>;
export const ClientCreateWithoutProductsInputObjectZodSchema = makeSchema();
