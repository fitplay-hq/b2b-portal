import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  identifier: z.string(),
  password: z.string(),
  token: z.string(),
  userId: z.string().optional().nullable(),
  userType: RoleSchema.optional().nullable(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ResetTokenCreateManyInputObjectSchema: z.ZodType<Prisma.ResetTokenCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenCreateManyInput>;
export const ResetTokenCreateManyInputObjectZodSchema = makeSchema();
