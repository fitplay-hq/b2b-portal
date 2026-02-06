import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCountOutputTypeSelectObjectSchema as BundleCountOutputTypeSelectObjectSchema } from './BundleCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BundleCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BundleCountOutputTypeArgsObjectSchema = makeSchema();
export const BundleCountOutputTypeArgsObjectZodSchema = makeSchema();
