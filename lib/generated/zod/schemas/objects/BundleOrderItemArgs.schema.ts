import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './BundleOrderItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleOrderItemSelectObjectSchema).optional(),
  include: z.lazy(() => BundleOrderItemIncludeObjectSchema).optional()
}).strict();
export const BundleOrderItemArgsObjectSchema = makeSchema();
export const BundleOrderItemArgsObjectZodSchema = makeSchema();
