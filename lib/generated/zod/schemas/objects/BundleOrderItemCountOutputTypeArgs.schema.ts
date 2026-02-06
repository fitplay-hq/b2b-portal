import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCountOutputTypeSelectObjectSchema as BundleOrderItemCountOutputTypeSelectObjectSchema } from './BundleOrderItemCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleOrderItemCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BundleOrderItemCountOutputTypeArgsObjectSchema = makeSchema();
export const BundleOrderItemCountOutputTypeArgsObjectZodSchema = makeSchema();
