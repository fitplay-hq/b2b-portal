import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  token: z.string().optional()
}).strict();
export const ResetTokenWhereUniqueInputObjectSchema: z.ZodType<Prisma.ResetTokenWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenWhereUniqueInput>;
export const ResetTokenWhereUniqueInputObjectZodSchema = makeSchema();
