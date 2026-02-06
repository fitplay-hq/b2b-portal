import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  address: z.string().max(100),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CompanyCreateManyInputObjectSchema: z.ZodType<Prisma.CompanyCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateManyInput>;
export const CompanyCreateManyInputObjectZodSchema = makeSchema();
