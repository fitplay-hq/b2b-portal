import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCountOutputTypeSelectObjectSchema as SubCategoryCountOutputTypeSelectObjectSchema } from './SubCategoryCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SubCategoryCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SubCategoryCountOutputTypeArgsObjectSchema = makeSchema();
export const SubCategoryCountOutputTypeArgsObjectZodSchema = makeSchema();
