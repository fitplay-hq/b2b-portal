import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => CompanyWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => CompanyWhereInputObjectSchema).optional().nullable()
}).strict();
export const CompanyNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.CompanyNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CompanyNullableScalarRelationFilter>;
export const CompanyNullableScalarRelationFilterObjectZodSchema = makeSchema();
