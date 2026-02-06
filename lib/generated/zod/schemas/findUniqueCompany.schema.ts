import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';

export const CompanyFindUniqueSchema: z.ZodType<Prisma.CompanyFindUniqueArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CompanyFindUniqueArgs>;

export const CompanyFindUniqueZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict();