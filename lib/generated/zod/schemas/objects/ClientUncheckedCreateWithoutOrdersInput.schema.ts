import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema as ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateNestedManyWithoutClientInput.schema'

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
  products: z.lazy(() => ClientProductUncheckedCreateNestedManyWithoutClientInputObjectSchema).optional()
}).strict();
export const ClientUncheckedCreateWithoutOrdersInputObjectSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientUncheckedCreateWithoutOrdersInput>;
export const ClientUncheckedCreateWithoutOrdersInputObjectZodSchema = makeSchema();
