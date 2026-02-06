import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyUpdateInputObjectSchema as CompanyUpdateInputObjectSchema } from './objects/CompanyUpdateInput.schema';
import { CompanyUncheckedUpdateInputObjectSchema as CompanyUncheckedUpdateInputObjectSchema } from './objects/CompanyUncheckedUpdateInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';

export const CompanyUpdateOneSchema: z.ZodType<Prisma.CompanyUpdateArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), data: z.union([CompanyUpdateInputObjectSchema, CompanyUncheckedUpdateInputObjectSchema]), where: CompanyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CompanyUpdateArgs>;

export const CompanyUpdateOneZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), data: z.union([CompanyUpdateInputObjectSchema, CompanyUncheckedUpdateInputObjectSchema]), where: CompanyWhereUniqueInputObjectSchema }).strict();