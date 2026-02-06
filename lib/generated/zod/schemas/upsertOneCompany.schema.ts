import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';
import { CompanyCreateInputObjectSchema as CompanyCreateInputObjectSchema } from './objects/CompanyCreateInput.schema';
import { CompanyUncheckedCreateInputObjectSchema as CompanyUncheckedCreateInputObjectSchema } from './objects/CompanyUncheckedCreateInput.schema';
import { CompanyUpdateInputObjectSchema as CompanyUpdateInputObjectSchema } from './objects/CompanyUpdateInput.schema';
import { CompanyUncheckedUpdateInputObjectSchema as CompanyUncheckedUpdateInputObjectSchema } from './objects/CompanyUncheckedUpdateInput.schema';

export const CompanyUpsertOneSchema: z.ZodType<Prisma.CompanyUpsertArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema, create: z.union([ CompanyCreateInputObjectSchema, CompanyUncheckedCreateInputObjectSchema ]), update: z.union([ CompanyUpdateInputObjectSchema, CompanyUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CompanyUpsertArgs>;

export const CompanyUpsertOneZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema, create: z.union([ CompanyCreateInputObjectSchema, CompanyUncheckedCreateInputObjectSchema ]), update: z.union([ CompanyUpdateInputObjectSchema, CompanyUncheckedUpdateInputObjectSchema ]) }).strict();