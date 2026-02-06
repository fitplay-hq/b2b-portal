import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const CompanyWhereUniqueInputObjectSchema: z.ZodType<Prisma.CompanyWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyWhereUniqueInput>;
export const CompanyWhereUniqueInputObjectZodSchema = makeSchema();
