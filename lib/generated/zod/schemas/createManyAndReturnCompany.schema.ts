import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyCreateManyInputObjectSchema as CompanyCreateManyInputObjectSchema } from './objects/CompanyCreateManyInput.schema';

export const CompanyCreateManyAndReturnSchema: z.ZodType<Prisma.CompanyCreateManyAndReturnArgs> = z.object({ select: CompanySelectObjectSchema.optional(), data: z.union([ CompanyCreateManyInputObjectSchema, z.array(CompanyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CompanyCreateManyAndReturnArgs>;

export const CompanyCreateManyAndReturnZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), data: z.union([ CompanyCreateManyInputObjectSchema, z.array(CompanyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();