import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema'

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
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientCreateManyInputObjectSchema: z.ZodType<Prisma.ClientCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateManyInput>;
export const ClientCreateManyInputObjectZodSchema = makeSchema();
