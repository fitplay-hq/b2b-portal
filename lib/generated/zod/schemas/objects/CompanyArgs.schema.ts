import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanySelectObjectSchema as CompanySelectObjectSchema } from './CompanySelect.schema';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './CompanyInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CompanySelectObjectSchema).optional(),
  include: z.lazy(() => CompanyIncludeObjectSchema).optional()
}).strict();
export const CompanyArgsObjectSchema = makeSchema();
export const CompanyArgsObjectZodSchema = makeSchema();
