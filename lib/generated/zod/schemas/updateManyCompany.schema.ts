import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanyUpdateManyMutationInputObjectSchema as CompanyUpdateManyMutationInputObjectSchema } from './objects/CompanyUpdateManyMutationInput.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './objects/CompanyWhereInput.schema';

export const CompanyUpdateManySchema: z.ZodType<Prisma.CompanyUpdateManyArgs> = z.object({ data: CompanyUpdateManyMutationInputObjectSchema, where: CompanyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CompanyUpdateManyArgs>;

export const CompanyUpdateManyZodSchema = z.object({ data: CompanyUpdateManyMutationInputObjectSchema, where: CompanyWhereInputObjectSchema.optional() }).strict();