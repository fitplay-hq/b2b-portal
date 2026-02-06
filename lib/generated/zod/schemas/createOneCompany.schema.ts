import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyCreateInputObjectSchema as CompanyCreateInputObjectSchema } from './objects/CompanyCreateInput.schema';
import { CompanyUncheckedCreateInputObjectSchema as CompanyUncheckedCreateInputObjectSchema } from './objects/CompanyUncheckedCreateInput.schema';

export const CompanyCreateOneSchema: z.ZodType<Prisma.CompanyCreateArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), data: z.union([CompanyCreateInputObjectSchema, CompanyUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CompanyCreateArgs>;

export const CompanyCreateOneZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), data: z.union([CompanyCreateInputObjectSchema, CompanyUncheckedCreateInputObjectSchema]) }).strict();