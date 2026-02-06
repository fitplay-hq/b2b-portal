import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { OrderCreateNestedManyWithoutClientInputObjectSchema as OrderCreateNestedManyWithoutClientInputObjectSchema } from './OrderCreateNestedManyWithoutClientInput.schema';
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
  orders: z.lazy(() => OrderCreateNestedManyWithoutClientInputObjectSchema).optional(),
  products: z.lazy(() => ClientProductCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientCreateWithoutCompanyInputObjectSchema: z.ZodType<Prisma.ClientCreateWithoutCompanyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateWithoutCompanyInput>;
export const ClientCreateWithoutCompanyInputObjectZodSchema = makeSchema();
