import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './BundleItemSelect.schema';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './BundleItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleItemSelectObjectSchema).optional(),
  include: z.lazy(() => BundleItemIncludeObjectSchema).optional()
}).strict();
export const BundleItemArgsObjectSchema = makeSchema();
export const BundleItemArgsObjectZodSchema = makeSchema();
