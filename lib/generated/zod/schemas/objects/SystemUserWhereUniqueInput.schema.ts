import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string().optional()
}).strict();
export const SystemUserWhereUniqueInputObjectSchema: z.ZodType<Prisma.SystemUserWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserWhereUniqueInput>;
export const SystemUserWhereUniqueInputObjectZodSchema = makeSchema();
