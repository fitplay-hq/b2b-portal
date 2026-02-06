import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanyCreateManyInputObjectSchema as CompanyCreateManyInputObjectSchema } from './objects/CompanyCreateManyInput.schema';

export const CompanyCreateManySchema: z.ZodType<Prisma.CompanyCreateManyArgs> = z.object({ data: z.union([ CompanyCreateManyInputObjectSchema, z.array(CompanyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CompanyCreateManyArgs>;

export const CompanyCreateManyZodSchema = z.object({ data: z.union([ CompanyCreateManyInputObjectSchema, z.array(CompanyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();