import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './objects/CompanyWhereInput.schema';

export const CompanyDeleteManySchema: z.ZodType<Prisma.CompanyDeleteManyArgs> = z.object({ where: CompanyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CompanyDeleteManyArgs>;

export const CompanyDeleteManyZodSchema = z.object({ where: CompanyWhereInputObjectSchema.optional() }).strict();