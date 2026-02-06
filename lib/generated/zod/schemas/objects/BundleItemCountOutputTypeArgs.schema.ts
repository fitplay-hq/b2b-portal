import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCountOutputTypeSelectObjectSchema as BundleItemCountOutputTypeSelectObjectSchema } from './BundleItemCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleItemCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BundleItemCountOutputTypeArgsObjectSchema = makeSchema();
export const BundleItemCountOutputTypeArgsObjectZodSchema = makeSchema();
