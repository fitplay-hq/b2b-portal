import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50).optional()
}).strict();
export const SystemRoleWhereUniqueInputObjectSchema: z.ZodType<Prisma.SystemRoleWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleWhereUniqueInput>;
export const SystemRoleWhereUniqueInputObjectZodSchema = makeSchema();
