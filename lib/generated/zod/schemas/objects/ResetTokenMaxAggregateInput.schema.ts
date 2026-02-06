import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  identifier: z.literal(true).optional(),
  password: z.literal(true).optional(),
  token: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  userType: z.literal(true).optional(),
  expires: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const ResetTokenMaxAggregateInputObjectSchema: z.ZodType<Prisma.ResetTokenMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenMaxAggregateInputType>;
export const ResetTokenMaxAggregateInputObjectZodSchema = makeSchema();
