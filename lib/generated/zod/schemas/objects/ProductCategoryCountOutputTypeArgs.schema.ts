import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCountOutputTypeSelectObjectSchema as ProductCategoryCountOutputTypeSelectObjectSchema } from './ProductCategoryCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductCategoryCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ProductCategoryCountOutputTypeArgsObjectSchema = makeSchema();
export const ProductCategoryCountOutputTypeArgsObjectZodSchema = makeSchema();
