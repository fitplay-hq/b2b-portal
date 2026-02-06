import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  token: z.string(),
  identifier: z.string(),
  password: z.string(),
  userId: z.string().optional().nullable(),
  userType: RoleSchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  expires: z.coerce.date()
}).strict();
export const LoginTokenUncheckedCreateInputObjectSchema: z.ZodType<Prisma.LoginTokenUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenUncheckedCreateInput>;
export const LoginTokenUncheckedCreateInputObjectZodSchema = makeSchema();
