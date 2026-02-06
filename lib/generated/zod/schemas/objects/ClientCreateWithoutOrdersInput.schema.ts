import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { CompanyCreateNestedOneWithoutClientsInputObjectSchema as CompanyCreateNestedOneWithoutClientsInputObjectSchema } from './CompanyCreateNestedOneWithoutClientsInput.schema';
import { ClientProductCreateNestedManyWithoutClientInputObjectSchema as ClientProductCreateNestedManyWithoutClientInputObjectSchema } from './ClientProductCreateNestedManyWithoutClientInput.schema'

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
  products: z.lazy(() => ClientProductCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientCreateWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientCreateWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateWithoutOrdersInput>;
export const ClientCreateWithoutOrdersInputObjectZodSchema = makeSchema();
