import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string().optional()
}).strict();
export const AdminWhereUniqueInputObjectSchema: z.ZodType<Prisma.AdminWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AdminWhereUniqueInput>;
export const AdminWhereUniqueInputObjectZodSchema = makeSchema();
