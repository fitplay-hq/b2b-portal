import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './BundleInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleSelectObjectSchema).optional(),
  include: z.lazy(() => BundleIncludeObjectSchema).optional()
}).strict();
export const BundleArgsObjectSchema = makeSchema();
export const BundleArgsObjectZodSchema = makeSchema();
