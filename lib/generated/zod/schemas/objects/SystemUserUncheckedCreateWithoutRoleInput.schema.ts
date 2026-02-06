import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SystemUserUncheckedCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserUncheckedCreateWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserUncheckedCreateWithoutRoleInput>;
export const SystemUserUncheckedCreateWithoutRoleInputObjectZodSchema = makeSchema();
