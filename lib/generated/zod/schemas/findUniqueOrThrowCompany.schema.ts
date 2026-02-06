import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';

export const CompanyFindUniqueOrThrowSchema: z.ZodType<Prisma.CompanyFindUniqueOrThrowArgs> = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CompanyFindUniqueOrThrowArgs>;

export const CompanyFindUniqueOrThrowZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), include: CompanyIncludeObjectSchema.optional(), where: CompanyWhereUniqueInputObjectSchema }).strict();