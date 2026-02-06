import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';

export const CompanyDeleteOneSchema: z.ZodType<Prisma.CompanyDeleteArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CompanyDeleteArgs>;

export const CompanyDeleteOneZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict();