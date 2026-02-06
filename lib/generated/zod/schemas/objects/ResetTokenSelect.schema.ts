import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  identifier: z.boolean().optional(),
  password: z.boolean().optional(),
  token: z.boolean().optional(),
  userId: z.boolean().optional(),
  userType: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional()
}).strict();
export const ResetTokenSelectObjectSchema: z.ZodType<Prisma.ResetTokenSelect> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenSelect>;
export const ResetTokenSelectObjectZodSchema = makeSchema();
