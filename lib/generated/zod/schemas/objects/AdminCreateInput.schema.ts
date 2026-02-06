import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string(),
  password: z.string(),
  role: RoleSchema.optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const AdminCreateInputObjectSchema: z.ZodType<Prisma.AdminCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AdminCreateInput>;
export const AdminCreateInputObjectZodSchema = makeSchema();
