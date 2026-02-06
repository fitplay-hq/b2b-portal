import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  token: z.boolean().optional(),
  identifier: z.boolean().optional(),
  password: z.boolean().optional(),
  userId: z.boolean().optional(),
  userType: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  expires: z.boolean().optional()
}).strict();
export const LoginTokenSelectObjectSchema: z.ZodType<Prisma.LoginTokenSelect> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenSelect>;
export const LoginTokenSelectObjectZodSchema = makeSchema();
