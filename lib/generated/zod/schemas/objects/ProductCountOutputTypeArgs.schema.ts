import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCountOutputTypeSelectObjectSchema as ProductCountOutputTypeSelectObjectSchema } from './ProductCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ProductCountOutputTypeArgsObjectSchema = makeSchema();
export const ProductCountOutputTypeArgsObjectZodSchema = makeSchema();
