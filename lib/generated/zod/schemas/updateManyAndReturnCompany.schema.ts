import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './objects/CompanySelect.schema';
import { CompanyUpdateManyMutationInputObjectSchema as CompanyUpdateManyMutationInputObjectSchema } from './objects/CompanyUpdateManyMutationInput.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './objects/CompanyWhereInput.schema';

export const CompanyUpdateManyAndReturnSchema: z.ZodType<Prisma.CompanyUpdateManyAndReturnArgs> = z.object({ select: CompanySelectObjectSchema.optional(), data: CompanyUpdateManyMutationInputObjectSchema, where: CompanyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CompanyUpdateManyAndReturnArgs>;

export const CompanyUpdateManyAndReturnZodSchema = z.object({ select: CompanySelectObjectSchema.optional(), data: CompanyUpdateManyMutationInputObjectSchema, where: CompanyWhereInputObjectSchema.optional() }).strict();