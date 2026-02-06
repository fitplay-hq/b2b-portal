import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CompanyWhereInputObjectSchema).optional(),
  some: z.lazy(() => CompanyWhereInputObjectSchema).optional(),
  none: z.lazy(() => CompanyWhereInputObjectSchema).optional()
}).strict();
export const CompanyListRelationFilterObjectSchema: z.ZodType<Prisma.CompanyListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CompanyListRelationFilter>;
export const CompanyListRelationFilterObjectZodSchema = makeSchema();
