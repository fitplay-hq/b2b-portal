import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema as OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema } from './OrderUncheckedCreateNestedManyWithoutClientInput.schema';
import { ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema as ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateNestedManyWithoutClientInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  companyID: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  isShowPrice: z.boolean().optional(),
  address: z.string().max(100),
  role: RoleSchema.optional(),
  createdAt: z.coerce.date().optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema).optional(),
  products: z.lazy(() => ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ClientUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUncheckedCreateInput>;
export const ClientUncheckedCreateInputObjectZodSchema = makeSchema();
