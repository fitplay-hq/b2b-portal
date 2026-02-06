import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereInputObjectSchema).optional()
}).strict();
export const ProductCountOutputTypeCountCompaniesArgsObjectSchema = makeSchema();
export const ProductCountOutputTypeCountCompaniesArgsObjectZodSchema = makeSchema();
