import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './SubCategoryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SubCategorySelectObjectSchema).optional(),
  include: z.lazy(() => SubCategoryIncludeObjectSchema).optional()
}).strict();
export const SubCategoryArgsObjectSchema = makeSchema();
export const SubCategoryArgsObjectZodSchema = makeSchema();
