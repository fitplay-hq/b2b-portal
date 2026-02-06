import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema as OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema } from './OrderUncheckedCreateNestedManyWithoutClientInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  companyID: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  isShowPrice: z.boolean().optional(),
  address: z.string(),
  role: RoleSchema.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUncheckedCreateWithoutProductsInput>;
export const ClientUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
