import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const AdminSelectObjectSchema: z.ZodType<Prisma.AdminSelect> = makeSchema() as unknown as z.ZodType<Prisma.AdminSelect>;
export const AdminSelectObjectZodSchema = makeSchema();
